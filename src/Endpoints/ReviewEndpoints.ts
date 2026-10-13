import type { MainPageReviewsResponse, MyReviewsResponse } from "../Models/dto";
import { apiRequest } from "./apiRequest";


export async function getLatestReviews(): Promise<MainPageReviewsResponse> {
    return apiRequest<MainPageReviewsResponse>(
        "/reviews/",
        { method: "GET" },
    );
}

export async function getMyReviews(): Promise<MyReviewsResponse> {
    return apiRequest<MyReviewsResponse>(
        "/user/reviews/",
        { method: "GET" },
    );
}