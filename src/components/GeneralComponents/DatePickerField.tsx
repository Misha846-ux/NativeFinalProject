import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { parseISODate } from "../../utils/calendarDate";
import { CalendarDatePicker } from "./CalendarDatePicker";
import { theme } from "./theme";

type Props = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    displayOptions?: Intl.DateTimeFormatOptions;
};

const displayDate = (value: string, options: Intl.DateTimeFormatOptions) => {
    const date = parseISODate(value);
    return date
        ? date.toLocaleDateString("en-US", options)
        : "Select date";
};

export const DatePickerField = ({
    label,
    value,
    onChange,
    minimumDate,
    maximumDate,
    displayOptions = { month: "short", day: "numeric", year: "numeric" },
}: Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Choose ${label.toLowerCase()} date`}
                onPress={() => setVisible(true)}
                style={styles.input}
            >
                <Text style={[styles.value, !value && styles.placeholder]}>{displayDate(value, displayOptions)}</Text>
            </Pressable>
            <CalendarDatePicker
                key={value || "empty"}
                visible={visible}
                value={value || undefined}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onClose={() => setVisible(false)}
                onSelect={(date) => {
                    onChange(date);
                    setVisible(false);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    field: { marginHorizontal: 18, marginTop: 10 },
    label: { color: theme.text, fontSize: 13, fontWeight: "700", marginBottom: 6 },
    input: {
        minHeight: 48,
        justifyContent: "center",
        paddingHorizontal: 13,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        backgroundColor: theme.surface,
    },
    value: { color: theme.text, fontSize: 15 },
    placeholder: { color: theme.muted },
});
