import { BREATHING_PATTERNS, BreathingPattern } from '@/constants/breathingPatterns';
import { Fonts, GlistenColors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface PatternPickerProps {
    selected: BreathingPattern;
    onSelect: (pattern: BreathingPattern) => void;
}

export function PatternPicker({ selected, onSelect }: PatternPickerProps) {
    const [visible, setVisible] = useState(false);

    const handleSelect = (pattern: BreathingPattern) => {
        onSelect(pattern);
        setVisible(false);
    };

    return (
        <>
            <Pressable style={styles.trigger} onPress={() => setVisible(true)}>
                <Ionicons name="options-outline" size={16} color={GlistenColors.primary} />
                <Text style={styles.triggerText}>{selected.name}</Text>
                <Ionicons name="chevron-down" size={14} color={GlistenColors.textSecondary} />
            </Pressable>

            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                    <View style={styles.sheet}>
                        <LinearGradient
                            colors={['rgba(26, 23, 48, 0.98)', 'rgba(13, 11, 26, 0.98)']}
                            style={styles.sheetGradient}
                        >
                            <View style={styles.sheetHandle} />
                            <Text style={styles.sheetTitle}>BREATHING PATTERN</Text>

                            <FlatList
                                data={BREATHING_PATTERNS}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={[
                                            styles.patternItem,
                                            item.id === selected.id && styles.patternItemActive,
                                        ]}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <View style={styles.patternInfo}>
                                            <Text style={styles.patternName}>{item.name}</Text>
                                            <Text style={styles.patternDesc}>{item.description}</Text>
                                            <Text style={styles.patternTiming}>
                                                {item.inhale}s in · {item.holdIn > 0 ? `${item.holdIn}s hold · ` : ''}
                                                {item.exhale}s out{item.holdOut > 0 ? ` · ${item.holdOut}s hold` : ''}
                                            </Text>
                                        </View>
                                        {item.id === selected.id && (
                                            <Ionicons name="checkmark-circle" size={22} color={GlistenColors.primary} />
                                        )}
                                    </Pressable>
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        </LinearGradient>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: GlistenColors.surfaceGlass,
        borderWidth: 1,
        borderColor: GlistenColors.surfaceBorder,
    },
    triggerText: {
        fontSize: 13,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
        maxHeight: '60%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    sheetGradient: {
        padding: 20,
        paddingTop: 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    sheetHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: GlistenColors.textMuted,
        alignSelf: 'center',
        marginBottom: 16,
    },
    sheetTitle: {
        fontSize: 11,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textSecondary,
        letterSpacing: 2,
        marginBottom: 16,
    },
    patternItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 14,
        marginBottom: 8,
        backgroundColor: 'rgba(40, 35, 75, 0.3)',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    patternItemActive: {
        borderColor: GlistenColors.primary,
        backgroundColor: 'rgba(139, 128, 249, 0.08)',
    },
    patternInfo: {
        flex: 1,
        marginRight: 12,
    },
    patternName: {
        fontSize: 16,
        fontFamily: Fonts?.sansSemiBold,
        color: GlistenColors.textPrimary,
        marginBottom: 2,
    },
    patternDesc: {
        fontSize: 12,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textSecondary,
        marginBottom: 4,
    },
    patternTiming: {
        fontSize: 11,
        fontFamily: Fonts?.sans,
        color: GlistenColors.textMuted,
    },
});
