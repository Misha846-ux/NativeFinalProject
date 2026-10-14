import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getHotels } from "../../Endpoints/HotelEndpoints";
import type { CityDTO, CountryDTO, HotelDTO } from "../../Models/dto";
import { theme } from "../GeneralComponents/theme";
import { HotelsCard } from "./HotelsCard";

type Props = {
    cities: CityDTO[];
    countries: CountryDTO[];
    header?: React.ReactElement | null;
    footer?: React.ReactElement | null;
    onHotelPress: (hotel: HotelDTO) => void;
};

export const HotelsContainer = ({ cities, countries, header, footer, onHotelPress }: Props) => {
    const [hotels, setHotels] = useState<HotelDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getHotels({}, { el: 8, page: 1 });
            setHotels(response.results);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Could not load stays.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        getHotels({}, { el: 8, page: 1 })
            .then((response) => {
                if (active) setHotels(response.results);
            })
            .catch((loadError: unknown) => {
                if (active) setError(loadError instanceof Error ? loadError.message : "Could not load stays.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, []);

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
                    {header}
                    {loading ? <ActivityIndicator color={theme.purple} size="large" style={styles.loader} /> : null}
                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.error}>{error}</Text>
                            <Pressable onPress={() => void load()}><Text style={styles.retry}>Try again</Text></Pressable>
                        </View>
                    ) : null}
                </View>
            )}
            ListFooterComponent={footer}
            ListEmptyComponent={!loading && !error ? <Text style={styles.empty}>No stays found.</Text> : null}
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
    empty: { color: theme.muted, paddingHorizontal: 18, paddingVertical: 18 },
});