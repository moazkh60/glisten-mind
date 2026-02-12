import { SESSION_DURATIONS } from '@/constants/breathingPatterns';
import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface DurationPickerProps {
    selected: number;
    onSelect: (minutes: number) => void;
}

export function DurationPicker({ selected, onSelect }: DurationPickerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Ionicons name="timer-outline" size={14} color={GlistenColors.textSecondary} />
                <Text style={styles.label}>DURATION</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pills}
            >
                {SESSION_DURATIONS.map((min) => (
                    <Pressable
                        key={min}
                        style={[styles.pill, min === selected && styles.pillActive]}
                        onPress={() => onSelect(min)}
                    >
                        <Text style={[styles.pillText, min === selected && styles.pillTextActive]}>
                            {min} min
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        gap: 10,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    label: {
        fontSize: 10,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
        letterSpacing: 1.5,
    },
    pills: {
        flexDirection: 'row',
        gap: 8,
    },
    pill: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: GlistenColors.surfaceGlass,
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    pillActive: {
        backgroundColor: 'rgba(139, 128, 249, 0.15)',
        borderColor: GlistenColors.primary,
    },
    pillText: {
        fontSize: 13,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
    },
    pillTextActive: {
        color: GlistenColors.primary,
    },
});
