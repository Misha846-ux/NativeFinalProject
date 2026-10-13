import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { getCountries } from "../Endpoints/CountryEndpoints";
import type { CountryDTO } from "../Models/dto";
import type { RootStackParamList } from "../Navigation/types";
import { ErrorMessage, FormField, PageFrame, PrimaryButton, SectionHeading } from "../components/GeneralComponents/PageFrame";
import { theme } from "../components/GeneralComponents/theme";

type Props = NativeStackScreenProps<RootStackParamList, "BookingContact">;
export const BookingSecondInputPage = () => {
    const route = useRoute<Props["route"]>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [country, setCountry] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [confirmByCall, setConfirmByCall] = useState(false);
    const [confirmByEmail, setConfirmByEmail] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        getCountries().then((items) => {
            if (!active) return;
            setCountries(items);
        }).catch((loadError: unknown) => {
            if (active) setError(loadError instanceof Error ? loadError.message : "Could not load countries.");
        }).finally(() => {
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, []);

    const continueBooking = () => {
        const selected = countries.find((item) => item.name.toLocaleLowerCase() === country.trim().toLocaleLowerCase());
        if (!selected || !phoneNumber.trim()) {
            setError(selected ? "Enter your phone number." : "Choose a country from the list.");
            return;
        }
        setError(null);
        navigation.navigate("BookingConfirm", {
            ...route.params,
            countryId: selected.id,
            phoneNumber: phoneNumber.trim(),
            confirmByCall,
            confirmByEmail,
        });
    };

    return (
        <PageFrame title="Contact details">
            <SectionHeading>How can we reach you?</SectionHeading>
            <FormField label="Country" value={country} onChangeText={setCountry} placeholder="Choose your country" />
            {country.trim() ? (
                <View style={styles.suggestions}>
                    {countries.filter((item) => item.name.toLowerCase().includes(country.trim().toLowerCase())).slice(0, 5).map((item) => (
                        <Pressable key={item.id} onPress={() => setCountry(item.name)} style={styles.suggestion}>
                            <Text style={styles.suggestionText}>{item.name}</Text>
                        </Pressable>
                    ))}
                </View>
            ) : null}
            <FormField label="Phone number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
            <Text style={styles.hint}>We need your phone number in case the hotel needs to contact you.</Text>
            <Choice label="Call me to confirm the booking" checked={confirmByCall} onPress={() => setConfirmByCall((value) => !value)} />
            <Choice label="Email me to confirm the booking" checked={confirmByEmail} onPress={() => setConfirmByEmail((value) => !value)} />
            {loading ? <ActivityIndicator color={theme.purple} /> : null}
            {error ? <ErrorMessage message={error} /> : null}
            <PrimaryButton title="Continue" onPress={continueBooking} disabled={loading} />
        </PageFrame>
    );
};

const Choice = ({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) => (
    <Pressable onPress={onPress} style={styles.choice}>
        <View style={[styles.checkbox, checked && styles.checked]}>{checked ? <Text style={styles.tick}>✓</Text> : null}</View>
        <Text style={styles.choiceText}>{label}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    hint: { color: theme.muted, fontSize: 12, marginHorizontal: 18, marginTop: 6, lineHeight: 17 },
    suggestions: { marginHorizontal: 18, marginTop: -8, marginBottom: 6, borderRadius: 10, borderColor: theme.border, borderWidth: 1, backgroundColor: "#FFF" },
    suggestion: { padding: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
    suggestionText: { color: theme.text },
    choice: { flexDirection: "row", alignItems: "center", marginHorizontal: 18, paddingVertical: 12 },
    checkbox: { width: 21, height: 21, marginRight: 10, borderWidth: 1, borderColor: theme.border, borderRadius: 5, alignItems: "center", justifyContent: "center" },
    checked: { backgroundColor: theme.purple, borderColor: theme.purple },
    tick: { color: "#FFF", fontWeight: "800" },
    choiceText: { color: theme.text, fontSize: 14 },
});
