import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { PaginationDTO } from "../Models/dto";
import { isHtmlResponse, responseErrorMessage } from "../utils/apiError";

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl as string | undefined;
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_PROVIDER_KEY = "authProvider";

const supportsSecureStore = Platform.OS !== "web";

export function paginationQuery({ el, page }: PaginationDTO): string {
    return `?el=${encodeURIComponent(el)}&page=${encodeURIComponent(page)}`;
}

export async function getStoredAccessToken(): Promise<string | null> {
    if (!supportsSecureStore) return null;
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function setAuthTokens(
    access: string,
    refresh: string,
    provider: "password" | "google" = "password",
): Promise<void> {
    if (!supportsSecureStore) {
        throw new Error("Secure authentication tokens are not supported on web.");
    }
    await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh),
        SecureStore.setItemAsync(AUTH_PROVIDER_KEY, provider),
    ]);
}

export async function clearAuthTokens(): Promise<void> {
    if (!supportsSecureStore) return;
    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(AUTH_PROVIDER_KEY),
    ]);
}

export async function getStoredAuthProvider(): Promise<"password" | "google" | null> {
    if (!supportsSecureStore) return null;
    const provider = await SecureStore.getItemAsync(AUTH_PROVIDER_KEY);
    return provider === "password" || provider === "google" ? provider : null;
}

function requireApiBaseUrl(): string {
    if (!API_BASE_URL) {
        throw new Error("VITE_API_URL is not configured. Add it to the mobile app .env file.");
    }
    return API_BASE_URL.replace(/\/+$/, "");
}

async function refreshAccessToken(): Promise<boolean> {
    if (!supportsSecureStore) return false;
    const refresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refresh) return false;

    const response = await fetch(`${requireApiBaseUrl()}/user/token/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });
    if (!response.ok) {
        await clearAuthTokens();
        return false;
    }
    const tokens = await response.json() as { access?: string; refresh?: string };
    if (!tokens.access) {
        await clearAuthTokens();
        throw new Error("The token refresh response did not include an access token.");
    }
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access);
    if (tokens.refresh) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh);
    return true;
}

async function performRequest(path: string, options: RequestInit, token: string | null): Promise<Response> {
    const headers = new Headers(options.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(`${requireApiBaseUrl()}${path}`, { ...options, headers });
}

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    let token = await getStoredAccessToken();
    let response = await performRequest(path, options, token);

    if (response.status === 401 && await refreshAccessToken()) {
        token = await getStoredAccessToken();
        response = await performRequest(path, options, token);
    }
    if (response.status === 401) await clearAuthTokens();

    const contentType = response.headers.get("content-type") ?? "";
    const responseText = await response.text();
    if (!response.ok) {
        throw new Error(
            responseErrorMessage(
                response.status,
                contentType,
                responseText,
            ),
        );
    }
    if (!responseText) return null as T;
    try {
        return JSON.parse(responseText) as T;
    } catch {
        if (isHtmlResponse(contentType, responseText)) {
            throw new Error(responseErrorMessage(response.status, contentType, responseText));
        }
        return responseText as T;
    }
}

export function jsonBody<T>(data: T): RequestInit {
    return {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };
}
