import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SessionTimerProps {
    /** Remaining seconds */
    remaining: number;
    /** Total duration in minutes */
    totalMinutes: number;
    /** Whether the session is running */
    isRunning: boolean;
}

export function SessionTimer({ remaining, totalMinutes, isRunning }: SessionTimerProps) {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
        <View style={styles.container}>
            <Ionicons name="stopwatch-outline" size={16} color={GlistenColors.textSecondary} />
            <Text style={styles.text}>
                {isRunning ? display : `${totalMinutes}:00`} MIN SESSION
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: GlistenColors.surfaceGlass,
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    text: {
        fontSize: 13,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
        letterSpacing: 1,
    },
});
