import { Fonts, GlistenColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getMonthData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString('default', { month: 'long' });

    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    return { monthName, firstDayOfWeek, daysInMonth, today };
}

interface CalendarHeatmapProps {
    activeDays: Set<number>;
}

export function CalendarHeatmap({ activeDays }: CalendarHeatmapProps) {
    const { monthName, firstDayOfWeek, daysInMonth, today } = getMonthData();

    // Build grid cells
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
        cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(d);
    }
    while (cells.length % 7 !== 0) {
        cells.push(null);
    }

    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
        rows.push(cells.slice(i, i + 7));
    }

    const activeDaysCount = activeDays.size;

    return (
        <View style={styles.outer}>
            <LinearGradient
                colors={['rgba(40, 35, 75, 0.6)', 'rgba(26, 23, 48, 0.8)']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerRow}>
                    <Text style={styles.monthTitle}>{monthName}</Text>
                    <Text style={styles.activeBadge}>
                        {activeDaysCount} {activeDaysCount === 1 ? 'day' : 'days'} active
                    </Text>
                </View>

                {/* Day headers */}
                <View style={styles.row}>
                    {DAY_HEADERS.map((d, i) => (
                        <View key={i} style={styles.cell}>
                            <Text style={styles.dayHeader}>{d}</Text>
                        </View>
                    ))}
                </View>

                {/* Calendar grid */}
                {rows.map((row, ri) => (
                    <View key={ri} style={styles.row}>
                        {row.map((day, ci) => (
                            <View key={ci} style={styles.cell}>
                                {day ? (
                                    <View
                                        style={[
                                            styles.dayDot,
                                            activeDays.has(day)
                                                ? styles.dayActive
                                                : styles.dayInactive,
                                            day === today && styles.dayToday,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                activeDays.has(day) && styles.dayTextActive,
                                                day === today && styles.dayTextToday,
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        ))}
                    </View>
                ))}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    container: {
        padding: 16,
        borderRadius: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    monthTitle: {
        fontSize: 16,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
    },
    activeBadge: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    dayHeader: {
        fontSize: 10,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textMuted,
        marginBottom: 4,
    },
    dayDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayActive: {
        backgroundColor: 'rgba(139, 128, 249, 0.25)',
    },
    dayInactive: {
        backgroundColor: 'transparent',
    },
    dayToday: {
        borderWidth: 1.5,
        borderColor: GlistenColors.primary,
    },
    dayText: {
        fontSize: 12,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
    },
    dayTextActive: {
        color: GlistenColors.primary,
        fontFamily: Fonts?.sansSemiBold,
    },
    dayTextToday: {
        color: GlistenColors.textPrimary,
        fontFamily: Fonts?.sansBold,
    },
});
