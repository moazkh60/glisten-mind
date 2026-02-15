/**
 * Voice cue system for breathing sessions.
 * Uses text-to-speech to guide breathing with eyes closed.
 */

import * as Speech from 'expo-speech';

type SessionPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

/** Voice cue text for each phase */
const PHASE_CUES: Record<SessionPhase, string> = {
    idle: '',
    inhale: 'Breathe in',
    holdIn: 'Hold',
    exhale: 'Breathe out',
    holdOut: 'Hold',
};

/** Speak a phase cue with a calm, slow voice */
export function speakPhaseCue(phase: SessionPhase): void {
    if (phase === 'idle') return;

    const text = PHASE_CUES[phase];

    // Stop any currently speaking cue first
    Speech.stop();

    Speech.speak(text, {
        language: 'en-US',
        pitch: 0.9,     // slightly lower for calm feel
        rate: 0.75,     // slower for a meditative pace
    });
}

/** Speak session completion message */
export function speakSessionComplete(): void {
    Speech.stop();
    Speech.speak('Session complete. Well done.', {
        language: 'en-US',
        pitch: 0.9,
        rate: 0.7,
    });
}

/** Stop any currently playing speech */
export function stopSpeech(): void {
    Speech.stop();
}
