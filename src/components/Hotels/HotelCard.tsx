import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { HotelDTO, HotelCardDataDTO } from "../../Models/dto";
import { theme } from "../GeneralComponents/theme";

type Props = {
    hotel: HotelDTO;
    cityName?: string;
    countryName?: string;
    cardData?: HotelCardDataDTO;
    onPress: () => void;
};

export const HotelCard = ({ hotel, cityName, countryName, cardData, onPress }: Props) => {
    const photo = cardData?.photos[0]?.photo || hotel.photo;
    const price = cardData?.cheapest_room_price;
    const rating = cardData?.average_rating;

    return (
        <Pressable onPress={onPress} style={styles.card} accessibilityRole="button">
            {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
            ) : (
                <View style={[styles.photo, styles.photoPlaceholder]}>
                    <Text style={styles.photoPlaceholderText}>Hotel for you</Text>
                </View>
            )}
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>{hotel.name}</Text>
                <Text style={styles.location} numberOfLines={1}>
                    {[cityName, countryName].filter(Boolean).join(", ") || hotel.address}
                </Text>
                <View style={styles.meta}>
                    <Text style={styles.stars}>{"★".repeat(Math.max(0, Math.min(5, hotel.stars)))}</Text>
                    {rating !== undefined && rating !== null ? (
                        <Text style={styles.rating}>{rating.toFixed(1)} · {cardData?.review_count ?? 0} reviews</Text>
                    ) : null}
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{price ? `$${Number(price).toFixed(0)}` : "View rooms"}</Text>
                    {price ? <Text style={styles.perNight}> / night</Text> : null}
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        overflow: "hidden",
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
    },
    photo: { width: "100%", height: 190, backgroundColor: "#EFEDF4" },
    photoPlaceholder: { alignItems: "center", justifyContent: "center" },
    photoPlaceholderText: { color: theme.muted, fontWeight: "700" },
    content: { paddingHorizontal: 14, paddingVertical: 12 },
    name: { fontSize: 17, fontWeight: "800", color: theme.text },
    location: { marginTop: 4, fontSize: 13, color: theme.muted },
    meta: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 },
    stars: { color: "#F5A623", fontSize: 14 },
    rating: { color: theme.muted, fontSize: 12 },
    priceRow: { flexDirection: "row", alignItems: "baseline", marginTop: 7 },
    price: { color: theme.text, fontWeight: "800", fontSize: 17 },
    perNight: { color: theme.muted, fontSize: 12 },
});
