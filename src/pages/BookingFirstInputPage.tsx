import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../Navigation/types";
import { ErrorMessage, FormField, PageFrame, PrimaryButton, SectionHeading } from "../components/GeneralComponents/PageFrame";
import { theme } from "../components/GeneralComponents/theme";

type Props = NativeStackScreenProps<RootStackParamList, "BookingGuest">;
export const BookingFirstInputPage = () => {
    const route = useRoute<Props["route"]>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [name, setName] = useState("");
    const [sureName, setSureName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [cityGuide, setCityGuide] = useState(false);
    const [allowChangeBooking, setAllowChangeBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const continueBooking = () => {
        if (!name.trim() || !sureName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email !== confirmEmail) {
            setError("Enter your name and confirm a valid email address.");
            return;
        }
        setError(null);
        navigation.navigate("BookingContact", {
            ...route.params,
            name: name.trim(),
            sureName: sureName.trim(),
            email: email.trim(),
            confirmEmail: confirmEmail.trim(),
            cityGuide,
            allowChangeBooking,
        });
    };

    return (
        <PageFrame title="Guest details">
            <SectionHeading>Who is staying?</SectionHeading>
            <FormField label="First name" value={name} onChangeText={setName} />
            <FormField label="Last name" value={sureName} onChangeText={setSureName} />
            <FormField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <FormField label="Confirm email" value={confirmEmail} onChangeText={setConfirmEmail} keyboardType="email-address" />
            <View style={styles.choices}>
                <Choice label="I want to get a city guide" checked={cityGuide} onPress={() => setCityGuide((value) => !value)} />
                <Choice label="Allow changes to this booking" checked={allowChangeBooking} onPress={() => setAllowChangeBooking((value) => !value)} />
            </View>
            {error ? <ErrorMessage message={error} /> : null}
            <PrimaryButton title="Continue to booking" onPress={continueBooking} />
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
    choices: { marginTop: 12 },
    choice: { flexDirection: "row", alignItems: "center", marginHorizontal: 18, paddingVertical: 9 },
    checkbox: { width: 21, height: 21, marginRight: 10, borderWidth: 1, borderColor: theme.border, borderRadius: 5, alignItems: "center", justifyContent: "center" },
    checked: { backgroundColor: theme.purple, borderColor: theme.purple },
    tick: { color: "#FFF", fontWeight: "800" },
    choiceText: { color: theme.text, fontSize: 14 },
});
