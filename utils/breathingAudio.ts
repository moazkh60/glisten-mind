/**
 * Audio cue system for breathing sessions.
 * Plays real mp3 audio files for each breathing phase
 * instead of text-to-speech.
 */

import { Audio } from 'expo-av';

type SessionPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

/** Audio files mapped to phases */
const PHASE_AUDIO: Record<Exclude<SessionPhase, 'idle'>, any> = {
    inhale: require('@/assets/audio/breath-in.mp3'),
    holdIn: require('@/assets/audio/hold.mp3'),
    exhale: require('@/assets/audio/breath-out.mp3'),
    holdOut: require('@/assets/audio/hold.mp3'),
};

const SESSION_COMPLETE_AUDIO = require('@/assets/audio/session-complete.mp3');

/** Currently playing sound instance */
let currentSound: Audio.Sound | null = null;

/** Configure audio mode for background mixing */
async function ensureAudioMode(): Promise<void> {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
        });
    } catch {
        // Non-critical — audio will still work in most cases
    }
}

let audioModeSet = false;

/** Play an audio source, stopping any previous sound first */
async function playAudio(source: any): Promise<void> {
    // Set audio mode once
    if (!audioModeSet) {
        await ensureAudioMode();
        audioModeSet = true;
    }

    // Stop and unload any previous sound
    await stopCurrentSound();

    try {
        const { sound } = await Audio.Sound.createAsync(source, {
            shouldPlay: true,
            volume: 1.0,
        });
        currentSound = sound;

        // Auto-cleanup when playback finishes
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync().catch(() => { });
                if (currentSound === sound) {
                    currentSound = null;
                }
            }
        });
    } catch (error) {
        console.warn('Failed to play audio:', error);
    }
}

/** Stop currently playing sound */
async function stopCurrentSound(): Promise<void> {
    if (currentSound) {
        try {
            await currentSound.stopAsync();
            await currentSound.unloadAsync();
        } catch {
            // Already unloaded
        }
        currentSound = null;
    }
}

/** Play the audio cue for a breathing phase */
export async function speakPhaseCue(phase: SessionPhase, soundEnabled: boolean = true): Promise<void> {
    if (!soundEnabled || phase === 'idle') return;
    await playAudio(PHASE_AUDIO[phase]);
}

/** Play session completion audio */
export async function speakSessionComplete(soundEnabled: boolean = true): Promise<void> {
    if (!soundEnabled) return;
    await playAudio(SESSION_COMPLETE_AUDIO);
}

/** Stop any currently playing audio */
export function stopSpeech(): void {
    stopCurrentSound();
}
