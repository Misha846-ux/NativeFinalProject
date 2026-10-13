import { StyleSheet, Text, View } from "react-native";
import type { MainPageReviewDTO, ReviewDTO } from "../../Models/dto";
import { SectionHeading } from "./PageFrame";
import { theme } from "./theme";
import { UserReviews } from "./UserReviews";

type Props = {
    reviews: (ReviewDTO | MainPageReviewDTO)[];
    title?: string;
    limit?: number;
    emptyMessage?: string;
    reviewNumberOfLines?: number;
};

export const UserReviewsContainer = ({
    reviews,
    title = "Guest reviews",
    limit,
    emptyMessage = "No reviews yet.",
    reviewNumberOfLines,
}: Props) => {
    const visibleReviews = limit === undefined ? reviews : reviews.slice(0, limit);

    return (
        <View style={styles.container}>
            <SectionHeading>{title}</SectionHeading>
            {visibleReviews.length
                ? visibleReviews.map((review) => (
                    <UserReviews key={review.id} review={review} numberOfLines={reviewNumberOfLines} />
                ))
                : <Text style={styles.empty}>{emptyMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 8, marginBottom: 10 },
    empty: { color: theme.muted, marginHorizontal: 18, marginBottom: 18 },
});