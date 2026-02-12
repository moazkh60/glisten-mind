/**
 * Breathing pattern definitions for Glisten Mind.
 * Each pattern defines inhale/hold/exhale/hold durations in seconds.
 */

export interface BreathingPattern {
    id: string;
    name: string;
    description: string;
    /** Duration of inhale phase in seconds */
    inhale: number;
    /** Duration of hold-after-inhale in seconds */
    holdIn: number;
    /** Duration of exhale phase in seconds */
    exhale: number;
    /** Duration of hold-after-exhale in seconds */
    holdOut: number;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
    {
        id: 'vagus-calm',
        name: 'Vagus Calm',
        description: 'Extended exhale to activate vagus nerve',
        inhale: 4,
        holdIn: 2,
        exhale: 8,
        holdOut: 2,
    },
    {
        id: 'box-breathing',
        name: 'Box Breathing',
        description: 'Equal phases for focus and balance',
        inhale: 4,
        holdIn: 4,
        exhale: 4,
        holdOut: 4,
    },
    {
        id: '4-7-8',
        name: '4-7-8 Relaxing',
        description: 'Deep relaxation for sleep',
        inhale: 4,
        holdIn: 7,
        exhale: 8,
        holdOut: 0,
    },
    {
        id: 'coherent',
        name: 'Coherent Breathing',
        description: '5.5 breaths per minute for HRV',
        inhale: 5,
        holdIn: 0,
        exhale: 5,
        holdOut: 0,
    },
    {
        id: 'calming',
        name: 'Simple Calm',
        description: 'Gentle rhythm for beginners',
        inhale: 3,
        holdIn: 1,
        exhale: 5,
        holdOut: 1,
    },
];

/** Available session durations in minutes */
export const SESSION_DURATIONS = [1, 3, 5, 10, 15, 20];

export const DEFAULT_PATTERN = BREATHING_PATTERNS[0];
export const DEFAULT_DURATION = 5;
