export type BookingData = {
    name: string;
    surname: string;
    email: string;
    confirmEmail: string;
    password: string;

    country: string;
    phoneNumber: string;
    callMe: boolean;
    sendMe: boolean;

    typeOfDebitCard: string;
    cardNumber: string;
    cardDate: string;
    agreement: boolean;
};

export const emptyBookingData: BookingData = {
    name: "",
    surname: "",
    email: "",
    confirmEmail: "",
    password: "",

    country: "",
    phoneNumber: "",
    callMe: false,
    sendMe: false,

    typeOfDebitCard: "",
    cardNumber: "",
    cardDate: "",
    agreement: false,
};