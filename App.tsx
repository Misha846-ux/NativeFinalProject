import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { clearAuthTokens } from "./src/Endpoints/apiRequest";
import { AppStackNavigation } from "./src/Navigation/AppStackNavigation";

export default function App() {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearLegacyCredentials = async () => {
        setError(null);
        try {
            await clearAuthTokens();
            setReady(true);
        } catch (clearError) {
            setError(clearError instanceof Error ? clearError.message : "Could not clear saved credentials.");
        }
    };

    useEffect(() => {
        let active = true;
        clearAuthTokens()
            .then(() => {
                if (active) setReady(true);
            })
            .catch((clearError: unknown) => {
                if (active) {
                    setError(clearError instanceof Error ? clearError.message : "Could not clear saved credentials.");
                }
            });
        return () => {
            active = false;
        };
    }, []);

    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            {ready ? (
                <AppStackNavigation />
            ) : (
                <View style={styles.bootstrap}>
                    {error ? (
                        <>
                            <Text style={styles.error}>{error}</Text>
                            <Pressable onPress={() => void clearLegacyCredentials()}>
                                <Text style={styles.retry}>Try again</Text>
                            </Pressable>
                        </>
                    ) : <ActivityIndicator />}
                </View>
            )}
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    bootstrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    error: { color: "#B42318", textAlign: "center" },
    retry: { color: "#5B31A8", marginTop: 12, fontWeight: "700" },
});
