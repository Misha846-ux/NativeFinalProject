export type Reservation = {
    id: number;
    checkIn: string;
    checkOut: string;
    room: number;
    user: number;
    name: string
    surname: string;
    email: string;
    password: string;
    cityguide: boolean;
    country: number;
    paymethod: number;
};