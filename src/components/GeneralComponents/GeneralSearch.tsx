import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { AdvancedSearchDTO, CityDTO, CountryDTO } from "../../Models/dto";
import { parseISODate } from "../../utils/calendarDate";
import { CalendarDatePicker } from "./CalendarDatePicker";
import { theme } from "./theme";

type Props = {
    cities: CityDTO[];
    countries: CountryDTO[];
    initialFilters?: AdvancedSearchDTO;
    onSearch: (filters: AdvancedSearchDTO) => void;
};

const displayDate = (value: string) => {
    const date = parseISODate(value);
    return date
        ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Select date";
};

const dayAfter = (value: string) => {
    const date = parseISODate(value);
    if (!date) return new Date();
    date.setDate(date.getDate() + 1);
    return date;
};

export const GeneralSearch = ({ cities, countries, initialFilters, onSearch }: Props) => {
    const [city, setCity] = useState(initialFilters?.city ?? "");
    const [country, setCountry] = useState(initialFilters?.land ?? "");
    const [checkIn, setCheckIn] = useState(initialFilters?.checkIn ?? "");
    const [checkOut, setCheckOut] = useState(initialFilters?.checkOut ?? "");
    const [people, setPeople] = useState(String(initialFilters?.people ?? 2));
    const [activeLocation, setActiveLocation] = useState<"city" | "country" | null>(null);
    const [activeDate, setActiveDate] = useState<"checkIn" | "checkOut" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const countrySuggestions = useMemo(() => {
        const query = country.trim().toLocaleLowerCase();
        return countries
            .filter((item) => item.name.toLocaleLowerCase().includes(query))
            .slice(0, 6);
    }, [countries, country]);

    const citySuggestions = useMemo(() => {
        const query = city.trim().toLocaleLowerCase();
        const selectedCountry = countries.find(
            (item) => item.name.toLocaleLowerCase() === country.trim().toLocaleLowerCase(),
        );
        return cities
            .filter((item) => !selectedCountry || item.country === selectedCountry.id)
            .filter((item) => item.name.toLocaleLowerCase().includes(query))
            .slice(0, 6);
    }, [cities, countries, city, country]);

    const submit = () => {
        if (checkIn && checkOut && checkOut <= checkIn) {
            setError("Check-out must be after check-in.");
            return;
        }
        setError(null);
        setActiveLocation(null);
        const nextFilters: AdvancedSearchDTO = {
            ...initialFilters,
            people: Math.max(1, Math.min(20, Number(people) || 1)),
        };
        if (country.trim()) nextFilters.land = country.trim();
        else delete nextFilters.land;
        if (city.trim()) nextFilters.city = city.trim();
        else delete nextFilters.city;
        if (checkIn) nextFilters.checkIn = checkIn;
        else delete nextFilters.checkIn;
        if (checkOut) nextFilters.checkOut = checkOut;
        else delete nextFilters.checkOut;
        onSearch(nextFilters);
    };

    const selectedDate = activeDate === "checkIn" ? checkIn : checkOut;
    const minimumCheckoutDate = checkIn ? dayAfter(checkIn) : new Date();

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Find your stay</Text>
            <Text style={styles.description}>Choose a destination and dates for your trip</Text>

            <View style={styles.field}>
                <Text style={styles.label}>City</Text>
                <TextInput
                    value={city}
                    onChangeText={(value) => {
                        setCity(value);
                        setActiveLocation("city");
                    }}
                    onFocus={() => setActiveLocation("city")}
                    placeholder="Where are you going?"
                    placeholderTextColor={theme.muted}
                    style={styles.input}
                    accessibilityLabel="City"
                />
                {activeLocation === "city" && city.trim().length > 0 && citySuggestions.length > 0 ? (
                    <ScrollView style={styles.suggestions} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                        {citySuggestions.map((item) => (
                            <Pressable
                                key={item.id}
                                style={styles.suggestion}
                                onPress={() => {
                                    setCity(item.name);
                                    setCountry(countries.find((countryItem) => countryItem.id === item.country)?.name ?? country);
                                    setActiveLocation(null);
                                }}
                            >
                                <Text style={styles.suggestionText}>{item.name}</Text>
                                <Text style={styles.suggestionMeta}>
                                    {countries.find((countryItem) => countryItem.id === item.country)?.name ?? ""}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                ) : null}
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                    value={country}
                    onChangeText={(value) => {
                        setCountry(value);
                        setActiveLocation("country");
                    }}
                    onFocus={() => setActiveLocation("country")}
                    placeholder="Select a country"
                    placeholderTextColor={theme.muted}
                    style={styles.input}
                    accessibilityLabel="Country"
                />
                {activeLocation === "country" && country.trim().length > 0 && countrySuggestions.length > 0 ? (
                    <ScrollView style={styles.suggestions} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                        {countrySuggestions.map((item) => (
                            <Pressable
                                key={item.id}
                                style={styles.suggestion}
                                onPress={() => {
                                    setCountry(item.name);
                                    setActiveLocation(null);
                                }}
                            >
                                <Text style={styles.suggestionText}>{item.name}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                ) : null}
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Stay dates</Text>
                <View style={styles.row}>
                    <Pressable
                        onPress={() => {
                            setActiveLocation(null);
                            setActiveDate("checkIn");
                        }}
                        style={styles.dateField}
                        accessibilityRole="button"
                        accessibilityLabel="Choose check-in date"
                    >
                        <Text style={styles.dateCaption}>Check-in</Text>
                        <Text style={[styles.dateValue, !checkIn && styles.datePlaceholder]}>{displayDate(checkIn)}</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setActiveLocation(null);
                            setActiveDate("checkOut");
                        }}
                        style={styles.dateField}
                        accessibilityRole="button"
                        accessibilityLabel="Choose check-out date"
                    >
                        <Text style={styles.dateCaption}>Check-out</Text>
                        <Text style={[styles.dateValue, !checkOut && styles.datePlaceholder]}>{displayDate(checkOut)}</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.bottomRow}>
                <View style={[styles.field, styles.guestsField]}>
                    <Text style={styles.label}>Guests</Text>
                    <TextInput
                        value={people}
                        onChangeText={(value) => setPeople(value.replace(/\D/g, ""))}
                        keyboardType="number-pad"
                        style={styles.input}
                        accessibilityLabel="Number of guests"
                    />
                </View>
                <Pressable onPress={submit} style={styles.searchButton} accessibilityRole="button">
                    <Text style={styles.searchText}>Search stays</Text>
                </Pressable>
            </View>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            {activeDate ? (
                <CalendarDatePicker
                    key={`${activeDate}-${selectedDate}`}
                    visible
                    value={selectedDate || undefined}
                    minimumDate={activeDate === "checkOut" ? minimumCheckoutDate : new Date()}
                    onClose={() => setActiveDate(null)}
                    onSelect={(value) => {
                        if (activeDate === "checkIn") {
                            setCheckIn(value);
                            if (checkOut && checkOut <= value) setCheckOut("");
                        } else {
                            setCheckOut(value);
                        }
                        setActiveDate(null);
                    }}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.surface,
        marginHorizontal: 16,
        marginTop: 18,
        marginBottom: 22,
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
        shadowColor: "#302849",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    heading: { color: theme.text, fontWeight: "800", fontSize: 20 },
    description: { color: theme.muted, fontSize: 13, marginTop: 5, marginBottom: 18 },
    field: { marginBottom: 14 },
    label: { color: theme.text, fontSize: 13, fontWeight: "700", marginBottom: 7 },
    input: {
        minHeight: 48,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.border,
        color: theme.text,
        fontSize: 15,
        backgroundColor: "#FFFFFF",
    },
    suggestions: {
        maxHeight: 190,
        marginTop: 5,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.border,
    },
    suggestion: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 13,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border,
    },
    suggestionText: { color: theme.text, fontSize: 14 },
    suggestionMeta: { color: theme.muted, fontSize: 12, marginLeft: 8 },
    row: { flexDirection: "row", gap: 10 },
    dateField: {
        flex: 1,
        minHeight: 66,
        justifyContent: "center",
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: "#FFFFFF",
    },
    dateCaption: { color: theme.muted, fontSize: 11, fontWeight: "600", marginBottom: 5 },
    dateValue: { color: theme.text, fontSize: 14, fontWeight: "700" },
    datePlaceholder: { color: theme.purple },
    bottomRow: { flexDirection: "row", gap: 10, alignItems: "flex-end" },
    guestsField: { flex: 0.72, marginBottom: 0 },
    searchButton: {
        flex: 1.28,
        minHeight: 48,
        marginBottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.purple,
        borderRadius: 12,
    },
    searchText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
    error: { color: theme.danger, fontSize: 13, marginTop: 10 },
});
