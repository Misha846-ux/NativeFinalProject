import { StyleSheet, Text, View } from "react-native";
import type { MainPageReviewDTO, ReviewDTO } from "../../Models/dto";
import { theme } from "./theme";

type Props = {
    review: ReviewDTO | MainPageReviewDTO;
    numberOfLines?: number;
};

export const UserReviews = ({ review, numberOfLines }: Props) => {
    const hotel = typeof review.hotel === "object" ? review.hotel : null;

    return (
        <View style={styles.card}>
            <Text style={styles.name}>
                Guest · {"★".repeat(Math.max(0, Math.min(5, review.rating)))}
            </Text>
            <Text style={styles.text} numberOfLines={numberOfLines}>{review.review}</Text>
            {hotel?.name ? <Text style={styles.hotel}>{hotel.name}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: theme.border,
    },
    name: { color: theme.text, fontWeight: "700", fontSize: 14 },
    text: { color: theme.muted, marginTop: 7, lineHeight: 20 },
    hotel: { color: theme.purple, marginTop: 7, fontSize: 12, fontWeight: "600" },
});