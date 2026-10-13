import type {
    AdvancedSearchDTO,
    HotelDTO,
    ReservationDTO,
    RoomDTO,
} from "../Models/dto";

export type BookingDetails = {
    hotelId: number;
    room: RoomDTO;
    checkIn: string;
    checkOut: string;
    name?: string;
    sureName?: string;
    email?: string;
    confirmEmail?: string;
    phoneNumber?: string;
    countryId?: number | null;
    cityGuide?: boolean;
    allowChangeBooking?: boolean;
    confirmByCall?: boolean;
    confirmByEmail?: boolean;
};

export type RootStackParamList = {
    MainPage: undefined;
    AdvancedHotelsSearch: { filters: AdvancedSearchDTO };
    Rooms: { hotel: HotelDTO; filters?: AdvancedSearchDTO };
    BookingDates: { hotelId: number; room: RoomDTO; filters?: AdvancedSearchDTO };
    BookingGuest: BookingDetails;
    BookingContact: BookingDetails;
    BookingConfirm: BookingDetails;
    BookingFinished: { reservation: ReservationDTO };
};
