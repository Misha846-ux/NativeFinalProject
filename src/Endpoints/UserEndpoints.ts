import type {
    AuthAccountDTO,
    PhotoUploadResponse,
    UserProfileResponse,
    UserProfileUpdateDTO,
} from "../Models/dto";
import { apiRequest, jsonBody } from "./apiRequest";

export async function sendAuthCode(account: AuthAccountDTO): Promise<string> {
    return apiRequest<string>("/user/sendAuthCode", {
        method: "POST",
        ...jsonBody(account),
    });
}

export async function createAccount(account: AuthAccountDTO): Promise<string> {
    return apiRequest<string>("/user/createAccount", {
        method: "POST",
        ...jsonBody(account),
    });
}

export async function verifyAccount(account: AuthAccountDTO): Promise<string> {
    return apiRequest<string>("/user/verifyAccount", {
        method: "PUT",
        ...jsonBody(account),
    });
}

export async function login(account: AuthAccountDTO): Promise<{ access: string; refresh: string }> {
    return apiRequest<{ access: string; refresh: string }>("/user/login", {
        method: "POST",
        ...jsonBody(account),
    });
}

export async function googleLogin(accessToken: string): Promise<{ access: string; refresh: string }> {
    return apiRequest<{ access: string; refresh: string }>("/user/google/login/", {
        method: "POST",
        ...jsonBody({ access_token: accessToken }),
    });
}

export async function getCurrentUser(): Promise<UserProfileResponse> {
    return apiRequest<UserProfileResponse>("/user/me/");
}

export async function getProfileStatus(): Promise<{ has_info: boolean }> {
    return apiRequest<{ has_info: boolean }>("/user/profile-status/");
}

export async function updateUserProfile(
    userId: number,
    profile: UserProfileUpdateDTO,
): Promise<UserProfileResponse> {
    return apiRequest<UserProfileResponse>(`/user/${userId}/profile`, {
        method: "PATCH",
        ...jsonBody(profile),
    });
}

export async function uploadUserPhoto(
    userId: number,
    file: File,
): Promise<PhotoUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest<PhotoUploadResponse>(`/user/${userId}/photo/`, {
        method: "POST",
        body: formData,
    });
}

export async function deleteUserPhoto(userId: number): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/user/${userId}/photo/delete/`, {
        method: "DELETE",
    });
}
