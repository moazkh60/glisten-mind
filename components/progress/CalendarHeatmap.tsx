import { Fonts, GlistenColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Mock: days the user practiced this month (1-indexed)
const ACTIVE_DAYS = new Set([1, 2, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 19, 20]);

const DAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getMonthData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString('default', { month: 'long' });

    // First day of month (0=Sun, 6=Sat)
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return { monthName, firstDayOfWeek, daysInMonth };
}

export function CalendarHeatmap() {
    const { monthName, firstDayOfWeek, daysInMonth } = getMonthData();

    // Build grid cells
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
        cells.push(null); // empty cells before first day
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(d);
    }
    // Pad to full rows
    while (cells.length % 7 !== 0) {
        cells.push(null);
    }

    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
        rows.push(cells.slice(i, i + 7));
    }

    return (
        <View style={styles.outer}>
            <LinearGradient
                colors={['rgba(40, 35, 75, 0.6)', 'rgba(26, 23, 48, 0.8)']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.monthTitle}>{monthName}</Text>

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
                                            ACTIVE_DAYS.has(day) ? styles.dayActive : styles.dayInactive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                ACTIVE_DAYS.has(day) && styles.dayTextActive,
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
    monthTitle: {
        fontSize: 16,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        marginBottom: 12,
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
    dayText: {
        fontSize: 12,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
    },
    dayTextActive: {
        color: GlistenColors.primary,
        fontFamily: Fonts?.sansSemiBold,
    },
});
