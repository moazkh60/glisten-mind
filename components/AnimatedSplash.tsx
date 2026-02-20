import { Fonts, GlistenColors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';

const logoSource = require('@/assets/images/icon.png');

interface AnimatedSplashProps {
    onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
    // Shared values for staggered fade-in
    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.7);
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(14);
    const subtitleOpacity = useSharedValue(0);
    const subtitleTranslateY = useSharedValue(10);
    const screenOpacity = useSharedValue(1);

    useEffect(() => {
        const fadeConfig = { duration: 600, easing: Easing.out(Easing.cubic) };

        // 1. Logo fades in and scales up
        logoOpacity.value = withTiming(1, fadeConfig);
        logoScale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.2)) });

        // 2. Title fades in after a short delay
        titleOpacity.value = withDelay(350, withTiming(1, fadeConfig));
        titleTranslateY.value = withDelay(350, withTiming(0, fadeConfig));

        // 3. Subtitle fades in after the title
        subtitleOpacity.value = withDelay(650, withTiming(1, fadeConfig));
        subtitleTranslateY.value = withDelay(650, withTiming(0, fadeConfig));

        // 4. Whole screen fades out after showing for a moment
        screenOpacity.value = withDelay(
            2400,
            withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, (finished) => {
                if (finished) {
                    runOnJS(onFinish)();
                }
            }),
        );
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }],
    }));

    const subtitleStyle = useAnimatedStyle(() => ({
        opacity: subtitleOpacity.value,
        transform: [{ translateY: subtitleTranslateY.value }],
    }));

    const containerStyle = useAnimatedStyle(() => ({
        opacity: screenOpacity.value,
    }));

    return (
        <Animated.View style={[styles.overlay, containerStyle]}>
            <View style={styles.content}>
                <Animated.View style={[styles.logoWrap, logoStyle]}>
                    <Image source={logoSource} style={styles.logo} />
                </Animated.View>

                <Animated.Text style={[styles.title, titleStyle]}>
                    Glisten Mind
                </Animated.Text>

                <Animated.Text style={[styles.subtitle, subtitleStyle]}>
                    Breathe gently · Embrace stillness
                </Animated.Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 16,
    },
    logoWrap: {
        marginBottom: 8,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 24,
    },
    title: {
        fontSize: 30,
        fontFamily: Fonts?.sansBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 1,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        letterSpacing: 0.6,
        textAlign: 'center',
    },
});
