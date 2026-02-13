import { Fonts, GlistenColors } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function DriftButton() {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
        // Start with Restore (vagus reset), then flow into breathing
        router.push('/vagus-reset?flow=combined');
    };

    return (
        <Pressable style={styles.pressable} onPress={handlePress}>
            <LinearGradient
                colors={['rgba(139, 128, 249, 0.2)', 'rgba(90, 79, 207, 0.15)']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.text}>CALM & RESTORE</Text>
                <Text style={styles.subtext}>Vagus Reset → Breathing</Text>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        marginHorizontal: 20,
        borderRadius: 28,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(139, 128, 249, 0.25)',
    },
    gradient: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
        gap: 3,
    },
    text: {
        fontSize: 13,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 2.5,
    },
    subtext: {
        fontSize: 10,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        letterSpacing: 0.5,
    },
});
