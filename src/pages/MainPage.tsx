import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCities, getCountries } from "../Endpoints/CityEndpoints";
import { getLatestReviews } from "../Endpoints/ReviewEndpoints";
import type {
    AdvancedSearchDTO,
    CityDTO,
    CountryDTO,
    HotelDTO,
    MainPageReviewDTO,
} from "../Models/dto";
import type { RootStackParamList } from "../Navigation/types";
import { GeneralSearch } from "../components/GeneralComponents/GeneralSearch";
import { PageFrame, SectionHeading } from "../components/GeneralComponents/PageFrame";
import { theme } from "../components/GeneralComponents/theme";
import { UserReviewsContainer } from "../components/GeneralComponents/UserReviewsContainer";
import { HotelsContainer } from "../components/UniqueForMainPage/HotelsContainer";

export const MainPage = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [cities, setCities] = useState<CityDTO[]>([]);
    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [reviews, setReviews] = useState<MainPageReviewDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const load = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const [cityResult, countryResult, reviewResult] = await Promise.allSettled([
                getCities(),
                getCountries(),
                getLatestReviews(),
            ]);
            const nextErrors: string[] = [];
            if (cityResult.status === "fulfilled") setCities(cityResult.value);
            else nextErrors.push(cityResult.reason instanceof Error ? cityResult.reason.message : "Could not load cities.");
            if (countryResult.status === "fulfilled") setCountries(countryResult.value);
            else nextErrors.push(countryResult.reason instanceof Error ? countryResult.reason.message : "Could not load countries.");
            if (reviewResult.status === "fulfilled") setReviews(reviewResult.value.results);
            else nextErrors.push(reviewResult.reason instanceof Error ? reviewResult.reason.message : "Could not load guest reviews.");
            setErrors(nextErrors);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        const loadSupportingData = async () => {
            const [cityResult, countryResult, reviewResult] = await Promise.allSettled([
                getCities(),
                getCountries(),
                getLatestReviews(),
            ]);
            if (!active) return;
            const nextErrors: string[] = [];
            if (cityResult.status === "fulfilled") setCities(cityResult.value);
            else nextErrors.push(cityResult.reason instanceof Error ? cityResult.reason.message : "Could not load cities.");
            if (countryResult.status === "fulfilled") setCountries(countryResult.value);
            else nextErrors.push(countryResult.reason instanceof Error ? countryResult.reason.message : "Could not load countries.");
            if (reviewResult.status === "fulfilled") setReviews(reviewResult.value.results);
            else nextErrors.push(reviewResult.reason instanceof Error ? reviewResult.reason.message : "Could not load guest reviews.");
            setErrors(nextErrors);
            setLoading(false);
        };
        void loadSupportingData();
        return () => { active = false; };
    }, []);

    const search = (filters: AdvancedSearchDTO) => {
        navigation.navigate("AdvancedHotelsSearch", { filters });
    };
    const openHotel = useCallback((hotel: HotelDTO) => {
        navigation.navigate("Rooms", { hotel });
    }, [navigation]);

    const header = (
        <>
            <GeneralSearch cities={cities} countries={countries} onSearch={search} />
            <View style={styles.sectionTitle}>
                <SectionHeading>Popular stays</SectionHeading>
            </View>
            {loading ? <ActivityIndicator color={theme.purple} style={styles.loader} /> : null}
            {errors.map((error, index) => (
                <Text key={`${index}-${error}`} style={styles.error}>{error}</Text>
            ))}
            {errors.length > 0 ? (
                <Pressable onPress={() => void load()} style={styles.retryButton}>
                    <Text style={styles.retry}>Retry destination and review data</Text>
                </Pressable>
            ) : null}
        </>
    );
    const footer = reviews.length
        ? <UserReviewsContainer reviews={reviews} title="Guest reviews" limit={3} reviewNumberOfLines={3} />
        : null;

    return (
        <PageFrame scroll={false}>
            <HotelsContainer
                cities={cities}
                countries={countries}
                header={header}
                footer={footer}
                onHotelPress={openHotel}
            />
        </PageFrame>
    );
};

const styles = StyleSheet.create({
    loader: { marginVertical: 18 },
    error: { color: theme.danger, fontSize: 14 },
    retryButton: { marginHorizontal: 18, marginBottom: 10 },
    retry: { color: theme.purple, fontWeight: "700" },
    sectionTitle: { marginTop: 2 },
});
