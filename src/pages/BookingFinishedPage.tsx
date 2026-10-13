import { StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../Navigation/types";
import { PageFrame, PrimaryButton } from "../components/GeneralComponents/PageFrame";
import { theme } from "../components/GeneralComponents/theme";

type Props = NativeStackScreenProps<RootStackParamList, "BookingFinished">;
export const BookingFinishedPage = () => {
    const route = useRoute<Props["route"]>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { reservation } = route.params;

    return (
        <PageFrame title="Booking confirmed">
            <View style={styles.content}>
                <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
                <Text style={styles.heading}>Your stay is booked</Text>
                <Text style={styles.copy}>A confirmation has been sent to {reservation.email}.</Text>
                <View style={styles.summary}>
                    <Text style={styles.row}>Booking number  #{reservation.id}</Text>
                    <Text style={styles.row}>{reservation.checkIn} — {reservation.checkOut}</Text>
                    {reservation.totalPrice ? <Text style={styles.row}>Total  ${Number(reservation.totalPrice).toFixed(2)}</Text> : null}
                </View>
            </View>
            <PrimaryButton title="Back to home" onPress={() => navigation.popToTop()} />
        </PageFrame>
    );
};

const styles = StyleSheet.create({
    content: { alignItems: "center", paddingHorizontal: 24, paddingTop: 54 },
    check: { width: 66, height: 66, borderRadius: 33, backgroundColor: "#E4F6EA", alignItems: "center", justifyContent: "center" },
    checkText: { color: theme.green, fontSize: 34, fontWeight: "800" },
    heading: { color: theme.text, fontSize: 23, fontWeight: "800", marginTop: 20 },
    copy: { color: theme.muted, textAlign: "center", lineHeight: 21, marginTop: 9 },
    summary: { width: "100%", marginTop: 28, padding: 16, backgroundColor: "#FFF", borderWidth: 1, borderColor: theme.border, borderRadius: 13 },
    row: { color: theme.text, marginVertical: 5, fontSize: 14 },
});
