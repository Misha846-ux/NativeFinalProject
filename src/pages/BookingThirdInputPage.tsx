import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { createPaymentMethod, getDebitCards } from "../Endpoints/PaymentMethodsEndpoints";
import { createReservation } from "../Endpoints/ReservationEndpoints";
import type { DebitCardDTO } from "../Models/dto";
import type { RootStackParamList } from "../Navigation/types";
import { ErrorMessage, PageFrame, PrimaryButton, SectionHeading } from "../components/GeneralComponents/PageFrame";
import { theme } from "../components/GeneralComponents/theme";
import {
    InputPaymentMethod,
    isValidPaymentMethodCardNumber,
    isValidPaymentMethodExpiry,
} from "../components/GeneralComponents/InputPaymentMethod";

type Props = NativeStackScreenProps<RootStackParamList, "BookingConfirm">;
const digitsOnly = (value: string) => value.replace(/\D/g, "");

export const BookingThirdInputPage = () => {
    const route = useRoute<Props["route"]>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const details = route.params;
    const [debitCards, setDebitCards] = useState<DebitCardDTO[]>([]);
    const [cardType, setCardType] = useState<number | null>(null);
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [agreement, setAgreement] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingCards, setLoadingCards] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        getDebitCards()
            .then((types) => {
                if (active) {
                    setDebitCards(types);
                    setCardType(types[0]?.id ?? null);
                }
            })
            .catch((loadError: unknown) => {
                if (active) setError(loadError instanceof Error ? loadError.message : "Could not load card types.");
            })
            .finally(() => {
                if (active) setLoadingCards(false);
            });
        return () => { active = false; };
    }, []);

    const nights = useMemo(() => {
        const start = new Date(`${details.checkIn}T00:00:00`).getTime();
        const end = new Date(`${details.checkOut}T00:00:00`).getTime();
        return Number.isFinite(start) && Number.isFinite(end) && end > start
            ? Math.round((end - start) / 86_400_000)
            : 0;
    }, [details.checkIn, details.checkOut]);
    const totalPrice = Number(details.room.price) * nights;
    const validExpiry = isValidPaymentMethodExpiry(cardExpiry);

    const confirm = async () => {
        if (loading) return;
        if (!agreement) {
            setError("Accept the booking conditions to continue.");
            return;
        }
        if (!cardType || !isValidPaymentMethodCardNumber(cardNumber) || !validExpiry) {
            setError("Choose a card type and enter a valid card number and unexpired expiry date.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const method = await createPaymentMethod({
                cardType,
                cardNumber: digitsOnly(cardNumber),
                date: cardExpiry,
            });
            const reservation = await createReservation({
                checkIn: details.checkIn,
                checkOut: details.checkOut,
                name: details.name ?? "",
                sureName: details.sureName ?? "",
                email: details.email ?? "",
                phoneNumber: details.phoneNumber ?? "",
                cityGuide: details.cityGuide ?? false,
                allowChangeBooking: details.allowChangeBooking ?? false,
                confirmByCall: details.confirmByCall ?? false,
                confirmByEmail: details.confirmByEmail ?? true,
                room: details.room.id,
                country: details.countryId ?? null,
                payMethod: method.id,
            });
            navigation.replace("BookingFinished", { reservation });
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Could not complete this reservation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageFrame title="Payment">
            <SectionHeading>Complete your booking</SectionHeading>
            <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Room {details.room.roomNumber}</Text>
                <Text style={styles.line}>{details.checkIn} — {details.checkOut} · {nights} {nights === 1 ? "night" : "nights"}</Text>
                <Text style={styles.line}>Guest: {details.name} {details.sureName}</Text>
                <Text style={styles.total}>Total  ${totalPrice.toFixed(2)}</Text>
            </View>
            {loadingCards ? <ActivityIndicator color={theme.purple} style={{ marginVertical: 16 }} /> : null}
            <InputPaymentMethod
                cards={debitCards}
                cardType={cardType}
                cardNumber={cardNumber}
                expiryDate={cardExpiry}
                onCardTypeChange={setCardType}
                onCardNumberChange={setCardNumber}
                onExpiryDateChange={setCardExpiry}
            />
            <Pressable onPress={() => setAgreement((value) => !value)} style={styles.agreement}>
                <View style={[styles.checkbox, agreement && styles.checked]}>{agreement ? <Text style={styles.tick}>✓</Text> : null}</View>
                <Text style={styles.agreementText}>I agree to the booking conditions and cancellation policy.</Text>
            </Pressable>
            {error ? <ErrorMessage message={error} /> : null}
            {loading ? <ActivityIndicator color={theme.purple} style={{ marginTop: 10 }} /> : <PrimaryButton title="Confirm booking" onPress={() => void confirm()} />}
        </PageFrame>
    );
};

const styles = StyleSheet.create({
    summary: { marginHorizontal: 18, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: theme.border, backgroundColor: "#FFF", marginBottom: 14 },
    summaryTitle: { color: theme.text, fontSize: 17, fontWeight: "800", marginBottom: 8 },
    line: { color: theme.muted, marginTop: 5, fontSize: 13 },
    total: { color: theme.text, fontWeight: "800", marginTop: 12 },
    agreement: { flexDirection: "row", alignItems: "center", marginHorizontal: 18, marginTop: 16 },
    checkbox: { width: 21, height: 21, borderWidth: 1, borderColor: theme.border, borderRadius: 5, marginRight: 10, alignItems: "center", justifyContent: "center" },
    checked: { backgroundColor: theme.purple, borderColor: theme.purple },
    tick: { color: "#FFF", fontWeight: "800" },
    agreementText: { flex: 1, color: theme.text, fontSize: 13, lineHeight: 19 },
});
