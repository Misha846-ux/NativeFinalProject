import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../Navigation/types";
import { theme } from "./theme";

type Props = { title?: string };

export const Header = ({ title }: Props) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const goHome = async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            Alert.alert(
                "Storage error",
                error instanceof Error ? error.message : "Could not clear saved app data.",
            );
        } finally {
            navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [{ name: "MainPage" }],
            }));
        }
    };

    return (
        <View style={styles.header}>
            <Pressable onPress={() => void goHome()} accessibilityRole="button">
                <Text style={styles.brand}>Hotel for <Text style={styles.brandAccent}>you</Text></Text>
            </Pressable>
            {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        minHeight: 58,
        paddingHorizontal: 18,
        backgroundColor: theme.surface,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border,
    },
    brand: { color: theme.text, fontSize: 19, fontWeight: "800" },
    brandAccent: { color: theme.purple },
    title: { flex: 1, marginLeft: 14, color: theme.muted, fontSize: 13 },
});
