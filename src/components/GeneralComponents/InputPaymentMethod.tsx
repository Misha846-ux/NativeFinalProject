import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DebitCardDTO } from "../../Models/dto";
import { DatePickerField } from "./DatePickerField";
import { FormField, SectionHeading } from "./PageFrame";
import { theme } from "./theme";

type Props = {
    cards: DebitCardDTO[];
    cardType: number | null;
    cardNumber: string;
    expiryDate: string;
    onCardTypeChange: (cardType: number) => void;
    onCardNumberChange: (cardNumber: string) => void;
    onExpiryDateChange: (expiryDate: string) => void;
};

export const isValidPaymentMethodExpiry = (value: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month] = value.slice(0, 10).split("-").map(Number);
    if (!year || month < 1 || month > 12) return false;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    return year > currentYear || (year === currentYear && month >= currentMonth);
};

export const isValidPaymentMethodCardNumber = (value: string): boolean => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 13 && digits.length <= 19;
};

export const InputPaymentMethod = ({
    cards,
    cardType,
    cardNumber,
    expiryDate,
    onCardTypeChange,
    onCardNumberChange,
    onExpiryDateChange,
}: Props) => {
    return (
        <View style={styles.container}>
            <SectionHeading>Card details</SectionHeading>
            <Text style={styles.label}>Card type</Text>
            {cards.length ? (
                <View style={styles.cardTypes}>
                    {cards.map((card) => {
                        const selected = card.id === cardType;
                        return (
                            <Pressable
                                key={card.id}
                                accessibilityRole="button"
                                accessibilityState={{ selected }}
                                onPress={() => onCardTypeChange(card.id)}
                                style={[styles.type, selected && styles.typeSelected]}
                            >
                                <Text style={[styles.typeText, selected && styles.typeTextSelected]}>
                                    {card.name ?? card.type ?? `Card ${card.id}`}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            ) : <Text style={styles.empty}>No card types are available.</Text>}
            <FormField
                label="Card number"
                value={cardNumber}
                onChangeText={onCardNumberChange}
                placeholder="Credit or debit card number"
                keyboardType="number-pad"
            />
            <DatePickerField
                label="Expiry date"
                value={expiryDate}
                displayOptions={{ month: "short", year: "2-digit" }}
                minimumDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                onChange={onExpiryDateChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 8 },
    label: { marginHorizontal: 18, marginTop: 12, marginBottom: 8, color: theme.text, fontSize: 13, fontWeight: "700" },
    cardTypes: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginHorizontal: 18, marginBottom: 6 },
    type: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, borderWidth: 1, borderColor: theme.border },
    typeSelected: { backgroundColor: theme.purple, borderColor: theme.purple },
    typeText: { color: theme.text, fontSize: 13 },
    typeTextSelected: { color: "#FFF" },
    empty: { marginHorizontal: 18, color: theme.muted, fontSize: 13 },
});