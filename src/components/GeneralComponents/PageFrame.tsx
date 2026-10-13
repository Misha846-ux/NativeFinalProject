import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./Header";
import { theme } from "./theme";

type Props = {
    children: ReactNode;
    title?: string;
    scroll?: boolean;
};

export const PageFrame = ({ children, title, scroll = true }: Props) => {
    const content = scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            {children}
        </ScrollView>
    ) : <View style={[styles.content, styles.fill]}>{children}</View>;

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <Header title={title} />
            {content}
        </SafeAreaView>
    );
};

export const SectionHeading = ({ children }: { children: ReactNode }) => (
    <Text style={styles.sectionHeading}>{children}</Text>
);

export const PrimaryButton = ({
    title,
    onPress,
    disabled = false,
}: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}) => (
    <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={[styles.button, disabled && styles.buttonDisabled]}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
);

export const FormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    secureTextEntry = false,
}: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
    secureTextEntry?: boolean;
}) => (
    <View style={styles.field}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInputField
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder ?? label}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
        />
    </View>
);

const TextInputField = ({
    value,
    onChangeText,
    placeholder,
    keyboardType,
    secureTextEntry,
}: {
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
    secureTextEntry: boolean;
}) => (
    <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        style={styles.input}
    />
);

export const ErrorMessage = ({ message }: { message: string }) => (
    <Text accessibilityRole="alert" style={styles.error}>{message}</Text>
);

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },
    content: { paddingBottom: 26 },
    fill: { flex: 1 },
    sectionHeading: { color: theme.text, fontSize: 20, fontWeight: "800", marginHorizontal: 18, marginTop: 6, marginBottom: 14 },
    button: { minHeight: 48, marginHorizontal: 18, marginTop: 10, marginBottom: 10, borderRadius: 11, backgroundColor: theme.purple, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
    buttonDisabled: { opacity: 0.55 },
    buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
    field: { marginHorizontal: 18, marginTop: 10 },
    fieldLabel: { color: theme.text, fontSize: 13, fontWeight: "700", marginBottom: 6 },
    input: { minHeight: 48, paddingHorizontal: 13, borderWidth: 1, borderColor: theme.border, borderRadius: 10, backgroundColor: theme.surface, color: theme.text, fontSize: 15 },
    error: { color: theme.danger, marginHorizontal: 18, marginVertical: 8, fontSize: 13 },
});
