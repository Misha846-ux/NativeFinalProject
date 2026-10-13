import type {
	AdvancedSearchDTO,
	CreateHotelDTO,
	GetHotelRoomsDTO,
	GetHotelsDTO,
	HotelReviewsResponse,
	HotelDTO,
	HotelCardDataDTO,
	FilterCountsDTO,
	NearestPlaceResponse,
	PaginatedHotelsResponse,
	PaginatedRoomsResponse,
	PaginationDTO,
	PhotoUploadResponse,
	PhotosResponse,
} from "../Models/dto";
import { apiRequest, jsonBody, paginationQuery } from "./apiRequest";

export async function createHotel(hotel: CreateHotelDTO): Promise<HotelDTO> {
	return apiRequest<HotelDTO>("/hotels/create/", {
		method: "POST",
		...jsonBody(hotel),
	});
}

export async function getHotels(
	filters: GetHotelsDTO,
	pagination: PaginationDTO,
): Promise<PaginatedHotelsResponse> {
	return apiRequest<PaginatedHotelsResponse>(
		`/hotels/get/${paginationQuery(pagination)}`,
		{
			method: "PUT",
			...jsonBody(filters),
		},
	);
}

export async function advancedSearchHotels(
	filters: AdvancedSearchDTO,
	pagination: PaginationDTO,
): Promise<PaginatedHotelsResponse> {
	return apiRequest<PaginatedHotelsResponse>(
		`/hotels/advancedFilter/${paginationQuery(pagination)}`,
		{
			method: "PUT",
			...jsonBody(filters),
		},
	);
}

export async function getHotelPhotos(hotelId: number): Promise<PhotosResponse> {
	return apiRequest<PhotosResponse>(`/hotels/get/${hotelId}/photos/`, {
		method: "PUT",
	});
}

export async function uploadHotelPhoto(
	hotelId: number,
	file: File): Promise<PhotoUploadResponse> {
	const formData = new FormData();
	formData.append("file", file);

	return apiRequest<PhotoUploadResponse>(
		`/hotels/post/${hotelId}/photos/`,
		{
			method: "POST",
			body: formData,
		},
	);
}

export async function getHotelRooms(
	hotelId: number,
	filters: GetHotelRoomsDTO,
): Promise<PaginatedRoomsResponse> {
	const { el, page, ...roomFilters } = filters;

	return apiRequest<PaginatedRoomsResponse>(
		`/hotels/${hotelId}/rooms/${paginationQuery({ el, page })}`,
		{
			method: "PUT",
			...jsonBody(roomFilters),
		},
	);
}

export async function getHotelNearestTrainStation(
	hotelId: number): Promise<NearestPlaceResponse> {
	return apiRequest<NearestPlaceResponse>(
		`/hotels/${hotelId}/NearestTrainStation/`,
		{ method: "PUT" },
	);
}

export async function getHotelNearestAirport(
	hotelId: number): Promise<NearestPlaceResponse> {
	return apiRequest<NearestPlaceResponse>(
		`/hotels/${hotelId}/NearestAirport/`,
		{ method: "PUT" },
	);
}

export async function getHotelReviews(
	hotelId: number,
): Promise<HotelReviewsResponse> {
	return apiRequest<HotelReviewsResponse>(
		`/hotels/${hotelId}/reviews/`,
		{ method: "GET" },
	);
}

export async function getHotelCityCenter(
	hotelId: number): Promise<NearestPlaceResponse> {
	return apiRequest<NearestPlaceResponse>(
		`/hotels/${hotelId}/CityCenter/`,
		{ method: "PUT" },
	);
}

export async function getHotelCardData(
	hotelId: number,
): Promise<HotelCardDataDTO> {
	return apiRequest<HotelCardDataDTO>(
		`/hotels/${hotelId}/card-data/`,
		{ method: "PUT" },
	);
}

export async function getHotelCardDataBatch(
	hotelIds: number[],
): Promise<Record<number, HotelCardDataDTO>> {
	return apiRequest<Record<number, HotelCardDataDTO>>(
		"/hotels/card-data-batch/",
		{
			method: "POST",
			...jsonBody({ hotel_ids: hotelIds }),
		},
	);
}

export async function getFilterCounts(): Promise<FilterCountsDTO> {
	return apiRequest<FilterCountsDTO>("/hotels/filter-counts/", {
		method: "GET",
	});
}




