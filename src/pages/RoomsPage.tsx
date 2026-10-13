import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { getHotelReviews } from "../Endpoints/HotelEndpoints";
import type { AdvancedSearchDTO, ReviewDTO, RoomDTO } from "../Models/dto";
import type { RootStackParamList } from "../Navigation/types";
import { PageFrame } from "../components/GeneralComponents/PageFrame";
import { UserReviewsContainer } from "../components/GeneralComponents/UserReviewsContainer";
import { theme } from "../components/GeneralComponents/theme";
import { RoomsContainer } from "../components/UniqueForRoomsPage/RoomsContainer";
import { SelectedRoom } from "../components/UniqueForRoomsPage/SelectedRoom";

type Props = NativeStackScreenProps<RootStackParamList, "Rooms">;
const EMPTY_SEARCH_FILTERS: AdvancedSearchDTO = {};

export const RoomsPage = () => {
    const route = useRoute<Props["route"]>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { hotel } = route.params;
    const filters = route.params.filters ?? EMPTY_SEARCH_FILTERS;
    const [selectedRoom, setSelectedRoom] = useState<RoomDTO | null>(null);
    const [reviews, setReviews] = useState<ReviewDTO[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        getHotelReviews(hotel.id)
            .then((response) => {
                if (active) setReviews(response.results);
            })
            .catch((loadError: unknown) => {
                if (active) {
                    setReviews([]);
                    setReviewsError(loadError instanceof Error ? loadError.message : "Could not load reviews.");
                }
            })
            .finally(() => {
                if (active) setReviewsLoading(false);
            });
        return () => { active = false; };
    }, [hotel.id]);

    const handleRoomSelect = useCallback((room: RoomDTO | null) => {
        setSelectedRoom(room);
    }, []);

    const header = (
        <View>
            {selectedRoom ? (
                <SelectedRoom
                    key={selectedRoom.id}
                    room={selectedRoom}
                    address={hotel.address}
                    onBook={() => navigation.navigate("BookingDates", {
                        hotelId: hotel.id,
                        room: selectedRoom,
                        filters,
                    })}
                />
            ) : null}
            {reviewsLoading ? <ActivityIndicator color={theme.purple} style={{ marginVertical: 12 }} /> : null}
            {reviewsError ? <Text style={{ color: theme.danger, marginHorizontal: 18, marginBottom: 12 }}>{reviewsError}</Text> : null}
            {!reviewsLoading && !reviewsError
                ? <UserReviewsContainer reviews={reviews} title="Guest reviews" limit={5} />
                : null}
        </View>
    );

    return (
        <PageFrame title="Choose a room" scroll={false}>
            <RoomsContainer
                key={hotel.id}
                hotelId={hotel.id}
                hotelName={hotel.name}
                filters={filters}
                header={header}
                onRoomSelect={handleRoomSelect}
            />
        </PageFrame>
    );
};
