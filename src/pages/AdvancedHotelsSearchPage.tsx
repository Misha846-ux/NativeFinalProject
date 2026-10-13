import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { getCities, getCountries } from "../Endpoints/CityEndpoints";
import type { AdvancedSearchDTO, CityDTO, CountryDTO, HotelDTO } from "../Models/dto";
import type { RootStackParamList } from "../Navigation/types";
import { PageFrame } from "../components/GeneralComponents/PageFrame";
import { GeneralSearch } from "../components/GeneralComponents/GeneralSearch";
import { theme } from "../components/GeneralComponents/theme";
import { AdvencedSearch } from "../components/UniqueForAdvancedHotesSearchPage/AdvencedSearch";
import { HotelsContainer } from "../components/UniqueForAdvancedHotesSearchPage/HotelsContainer";

type Props = NativeStackScreenProps<RootStackParamList, "AdvancedHotelsSearch">;
const FILTER_STORAGE_KEY = "hotel_search_filters";

function parseSavedFilters(value: string | null): AdvancedSearchDTO {
    if (!value) return {};
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};

    const source = parsed as Record<string, unknown>;
    const filters: AdvancedSearchDTO = {};
    for (const field of ["land", "city", "checkIn", "checkOut"] as const) {
        const fieldValue = source[field];
        if (typeof fieldValue === "string" || fieldValue === null) filters[field] = fieldValue;
    }
    for (const field of ["people", "nightPrice", "rate", "stars"] as const) {
        const fieldValue = source[field];
        if (typeof fieldValue === "number" && Number.isFinite(fieldValue)) filters[field] = fieldValue;
    }
    if (typeof source.wifi === "boolean" || source.wifi === null) filters.wifi = source.wifi;
    return filters;
}

export const AdvancedHotelsSearchPage = () => {
    const route = useRoute<Props["route"]>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [filters, setFilters] = useState<AdvancedSearchDTO>({});
    const [cities, setCities] = useState<CityDTO[]>([]);
    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [ready, setReady] = useState(false);
    const [pageError, setPageError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        const load = async () => {
            const [storedFilters, cityResult, countryResult] = await Promise.allSettled([
                AsyncStorage.getItem(FILTER_STORAGE_KEY),
                getCities(),
                getCountries(),
            ]);
            if (!active) return;

            let saved: AdvancedSearchDTO = {};
            const errors: string[] = [];
            if (storedFilters.status === "fulfilled") {
                try {
                    saved = parseSavedFilters(storedFilters.value);
                } catch {
                    errors.push("Saved search settings could not be read; using the current search.");
                }
            } else {
                errors.push("Saved search settings could not be loaded.");
            }

            if (cityResult.status === "fulfilled") setCities(cityResult.value);
            else errors.push(cityResult.reason instanceof Error ? cityResult.reason.message : "Could not load cities.");
            if (countryResult.status === "fulfilled") setCountries(countryResult.value);
            else errors.push(countryResult.reason instanceof Error ? countryResult.reason.message : "Could not load countries.");

            setFilters({ ...saved, ...route.params.filters });
            setPageError(errors.length ? errors.join(" ") : null);
            setReady(true);
        };
        void load();
        return () => { active = false; };
    }, [route.params.filters]);

    useEffect(() => {
        if (!ready) return;
        const save = async () => {
            try {
                if (Object.keys(filters).length) {
                    await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
                } else {
                    await AsyncStorage.removeItem(FILTER_STORAGE_KEY);
                }
            } catch (error) {
                setPageError(error instanceof Error ? error.message : "Could not save search settings.");
            }
        };
        void save();
    }, [filters, ready]);

    const updateFilters = useCallback((nextFilters: AdvancedSearchDTO) => {
        setFilters(nextFilters);
        setPageError(null);
    }, []);
    const openHotel = useCallback((hotel: HotelDTO) => {
        navigation.navigate("Rooms", { hotel, filters });
    }, [filters, navigation]);
    const pageHeader = ready ? (
        <View>
            <GeneralSearch
                key="destination-search"
                cities={cities}
                countries={countries}
                initialFilters={filters}
                onSearch={updateFilters}
            />
            <AdvencedSearch filters={filters} onFilterChange={updateFilters} />
            {pageError ? <Text style={styles.error}>{pageError}</Text> : null}
        </View>
    ) : null;

    return (
        <PageFrame title="Search results" scroll={false}>
            {ready ? (
                <HotelsContainer
                    filters={filters}
                    cities={cities}
                    countries={countries}
                    onHotelPress={openHotel}
                    pageHeader={pageHeader}
                />
            ) : (
                <ActivityIndicator color={theme.purple} size="large" style={styles.loading} />
            )}
        </PageFrame>
    );
};

const styles = StyleSheet.create({
    loading: { marginTop: 32 },
    error: { color: theme.danger, marginHorizontal: 18, marginBottom: 12, fontSize: 12 },
});
