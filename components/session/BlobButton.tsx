import { Fonts, GlistenColors } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const BLOB_SIZE = 220;

// Two organic blob shapes for morphing
const BLOB_PATH_1 =
    'M110,20 C145,15 185,40 195,75 C205,110 200,145 185,175 C170,205 140,210 110,205 C80,200 45,195 30,165 C15,135 20,95 35,65 C50,35 75,25 110,20 Z';
const BLOB_PATH_2 =
    'M110,25 C150,18 190,50 198,80 C206,110 195,150 178,178 C161,206 135,215 108,208 C81,201 50,188 33,158 C16,128 25,90 40,62 C55,34 70,32 110,25 Z';

type SessionPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface BlobButtonProps {
    phase: SessionPhase;
    onStart: () => void;
}

export function BlobButton({ phase, onStart }: BlobButtonProps) {
    const floatAnim = useSharedValue(0);
    const breathAnim = useSharedValue(0);

    useEffect(() => {
        // Gentle idle floating animation
        floatAnim.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    useEffect(() => {
        if (phase === 'inhale') {
            breathAnim.value = withTiming(1, {
                duration: 4000,
                easing: Easing.inOut(Easing.ease),
            });
        } else if (phase === 'exhale') {
            breathAnim.value = withTiming(0, {
                duration: 4000,
                easing: Easing.inOut(Easing.ease),
            });
        }
    }, [phase]);

    const containerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(floatAnim.value, [0, 1], [0, -6]);
        const scale = phase === 'idle'
            ? interpolate(floatAnim.value, [0, 1], [1, 1.03])
            : interpolate(breathAnim.value, [0, 1], [0.95, 1.1]);
        return {
            transform: [{ translateY }, { scale }],
        };
    });

    const phaseLabel = (): string => {
        switch (phase) {
            case 'idle': return 'Start';
            case 'inhale': return 'Breathe in';
            case 'holdIn': return 'Hold';
            case 'exhale': return 'Breathe out';
            case 'holdOut': return 'Hold';
            default: return 'Start';
        }
    };

    const handlePress = () => {
        if (phase === 'idle') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onStart();
        }
    };

    return (
        <Pressable onPress={handlePress} style={styles.wrapper}>
            <Animated.View style={[styles.blobContainer, containerStyle]}>
                <Svg width={BLOB_SIZE} height={BLOB_SIZE} viewBox="0 0 220 220">
                    <Defs>
                        <SvgGradient id="blobGrad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor="#B8A9F0" stopOpacity="1" />
                            <Stop offset="0.5" stopColor="#9485D6" stopOpacity="0.9" />
                            <Stop offset="1" stopColor="#6C5CE7" stopOpacity="0.8" />
                        </SvgGradient>
                    </Defs>
                    <Path d={BLOB_PATH_1} fill="url(#blobGrad)" />
                </Svg>

                {/* Label overlay */}
                <View style={styles.labelOverlay}>
                    <Text style={styles.phaseText}>{phaseLabel()}</Text>
                    {phase === 'idle' && (
                        <View style={styles.dots}>
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </View>
                    )}
                </View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: BLOB_SIZE + 40,
    },
    blobContainer: {
        width: BLOB_SIZE,
        height: BLOB_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phaseText: {
        fontSize: 28,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(232, 228, 255, 0.4)',
    },
});
