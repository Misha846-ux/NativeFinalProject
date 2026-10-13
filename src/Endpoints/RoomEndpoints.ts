import type {
    CreateRoomDTO,
    PhotoUploadResponse,
    PhotosResponse,
    RoomAvailabilityDTO,
    RoomDTO,
} from "../Models/dto";
import { apiRequest, jsonBody } from "./apiRequest";

export async function createRoom(room: CreateRoomDTO): Promise<RoomDTO> {
    return apiRequest<RoomDTO>("/rooms/create/", {
        method: "POST",
        ...jsonBody(room),
    });
}

export async function uploadRoomPhoto(
    roomId: number,
    file: File,
): Promise<PhotoUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest<PhotoUploadResponse>(`/rooms/post/${roomId}/photos/`, {
        method: "POST",
        body: formData,
    });
}

export async function getRoomPhotos(roomId: number): Promise<PhotosResponse> {
    return apiRequest<PhotosResponse>(`/rooms/get/${roomId}/photos/`, {
        method: "PUT",
    });
}

export async function getRoomAvailability(
    roomId: number,
    checkIn: string,
    checkOut: string,
): Promise<RoomAvailabilityDTO> {
    return apiRequest<RoomAvailabilityDTO>(`/rooms/${roomId}/availability/`, {
        method: "PUT",
        ...jsonBody({
            checkIn: `${checkIn}T00:00:00`,
            checkOut: `${checkOut}T00:00:00`,
        }),
    });
}