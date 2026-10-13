export type CountryDTO = {
    id: number;
    name: string;
};

export type CurrencyDTO = {
    id: number;
    currency: string;
};

export type DebitCardDTO = {
    id: number;
    name?: string;
    type?: string;
};

export type CityDTO = {
    id: number;
    name: string;
    center: string | null;
    center_latitude: string | null;
    center_longitude: string | null;
    country: number;
};

export type CreateCityDTO = Omit<
    CityDTO,
    "id" | "center_latitude" | "center_longitude"
>;

export type PaymentMethodDTO = {
    id: number;
    cardType: number;
    cardNumber: string;
    date: string;
};

export type CreatePaymentMethodDTO = Omit<PaymentMethodDTO, "id">;

export type ReservationDTO = {
    id: number;
    checkIn: string;
    checkOut: string;
    name: string;
    sureName: string;
    email: string;
    phoneNumber: string;
    cityGuide: boolean;
    allowChangeBooking: boolean;
    confirmByCall: boolean;
    confirmByEmail: boolean;
    totalPrice: string | null;
    room: number;
    user: number | null;
    country: number | null;
    payMethod: number | null;
    viewToken: string;
};

export type RoomAvailabilityDTO = {
    available: boolean;
    room: RoomDTO;
};

export type CreateReservationDTO = Omit<
    ReservationDTO,
    "id" | "user" | "totalPrice" | "viewToken"
> & {
    password?: string;
};

export type HotelDTO = {
    id: number;
    name: string;
    description: string | null;
    address: string;
    latitude: string | null;
    longitude: string | null;
    phone: string;
    email: string;
    stars: number;
    photo: string | null;
    city: number;
};

export type CreateHotelDTO = {
    name: string;
    description: string | null;
    address: string;
    phone: string;
    email: string;
    stars: number;
    photo: string | null;
    city: number;
};

export type RoomDTO = {
    id: number;
    roomNumber: string;
    description: string | null;
    wifi: boolean;
    privatePool: boolean;
    Bath: boolean;
    price: string;
    beds: number;
    photo: string | null;
    hotel: number;
};

export type CreateRoomDTO = Omit<RoomDTO, "id">;

export type UserDTO = {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthday: string | null;
    photo: string | null;
    ampthill: string;
    city: number | null;
    country: number | null;
    currency: number | null;
    payMethod: number | null;
};

export type PaginatedHotelsResponse = {
    count: number;
    results: HotelDTO[];
};

export type PaginatedRoomsResponse = {
    count: number;
    page: number;
    el: number;
    total_pages: number;
    results: RoomDTO[];
};

export type PaginatedPaymentMethodsResponse = {
    count: number;
    page: number;
    el: number;
    total_pages: number;
    results: PaymentMethodDTO[];
};

export type GetHotelsDTO = {
    city?: number;
    minPrice?: number;
    rating?: number;
    stars?: number;
};

export type PaginationDTO = {
    el: number;
    page: number;
};

export type GetHotelRoomsDTO = AdvancedSearchDTO & PaginationDTO;

export type PhotosResponse = {
    photos: Array<{ photo: string }>;
};

export type PhotoUploadResponse = {
    message: string;
    photo_url: string;
};

export type NearestPlaceResponse = {
    hotel_id: number;
    type: string;
    address: string | null;
    distance: number;
};

export type ReviewDTO = {
    id: number;
    review: string;
    createdAt: string;
    user: number;
    hotel: number;
    rating: number;
};

export type HotelReviewsResponse = {
    count: number;
    results: ReviewDTO[];
};

export type MainPageReviewDTO = {
    id: number;
    review: string;
    createdAt: string;
    rating: number;
    user: {
        id: number;
        name: string;
        photo: string | null;
    };
    hotel: {
        id: number;
        name: string;
    };
};

export type MainPageReviewsResponse = {
    results: MainPageReviewDTO[];
};

export type UserProfileResponse = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    birthday: string | null;
    photo: string | null;
    ampthill: string;
    city: number | null;
    country: number | null;
    currency: number | null;
    payMethod: number | null;
};

export type AuthAccountDTO = {
    email: string;
    password: string;
};

export type AdvancedSearchDTO = {
    land?: string | null;
    city?: string | null;
    checkIn?: string | null;
    checkOut?: string | null;
    people?: number | null;
    nightPrice?: number | null;
    rate?: number | null;
    stars?: number | null;
    wifi?: boolean | null;
};

export type HotelCardDataDTO = {
    hotel: HotelDTO;
    photos: Array<{ photo: string }>;
    nearest_airport_distance: number | null;
    nearest_train_distance: number | null;
    review_count: number;
    average_rating: number | null;
    cheapest_room_price: string | null;
    cheapest_room_beds: number | null;
    cheapest_room_wifi: boolean | null;
};

export type FilterCountsDTO = {
    rating: Record<string, number>;
    stars: Record<string, number>;
    wifi: number;
};

export type HotelSearchDTO = {
    land?: string | null;
    city?: string | null;
    checkIn?: string | null;
    checkOut?: string | null;
    people?: number | null;
};

export type UserProfileUpdateDTO = {
    name?: string;
    email?: string;
    phone?: string | null;
    birthday?: string | null;
    ampthill?: string;
    city?: number | null;
    country?: number | null;
    currency?: number | null;
};

export type MyReservationRoomDTO = {
    id: number;
    roomNumber: string;
    description: string | null;
    wifi: boolean;
    privatePool: boolean;
    Bath: boolean;
    price: string;
    beds: number;
    photos: string[];
};

export type MyReservationHotelDTO = {
    id: number;
    name: string;
    stars: number;
    photos: string[];
};

export type MyReservationCityDTO = {
    id: number;
    name: string;
    country: {
        id: number;
        name: string | null;
    };
};

export type MyReservationDTO = {
    id: number;
    checkIn: string;
    checkOut: string;
    totalPrice: string | null;
    viewToken: string;
    room: MyReservationRoomDTO;
    hotel: MyReservationHotelDTO;
    city: MyReservationCityDTO;
};

export type MyReservationsResponse = {
    count: number;
    results: MyReservationDTO[];
};

export type MyReviewDTO = {
    id: number;
    review: string;
    createdAt: string;
    rating: number;
    hotel: {
        id: number;
        name: string;
        stars: number;
        city: string | null;
        country: string | null;
    };
};

export type MyReviewsResponse = {
    count: number;
    results: MyReviewDTO[];
};