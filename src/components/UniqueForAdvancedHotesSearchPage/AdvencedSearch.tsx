import { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { getFilterCounts } from "../../Endpoints/HotelEndpoints";
import type { AdvancedSearchDTO, FilterCountsDTO } from "../../Models/dto";
import { theme } from "../GeneralComponents/theme";

type Props = {
    filters: AdvancedSearchDTO;
    onFilterChange: (filters: AdvancedSearchDTO) => void;
};

const RATING_OPTIONS = [9, 8, 7, 6];
const STAR_OPTIONS = [5, 4, 3, 2, 1];
const EMPTY_COUNTS: FilterCountsDTO = { rating: {}, stars: {}, wifi: 0 };

export const AdvencedSearch = ({ filters, onFilterChange }: Props) => {
    const [counts, setCounts] = useState<FilterCountsDTO>(EMPTY_COUNTS);
    const [countsLoading, setCountsLoading] = useState(true);
    const [countsError, setCountsError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        getFilterCounts()
            .then((response) => {
                if (active) setCounts(response);
            })
            .catch((error: unknown) => {
                if (active) setCountsError(error instanceof Error ? error.message : "Could not load filter counts.");
            })
            .finally(() => {
                if (active) setCountsLoading(false);
            });
        return () => { active = false; };
    }, []);

    const toggleChoice = (field: "rate" | "stars", value: number, current: number | null | undefined) => {
        const next = { ...filters };
        if (current === value) delete next[field];
        else next[field] = value;
        onFilterChange(next);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Advanced search</Text>
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.sectionTitle}>Price per night</Text>
                    <Text style={styles.value}>{filters.nightPrice ?? 0}–230</Text>
                </View>
                <Slider
                    accessibilityLabel="Minimum price per night"
                    minimumValue={0}
                    maximumValue={230}
                    step={5}
                    value={filters.nightPrice ?? 0}
                    minimumTrackTintColor={theme.purple}
                    maximumTrackTintColor={theme.border}
                    thumbTintColor={theme.purple}
                    onSlidingComplete={(value) => onFilterChange({ ...filters, nightPrice: value })}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rating</Text>
                {RATING_OPTIONS.map((rating) => (
                    <Pressable
                        key={rating}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: filters.rate === rating }}
                        onPress={() => toggleChoice("rate", rating, filters.rate)}
                        style={styles.option}
                    >
                        <View style={styles.optionLabel}>
                            <View style={[styles.radio, filters.rate === rating && styles.radioSelected]} />
                            <Text style={styles.optionText}>{rating}+</Text>
                        </View>
                        <Text style={styles.count}>{counts.rating[String(rating)] ?? 0}</Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stars</Text>
                {STAR_OPTIONS.map((stars) => (
                    <Pressable
                        key={stars}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: filters.stars === stars }}
                        onPress={() => toggleChoice("stars", stars, filters.stars)}
                        style={styles.option}
                    >
                        <View style={styles.optionLabel}>
                            <View style={[styles.radio, filters.stars === stars && styles.radioSelected]} />
                            <Text style={styles.stars}>{"★".repeat(stars)}</Text>
                        </View>
                        <Text style={styles.count}>{counts.stars[String(stars)] ?? 0}</Text>
                    </Pressable>
                ))}
            </View>

            <View style={[styles.section, styles.lastSection]}>
                <Text style={styles.sectionTitle}>Facilities</Text>
                <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: filters.wifi === true }}
                    onPress={() => {
                        const next = { ...filters };
                        if (filters.wifi) delete next.wifi;
                        else next.wifi = true;
                        onFilterChange(next);
                    }}
                    style={styles.option}
                >
                    <View style={styles.optionLabel}>
                        <View style={[styles.checkbox, filters.wifi && styles.checkboxSelected]}>
                            {filters.wifi ? <Text style={styles.checkmark}>✓</Text> : null}
                        </View>
                        <Text style={styles.optionText}>Wi-Fi</Text>
                    </View>
                    <Text style={styles.count}>{counts.wifi}</Text>
                </Pressable>
                {countsLoading ? <ActivityIndicator color={theme.purple} size="small" style={styles.loader} /> : null}
                {countsError ? <Text style={styles.error}>{countsError}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 16,
        backgroundColor: theme.surface,
    },
    heading: { color: theme.text, fontWeight: "800", fontSize: 18, marginBottom: 4 },
    section: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
    lastSection: { paddingBottom: 0, borderBottomWidth: 0 },
    sectionTitle: { color: theme.text, fontSize: 14, fontWeight: "700" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    value: { color: theme.muted, fontSize: 12 },
    option: { minHeight: 36, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    optionLabel: { flexDirection: "row", alignItems: "center", gap: 9 },
    radio: { width: 17, height: 17, borderWidth: 1, borderColor: theme.border, borderRadius: 9 },
    radioSelected: { borderWidth: 5, borderColor: theme.purple },
    checkbox: { width: 18, height: 18, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.border, borderRadius: 4 },
    checkboxSelected: { backgroundColor: theme.purple, borderColor: theme.purple },
    checkmark: { color: "#FFF", fontSize: 13, lineHeight: 16, fontWeight: "800" },
    optionText: { color: theme.text, fontSize: 13 },
    stars: { color: "#717171", fontSize: 13, letterSpacing: 1 },
    count: { color: theme.muted, fontSize: 12 },
    loader: { alignSelf: "flex-start", marginVertical: 8 },
    error: { color: theme.danger, fontSize: 12, marginTop: 6 },
});