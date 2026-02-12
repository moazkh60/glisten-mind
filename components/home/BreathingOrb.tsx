import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const ORB_SIZE = 200;
const RING_1_SIZE = ORB_SIZE + 40;
const RING_2_SIZE = ORB_SIZE + 80;

export function BreathingOrb() {
    const pulseScale1 = useSharedValue(1);
    const pulseOpacity1 = useSharedValue(0.3);
    const pulseScale2 = useSharedValue(1);
    const pulseOpacity2 = useSharedValue(0.15);

    useEffect(() => {
        // Ring 1: slow breathing pulse
        pulseScale1.value = withRepeat(
            withSequence(
                withTiming(1.08, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
        pulseOpacity1.value = withRepeat(
            withSequence(
                withTiming(0.5, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.2, { duration: 3000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );

        // Ring 2: offset breathing pulse
        pulseScale2.value = withDelay(
            1500,
            withRepeat(
                withSequence(
                    withTiming(1.06, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            )
        );
        pulseOpacity2.value = withDelay(
            1500,
            withRepeat(
                withSequence(
                    withTiming(0.3, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.08, { duration: 3500, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            )
        );
    }, []);

    const ring1Style = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale1.value }],
        opacity: pulseOpacity1.value,
    }));

    const ring2Style = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale2.value }],
        opacity: pulseOpacity2.value,
    }));

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // TODO: navigate to session screen
    };

    return (
        <View style={styles.wrapper}>
            {/* Outer ring */}
            <Animated.View style={[styles.ring2, ring2Style]}>
                <LinearGradient
                    colors={['rgba(108, 92, 231, 0.1)', 'rgba(26, 23, 48, 0)']}
                    style={styles.ringGradient2}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            {/* Inner ring */}
            <Animated.View style={[styles.ring1, ring1Style]}>
                <LinearGradient
                    colors={['rgba(108, 92, 231, 0.2)', 'rgba(26, 23, 48, 0.05)']}
                    style={styles.ringGradient1}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            {/* Main orb */}
            <Pressable onPress={handlePress} style={styles.orbPressable}>
                <LinearGradient
                    colors={[GlistenColors.orbGlow, GlistenColors.primaryMuted, GlistenColors.surface]}
                    style={styles.orb}
                    start={{ x: 0.5, y: 0.2 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="leaf" size={28} color={GlistenColors.textPrimary} />
                    </View>
                    <Text style={styles.beginLabel}>BEGIN SESSION</Text>
                    <Text style={styles.durationLabel}>12 MIN DRIFT</Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: RING_2_SIZE + 20,
        marginVertical: 8,
    },
    ring2: {
        position: 'absolute',
        width: RING_2_SIZE,
        height: RING_2_SIZE,
        borderRadius: RING_2_SIZE / 2,
        overflow: 'hidden',
    },
    ringGradient2: {
        flex: 1,
        borderRadius: RING_2_SIZE / 2,
        borderWidth: 1,
        borderColor: 'rgba(108, 92, 231, 0.08)',
    },
    ring1: {
        position: 'absolute',
        width: RING_1_SIZE,
        height: RING_1_SIZE,
        borderRadius: RING_1_SIZE / 2,
        overflow: 'hidden',
    },
    ringGradient1: {
        flex: 1,
        borderRadius: RING_1_SIZE / 2,
        borderWidth: 1,
        borderColor: 'rgba(108, 92, 231, 0.12)',
    },
    orbPressable: {
        width: ORB_SIZE,
        height: ORB_SIZE,
        borderRadius: ORB_SIZE / 2,
    },
    orb: {
        width: ORB_SIZE,
        height: ORB_SIZE,
        borderRadius: ORB_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(139, 128, 249, 0.2)',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(139, 128, 249, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    beginLabel: {
        fontSize: 13,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
        letterSpacing: 2,
    },
    durationLabel: {
        fontSize: 11,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        letterSpacing: 1,
        marginTop: 4,
    },
});
