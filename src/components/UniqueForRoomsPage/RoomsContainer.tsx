import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getHotelRooms } from "../../Endpoints/HotelEndpoints";
import type { AdvancedSearchDTO, RoomDTO } from "../../Models/dto";
import { SectionHeading } from "../GeneralComponents/PageFrame";
import { theme } from "../GeneralComponents/theme";
import { RoomCard } from "./RoomCard";

type Props = {
    hotelId: number;
    hotelName: string;
    filters: AdvancedSearchDTO;
    header?: React.ReactElement | null;
    onRoomSelect: (room: RoomDTO | null) => void;
};

export const RoomsContainer = ({ hotelId, hotelName, filters, header, onRoomSelect }: Props) => {
    const [rooms, setRooms] = useState<RoomDTO[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getHotelRooms(hotelId, { ...filters, el: 20, page: 1 });
            setRooms(response.results);
            const firstRoom = response.results[0] ?? null;
            setSelectedRoomId(firstRoom?.id ?? null);
            onRoomSelect(firstRoom);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Could not load hotel rooms.");
            onRoomSelect(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        getHotelRooms(hotelId, { ...filters, el: 20, page: 1 })
            .then((response) => {
                if (!active) return;
                setRooms(response.results);
                const firstRoom = response.results[0] ?? null;
                setSelectedRoomId(firstRoom?.id ?? null);
                onRoomSelect(firstRoom);
            })
            .catch((loadError: unknown) => {
                if (active) {
                    setError(loadError instanceof Error ? loadError.message : "Could not load hotel rooms.");
                    onRoomSelect(null);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [hotelId, filters, onRoomSelect]);

    const selectRoom = (room: RoomDTO) => {
        setSelectedRoomId(room.id);
        onRoomSelect(room);
    };

    return (
        <FlatList
            style={styles.list}
            contentContainerStyle={styles.content}
            data={loading || error ? [] : rooms.filter((room) => room.id !== selectedRoomId)}
            keyExtractor={(room) => String(room.id)}
            renderItem={({ item }) => (
                <RoomCard
                    room={item}
                    selected={item.id === selectedRoomId}
                    onSelect={() => selectRoom(item)}
                />
            )}
            ListHeaderComponent={(
                <View>
                    {header}
                    <SectionHeading>Other rooms in {hotelName}</SectionHeading>
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
                ? <Text style={styles.empty}>{rooms.length ? "Select another available room above." : "No rooms are currently available."}</Text>
                : null}
        />
    );
};

const styles = StyleSheet.create({
    list: { flex: 1 },
    content: { paddingBottom: 26 },
    loader: { marginVertical: 24 },
    errorBox: { marginHorizontal: 18, marginBottom: 18 },
    error: { color: theme.danger, fontSize: 14 },
    retry: { color: theme.purple, fontWeight: "700", marginTop: 10 },
    empty: { color: theme.muted, marginHorizontal: 18, marginBottom: 18 },
});