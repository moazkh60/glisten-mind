import { Fonts, GlistenColors } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function DriftButton() {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/session');
    };

    return (
        <Pressable style={styles.pressable} onPress={handlePress}>
            <LinearGradient
                colors={['rgba(139, 128, 249, 0.2)', 'rgba(90, 79, 207, 0.15)']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.text}>BEGIN DRIFT SESSION</Text>
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
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
    },
    text: {
        fontSize: 13,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 2.5,
    },
});
