import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppStackNavigation } from "./src/Navigation/AppStackNavigation";

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <AppStackNavigation />
        </SafeAreaProvider>
    );
}
