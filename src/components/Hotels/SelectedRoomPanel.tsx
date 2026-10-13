import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { RoomDTO } from "../../Models/dto";
import { theme } from "../GeneralComponents/theme";

type Props = {
    room: RoomDTO;
    address: string;
    photos: string[];
    onBook: () => void;
};

export const SelectedRoomPanel = ({ room, address, photos, onBook }: Props) => {
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const currentIndex = photos.length ? Math.min(currentPhoto, photos.length - 1) : 0;

    const movePhoto = (direction: -1 | 1) => {
        setCurrentPhoto((index) => (index + direction + photos.length) % photos.length);
    };

    return (
        <View style={styles.container}>
            <View style={styles.gallery}>
                {photos.length > 0 ? (
                    <Image
                        source={{ uri: photos[currentIndex] }}
                        style={styles.photo}
                        resizeMode="cover"
                        accessibilityLabel={room.description ?? `Room ${room.roomNumber}`}
                    />
                ) : (
                    <View style={[styles.photo, styles.placeholder]}>
                        <Text style={styles.placeholderText}>Room photo unavailable</Text>
                    </View>
                )}
                {photos.length > 1 ? (
                    <>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Previous room photo"
                            onPress={() => movePhoto(-1)}
                            style={[styles.arrow, styles.previousArrow]}
                        >
                            <Text style={styles.arrowText}>‹</Text>
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Next room photo"
                            onPress={() => movePhoto(1)}
                            style={[styles.arrow, styles.nextArrow]}
                        >
                            <Text style={styles.arrowText}>›</Text>
                        </Pressable>
                        <View style={styles.counter}>
                            <Text style={styles.counterText}>{currentIndex + 1} / {photos.length}</Text>
                        </View>
                    </>
                ) : null}
            </View>

            <View style={styles.details}>
                <Text style={styles.title}>{room.description?.trim() || `Room ${room.roomNumber}`}</Text>
                <Text style={styles.address}>{address}</Text>
                <Text style={styles.amenities}>
                    {room.beds} {room.beds === 1 ? "bed" : "beds"}
                    {room.wifi ? "  ·  Free Wi-Fi" : ""}
                    {room.Bath ? "  ·  Bath" : ""}
                    {room.privatePool ? "  ·  Private pool" : ""}
                </Text>
                <View style={styles.bookingRow}>
                    <View>
                        <Text style={styles.price}>${Number(room.price).toFixed(0)}</Text>
                        <Text style={styles.priceCaption}>per night</Text>
                    </View>
                    <Pressable onPress={onBook} style={styles.bookButton} accessibilityRole="button">
                        <Text style={styles.bookButtonText}>Book this room</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 22,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: theme.border,
        overflow: "hidden",
    },
    gallery: { position: "relative" },
    photo: { width: "100%", height: 250, backgroundColor: "#EFEDF4" },
    placeholder: { alignItems: "center", justifyContent: "center" },
    placeholderText: { color: theme.muted, fontWeight: "600" },
    arrow: {
        position: "absolute",
        top: "44%",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.94)",
        elevation: 2,
    },
    previousArrow: { left: 12 },
    nextArrow: { right: 12 },
    arrowText: { color: theme.text, fontSize: 29, lineHeight: 33 },
    counter: {
        position: "absolute",
        right: 12,
        bottom: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "rgba(34,34,34,0.7)",
    },
    counterText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
    details: { padding: 16 },
    title: { color: theme.text, fontSize: 20, lineHeight: 26, fontWeight: "800" },
    address: { marginTop: 7, color: theme.muted, fontSize: 13 },
    amenities: { marginTop: 12, color: theme.text, fontSize: 13, lineHeight: 20 },
    bookingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 18,
        paddingTop: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.border,
    },
    price: { color: theme.text, fontSize: 21, fontWeight: "800" },
    priceCaption: { marginTop: 2, color: theme.muted, fontSize: 12 },
    bookButton: {
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: 18,
        borderRadius: 11,
        backgroundColor: theme.purple,
    },
    bookButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
});
