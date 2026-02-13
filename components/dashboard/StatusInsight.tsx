import { Fonts, GlistenColors } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface Insight {
    title: string;
    subtitle: string;
}

const INSIGHTS_WITH_DATA: Insight[] = [
    {
        title: 'Your parasympathetic nervous system is optimal for rest.',
        subtitle: 'Heart rate variability shows high resilience tonight.',
    },
    {
        title: 'Slow breathing activates the vagus nerve within seconds.',
        subtitle: 'Your body is already primed for deep recovery.',
    },
    {
        title: 'Bilateral eye movement resets your stress response.',
        subtitle: 'Combine with breathing for maximum parasympathetic gain.',
    },
    {
        title: 'Consistent practice strengthens your vagal tone over time.',
        subtitle: 'Each session builds more resilience for tomorrow.',
    },
];

const INSIGHTS_NO_DATA: Insight[] = [
    {
        title: 'Start a session to discover your nervous system state.',
        subtitle: 'Your first breathing session will begin building your baseline.',
    },
    {
        title: 'The vagus nerve is your body\'s built-in calm switch.',
        subtitle: 'A single session can shift you from stress to rest.',
    },
    {
        title: 'Deep exhales are the fastest way to lower your heart rate.',
        subtitle: 'Try the Vagus Calm pattern to experience it firsthand.',
    },
    {
        title: 'Your breath is the only autonomic function you can consciously control.',
        subtitle: 'Use it as a gateway to calm your entire nervous system.',
    },
];

const CYCLE_INTERVAL = 8_000;
const FADE_DURATION = 400;

interface StatusInsightProps {
    hasData?: boolean;
}

export function StatusInsight({ hasData = false }: StatusInsightProps) {
    const insights = hasData ? INSIGHTS_WITH_DATA : INSIGHTS_NO_DATA;
    const [activeIndex, setActiveIndex] = useState(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out → swap → fade in
            opacity.value = withSequence(
                withTiming(0, { duration: FADE_DURATION, easing: Easing.out(Easing.ease) }),
                withTiming(1, { duration: FADE_DURATION, easing: Easing.in(Easing.ease) })
            );

            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % insights.length);
            }, FADE_DURATION);
        }, CYCLE_INTERVAL);

        return () => clearInterval(interval);
    }, [insights.length]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const insight = insights[activeIndex];

    return (
        <View style={styles.container}>
            {/* Pagination dots */}
            <View style={styles.dots}>
                {insights.map((_, i) => (
                    <View
                        key={i}
                        style={[styles.dot, i === activeIndex && styles.dotActive]}
                    />
                ))}
            </View>

            <Animated.View style={animatedStyle}>
                <Text style={styles.title}>{insight.title}</Text>
                <Text style={styles.subtitle}>{insight.subtitle}</Text>
            </Animated.View>
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
        marginTop: 10,
    },
});
