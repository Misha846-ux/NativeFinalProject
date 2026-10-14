import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { advancedSearchHotels } from "../../Endpoints/HotelEndpoints";
import type { AdvancedSearchDTO, CityDTO, CountryDTO, HotelDTO } from "../../Models/dto";
import { SectionHeading } from "../GeneralComponents/PageFrame";
import { theme } from "../GeneralComponents/theme";
import { HotelsCard } from "./HotelsCard";

type Props = {
    filters: AdvancedSearchDTO;
    cities: CityDTO[];
    countries: CountryDTO[];
    onHotelPress: (hotel: HotelDTO) => void;
    pageHeader?: React.ReactElement | null;
};

export const HotelsContainer = ({ filters, cities, countries, onHotelPress, pageHeader }: Props) => {
    const [hotels, setHotels] = useState<HotelDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await advancedSearchHotels(filters, { el: 20, page: 1 });
            setHotels(result.results);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Could not search stays.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        advancedSearchHotels(filters, { el: 20, page: 1 })
            .then((result) => {
                if (active) setHotels(result.results);
            })
            .catch((loadError: unknown) => {
                if (active) setError(loadError instanceof Error ? loadError.message : "Could not search stays.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [filters]);

    return (
        <FlatList
            style={styles.list}
            contentContainerStyle={styles.content}
            data={loading || error ? [] : hotels}
            keyExtractor={(hotel) => String(hotel.id)}
            renderItem={({ item }) => {
                const city = cities.find((entry) => entry.id === item.city);
                const country = countries.find((entry) => entry.id === city?.country);
                return (
                    <HotelsCard
                        hotel={item}
                        cityName={city?.name}
                        countryName={country?.name}
                        onPress={() => onHotelPress(item)}
                    />
                );
            }}
            ListHeaderComponent={(
                <View>
                    {pageHeader}
                    <SectionHeading>Stays matching your search</SectionHeading>
                    {loading ? <ActivityIndicator color={theme.purple} size="large" style={styles.loader} /> : null}
                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.error}>{error}</Text>
                            <Pressable onPress={() => void load()}><Text style={styles.retry}>Try again</Text></Pressable>
                        </View>
                    ) : null}
                </View>
            )}
            ListEmptyComponent={!loading && !error
                ? <Text style={styles.empty}>No stays matched your search. Try another destination or dates.</Text>
                : null}
            ListFooterComponent={!loading && !error && hotels.length > 0
                ? <Text style={styles.count}>Showing {hotels.length} stays</Text>
                : null}
        />
    );
};

const styles = StyleSheet.create({
    list: { flex: 1 },
    content: { paddingBottom: 26 },
    loader: { marginVertical: 30 },
    errorBox: { marginHorizontal: 18, marginBottom: 18 },
    error: { color: theme.danger, fontSize: 14 },
    retry: { color: theme.purple, fontWeight: "700", marginTop: 10 },
    empty: { color: theme.muted, marginHorizontal: 18, paddingVertical: 18 },
    count: { marginHorizontal: 18, marginBottom: 10, color: theme.muted, fontSize: 12 },
});