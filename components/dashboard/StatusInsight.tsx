import { Fonts, GlistenColors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatusInsightProps {
    title?: string;
    subtitle?: string;
    activeDot?: number;
    totalDots?: number;
}

export function StatusInsight({
    title = 'Your parasympathetic nervous system is optimal for rest.',
    subtitle = 'Heart rate variability shows high resilience tonight.',
    activeDot = 0,
    totalDots = 4,
}: StatusInsightProps) {
    return (
        <View style={styles.container}>
            {/* Pagination dots */}
            <View style={styles.dots}>
                {Array.from({ length: totalDots }).map((_, i) => (
                    <View
                        key={i}
                        style={[styles.dot, i === activeDot && styles.dotActive]}
                    />
                ))}
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 28,
        gap: 10,
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(139, 128, 249, 0.2)',
    },
    dotActive: {
        backgroundColor: GlistenColors.primary,
    },
    title: {
        fontSize: 22,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textPrimary,
        textAlign: 'center',
        lineHeight: 30,
    },
    subtitle: {
        fontSize: 13,
        fontFamily: Fonts?.sans,
        fontStyle: 'italic',
        color: GlistenColors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
    },
});
