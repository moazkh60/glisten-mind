import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const TIPS: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
    { icon: 'moon-outline', text: 'Evening sessions boost HRV recovery overnight.' },
    { icon: 'flame-outline', text: 'Consistency matters more than duration.' },
    { icon: 'leaf-outline', text: 'Extended exhales activate the vagus nerve.' },
    { icon: 'pulse-outline', text: 'Your HRV is highest when you feel rested.' },
    { icon: 'time-outline', text: 'Just 3 minutes of focused breathing resets your nervous system.' },
    { icon: 'water-outline', text: 'Deep breathing lowers cortisol and calms your mind.' },
    { icon: 'cloudy-night-outline', text: 'A calm mind brings inner strength and self-confidence.' },
    { icon: 'flower-outline', text: 'Breath is the bridge between body and mind.' },
    { icon: 'sparkles-outline', text: 'Stillness is where creativity and solutions are found.' },
    { icon: 'sunny-outline', text: 'Even one mindful breath can reset your entire day.' },
    { icon: 'heart-outline', text: 'Slow breathing synchronizes your heart and brain rhythms.' },
    { icon: 'snow-outline', text: 'Cold exposure paired with breath work supercharges resilience.' },
    { icon: 'cellular-outline', text: 'Coherent breathing at 5.5 bpm maximizes HRV.' },
    { icon: 'body-outline', text: 'Your body holds tension your mind has forgotten — breathe it away.' },
    { icon: 'eye-outline', text: 'Closing your eyes during breath work deepens the effect.' },
];

const CYCLE_INTERVAL = 8_000; // 8 seconds
const FADE_DURATION = 400;

export function TipCard() {
    const [tipIndex, setTipIndex] = useState(() =>
        Math.floor(Math.random() * TIPS.length)
    );
    const opacity = useSharedValue(1);

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out → swap → fade in
            opacity.value = withSequence(
                withTiming(0, { duration: FADE_DURATION, easing: Easing.out(Easing.ease) }),
                withTiming(1, { duration: FADE_DURATION, easing: Easing.in(Easing.ease) })
            );

            // Swap text at the midpoint of the animation
            setTimeout(() => {
                setTipIndex((prev) => (prev + 1) % TIPS.length);
            }, FADE_DURATION);
        }, CYCLE_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const tip = TIPS[tipIndex];

    return (
        <View style={styles.outer}>
            <LinearGradient
                colors={['rgba(40, 35, 75, 0.4)', 'rgba(26, 23, 48, 0.6)']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Animated.View style={[styles.row, animatedStyle]}>
                    <View style={styles.iconWrap}>
                        <Ionicons name={tip.icon} size={16} color={GlistenColors.primary} />
                    </View>
                    <Text style={styles.text}>{tip.text}</Text>
                </Animated.View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        marginHorizontal: 20,
        marginTop: 14,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(139, 128, 249, 0.06)',
    },
    card: {
        padding: 14,
        borderRadius: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(139, 128, 249, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    text: {
        flex: 1,
        fontSize: 13,
        fontFamily: Fonts?.sans,
        fontStyle: 'italic',
        color: GlistenColors.textSecondary,
        lineHeight: 18,
    },
});
