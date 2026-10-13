export function isHtmlResponse(contentType: string, responseText: string): boolean {
    return contentType.toLowerCase().includes("text/html")
        || /^<(?:!doctype\s+html|html|head|body|title|div|table|form)(?:[\s>])/i.test(responseText.trim());
}

export function responseErrorMessage(
    status: number,
    contentType: string,
    responseText: string,
): string {
    const body = responseText.trim();

    if (isHtmlResponse(contentType, body)) {
        if (/DisallowedHost|Invalid HTTP_HOST header|ALLOWED_HOSTS/i.test(body)) {
            return "The backend rejected the API host. Add the API server's IP address or hostname to Django ALLOWED_HOSTS.";
        }
        return `The API returned an HTML page (HTTP ${status}). Check the API URL and backend configuration.`;
    }

    if (body) {
        try {
            const data: unknown = JSON.parse(body);
            if (typeof data === "object" && data !== null) {
                const record = data as Record<string, unknown>;
                if (typeof record.error === "string") return record.error;
                if (typeof record.detail === "string") return record.detail;
                for (const value of Object.values(record)) {
                    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
                    if (typeof value === "string") return value;
                }
            }
        } catch {
            return body;
        }
        return body;
    }

    return `Request failed with status ${status}.`;
}

export function apiErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return isHtmlResponse("", error.message)
            ? "The API returned an HTML error page. Check the API URL and backend configuration."
            : error.message;
    }
    return fallback;
}
