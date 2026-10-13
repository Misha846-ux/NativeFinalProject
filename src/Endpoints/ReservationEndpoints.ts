import type {
    CreateReservationDTO,
    MyReservationsResponse,
    ReservationDTO,
} from "../Models/dto";
import { apiRequest, jsonBody } from "./apiRequest";

export async function createReservation(
    reservation: CreateReservationDTO,
): Promise<ReservationDTO> {
    return apiRequest<ReservationDTO>("/reservation/create/", {
        method: "POST",
        ...jsonBody(reservation),
    });
}

export async function getReservation(
    reservationId: number,
    viewToken?: string | null,
): Promise<ReservationDTO> {
    const query = viewToken ? `?token=${encodeURIComponent(viewToken)}` : "";
    return apiRequest<ReservationDTO>(
        `/reservation/${reservationId}/${query}`,
        { method: "GET" },
    );
}

export async function getMyReservations(): Promise<MyReservationsResponse> {
    return apiRequest<MyReservationsResponse>("/user/reservations/", {
        method: "GET",
    });
}

export async function cancelReservation(
    reservationId: number,
): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
        `/reservation/${reservationId}/cancel/`,
        { method: "POST" },
    );
}
