import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { dateToISO, parseISODate } from "../../utils/calendarDate";
import { theme } from "./theme";

type Props = {
    visible: boolean;
    value?: string;
    minimumDate?: Date;
    maximumDate?: Date;
    onSelect: (value: string) => void;
    onClose: () => void;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const sameDay = (left: Date, right: Date) =>
    left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const CalendarDatePicker = ({ visible, value, minimumDate, maximumDate, onSelect, onClose }: Props) => {
    const initialDate = parseISODate(value) ?? minimumDate ?? new Date();
    const [displayedMonth, setDisplayedMonth] = useState(
        () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
    );
    const selectedDate = parseISODate(value);
    const minDate = minimumDate ? startOfDay(minimumDate) : startOfDay(new Date());
    const maxDate = maximumDate ? startOfDay(maximumDate) : undefined;
    const today = startOfDay(new Date());
    const shortcutDate = today < minDate ? minDate : maxDate && today > maxDate ? maxDate : today;
    const shortcutLabel = today < minDate ? "Earliest" : maxDate && today > maxDate ? "Latest" : "Today";

    const firstOfMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
    const firstCell = new Date(
        firstOfMonth.getFullYear(),
        firstOfMonth.getMonth(),
        1 - ((firstOfMonth.getDay() + 6) % 7),
    );
    const days = Array.from({ length: 42 }, (_, index) =>
        new Date(firstCell.getFullYear(), firstCell.getMonth(), firstCell.getDate() + index),
    );

    const moveMonth = (amount: number) => {
        setDisplayedMonth((month) => new Date(month.getFullYear(), month.getMonth() + amount, 1));
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.calendar} onPress={(event) => event.stopPropagation()}>
                    <View style={styles.monthHeader}>
                        <Pressable
                            accessibilityLabel="Previous month"
                            accessibilityRole="button"
                            onPress={() => moveMonth(-1)}
                            style={styles.monthArrow}
                        >
                            <Text style={styles.arrowText}>‹</Text>
                        </Pressable>
                        <Text style={styles.monthTitle}>
                            {displayedMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </Text>
                        <Pressable
                            accessibilityLabel="Next month"
                            accessibilityRole="button"
                            onPress={() => moveMonth(1)}
                            style={styles.monthArrow}
                        >
                            <Text style={styles.arrowText}>›</Text>
                        </Pressable>
                    </View>
                    <View style={styles.grid}>
                        {WEEKDAYS.map((day) => (
                            <Text key={day} style={styles.weekday}>{day}</Text>
                        ))}
                        {days.map((day) => {
                            const isCurrentMonth = day.getMonth() === displayedMonth.getMonth();
                            const dayTime = startOfDay(day).getTime();
                            const isDisabled = dayTime < minDate.getTime() || (maxDate !== undefined && dayTime > maxDate.getTime());
                            const isSelected = selectedDate ? sameDay(day, selectedDate) : false;
                            const isToday = sameDay(day, new Date());
                            return (
                                <Pressable
                                    key={dateToISO(day)}
                                    disabled={isDisabled}
                                    accessibilityRole="button"
                                    accessibilityLabel={day.toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                    accessibilityState={{ disabled: isDisabled, selected: isSelected }}
                                    onPress={() => onSelect(dateToISO(day))}
                                    style={[
                                        styles.day,
                                        isSelected && styles.selectedDay,
                                        !isCurrentMonth && styles.outsideDay,
                                        isToday && !isSelected && styles.today,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.dayText,
                                            !isCurrentMonth && styles.outsideDayText,
                                            isDisabled && styles.disabledDayText,
                                            isSelected && styles.selectedDayText,
                                        ]}
                                    >
                                        {day.getDate()}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                    <View style={styles.footer}>
                        <Pressable onPress={onClose}><Text style={styles.footerAction}>Cancel</Text></Pressable>
                        <Pressable onPress={() => onSelect(dateToISO(shortcutDate))}>
                            <Text style={styles.footerAction}>{shortcutLabel}</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "rgba(24, 20, 34, 0.42)",
    },
    calendar: {
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: "#FFFFFF",
        shadowColor: "#17121F",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 10,
    },
    monthHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    monthArrow: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: theme.background,
    },
    arrowText: { color: theme.text, fontSize: 28, lineHeight: 32 },
    monthTitle: { color: theme.text, fontSize: 17, fontWeight: "700" },
    grid: { flexDirection: "row", flexWrap: "wrap" },
    weekday: {
        width: `${100 / 7}%`,
        marginBottom: 5,
        color: theme.muted,
        textAlign: "center",
        fontSize: 12,
        fontWeight: "700",
    },
    day: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    selectedDay: { backgroundColor: theme.purple },
    outsideDay: { opacity: 0.48 },
    today: { borderWidth: 1, borderColor: theme.purple },
    dayText: { color: theme.text, fontSize: 14 },
    outsideDayText: { color: theme.muted },
    disabledDayText: { color: "#C6C3CC" },
    selectedDayText: { color: "#FFFFFF", fontWeight: "800" },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.border,
        paddingTop: 13,
        marginTop: 10,
    },
    footerAction: { color: theme.purple, fontWeight: "700", fontSize: 14 },
});
