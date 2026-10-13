import { useState } from "react";
import { Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../Navigation/types";
import { ErrorMessage, PageFrame, PrimaryButton, SectionHeading } from "../components/GeneralComponents/PageFrame";
import { DatePickerField } from "../components/GeneralComponents/DatePickerField";
import { theme } from "../components/GeneralComponents/theme";
import { parseISODate } from "../utils/calendarDate";

type Props = NativeStackScreenProps<RootStackParamList, "BookingDates">;
export const BookingChooseDatePage = () => {
    const route = useRoute<Props["route"]>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { hotelId, room, filters = {} } = route.params;
    const [checkIn, setCheckIn] = useState(filters.checkIn ?? "");
    const [checkOut, setCheckOut] = useState(filters.checkOut ?? "");
    const [error, setError] = useState<string | null>(null);
    const parsedCheckIn = parseISODate(checkIn);
    const minimumCheckOut = parsedCheckIn
        ? new Date(parsedCheckIn.getFullYear(), parsedCheckIn.getMonth(), parsedCheckIn.getDate() + 1)
        : new Date();

    const continueBooking = () => {
        if (!parseISODate(checkIn) || !parseISODate(checkOut)) {
            setError("Choose both stay dates.");
            return;
        }
        if (checkOut <= checkIn) {
            setError("Check-out must be after check-in.");
            return;
        }
        setError(null);
        navigation.navigate("BookingGuest", { hotelId, room, checkIn, checkOut });
    };

    return (
        <PageFrame title="Choose dates">
            <SectionHeading>Your stay</SectionHeading>
            <Text style={{ marginHorizontal: 18, color: theme.text, fontWeight: "700" }}>
                Room {room.roomNumber} · ${Number(room.price).toFixed(0)} per night
            </Text>
            <DatePickerField
                label="Check-in"
                value={checkIn}
                onChange={(value) => {
                    setCheckIn(value);
                    if (checkOut && checkOut <= value) setCheckOut("");
                    setError(null);
                }}
            />
            <DatePickerField
                label="Check-out"
                value={checkOut}
                minimumDate={minimumCheckOut}
                onChange={(value) => {
                    setCheckOut(value);
                    setError(null);
                }}
            />
            {error ? <ErrorMessage message={error} /> : null}
            <PrimaryButton title="Continue" onPress={continueBooking} />
        </PageFrame>
    );
};
