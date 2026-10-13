import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { RoomDTO } from "../../Models/dto";
import { theme } from "../GeneralComponents/theme";

type Props = {
    room: RoomDTO;
    photo?: string;
    selected: boolean;
    onSelect: () => void;
};

export const RoomCard = ({ room, photo, selected, onSelect }: Props) => (
    <Pressable
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={[styles.card, selected && styles.selectedCard]}
    >
        {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
        ) : (
            <View style={[styles.photo, styles.placeholder]}>
                <Text style={styles.placeholderText}>No photo</Text>
            </View>
        )}
        <View style={styles.body}>
            <Text style={styles.title}>{room.description || `Room ${room.roomNumber}`}</Text>
            <Text style={styles.detail}>{room.beds} {room.beds === 1 ? "bed" : "beds"} · {room.wifi ? "Wi-Fi" : "No Wi-Fi"}{room.Bath ? " · Private bath" : ""}{room.privatePool ? " · Pool" : ""}</Text>
            <View style={styles.row}>
                <Text style={styles.price}>${Number(room.price).toFixed(0)} <Text style={styles.perNight}>/ night</Text></Text>
                <Text style={[styles.buttonText, selected && styles.selectedText]}>
                    {selected ? "Selected" : "View room"}
                </Text>
            </View>
        </View>
    </Pressable>
);

const styles = StyleSheet.create({
    card: { marginHorizontal: 16, marginBottom: 14, borderRadius: 15, borderWidth: 1, borderColor: theme.border, overflow: "hidden", backgroundColor: "#FFF" },
    selectedCard: { borderColor: theme.purple, borderWidth: 2 },
    photo: { width: "100%", height: 150, backgroundColor: "#EFEDF4" },
    placeholder: { justifyContent: "center", alignItems: "center" },
    placeholderText: { color: theme.muted, fontSize: 13 },
    body: { padding: 14 },
    title: { color: theme.text, fontSize: 16, fontWeight: "800" },
    detail: { marginTop: 6, color: theme.muted, fontSize: 13, lineHeight: 19 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
    price: { color: theme.text, fontSize: 17, fontWeight: "800" },
    perNight: { color: theme.muted, fontSize: 12, fontWeight: "400" },
    buttonText: { color: theme.purple, fontWeight: "700" },
    selectedText: { color: theme.green },
});
