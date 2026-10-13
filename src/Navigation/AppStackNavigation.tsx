import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdvancedHotelsSearchPage } from "../pages/AdvancedHotelsSearchPage";
import { BookingChooseDatePage } from "../pages/BookingChooseDatePage";
import { BookingFinishedPage } from "../pages/BookingFinishedPage";
import { BookingFirstInputPage } from "../pages/BookingFirstInputPage";
import { BookingSecondInputPage } from "../pages/BookingSecondInputPage";
import { BookingThirdInputPage } from "../pages/BookingThirdInputPage";
import { MainPage } from "../pages/MainPage";
import { RoomsPage } from "../pages/RoomsPage";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppStackNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="MainPage"
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                    contentStyle: { backgroundColor: "#FFFFFF" },
                }}
            >
                <Stack.Screen name="MainPage" component={MainPage} />
                <Stack.Screen name="AdvancedHotelsSearch" component={AdvancedHotelsSearchPage} />
                <Stack.Screen name="Rooms" component={RoomsPage} />
                <Stack.Screen name="BookingDates" component={BookingChooseDatePage} />
                <Stack.Screen name="BookingGuest" component={BookingFirstInputPage} />
                <Stack.Screen name="BookingContact" component={BookingSecondInputPage} />
                <Stack.Screen name="BookingConfirm" component={BookingThirdInputPage} />
                <Stack.Screen name="BookingFinished" component={BookingFinishedPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
