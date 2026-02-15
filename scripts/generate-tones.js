/**
 * Generate gentle breathing tone WAV files for Glisten Mind.
 * Creates 4 short audio tones:
 *   - inhale.wav    — rising tone (C4 → E4), 0.6s
 *   - exhale.wav    — falling tone (E4 → C4), 0.6s
 *   - hold.wav      — soft steady tone (G4), 0.3s
 *   - complete.wav  — two-note chime (C5 + E5), 0.8s
 *
 * Run: node scripts/generate-tones.js
 */

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const SOUNDS_DIR = path.join(__dirname, '..', 'assets', 'sounds');

function generateSineWave(frequency, duration, volume = 0.3) {
    const numSamples = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float64Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
        const t = i / SAMPLE_RATE;
        // Apply fade in/out envelope to avoid clicks
        const fadeLen = Math.min(0.05, duration / 4);
        let envelope = 1;
        if (t < fadeLen) envelope = t / fadeLen;
        if (t > duration - fadeLen) envelope = (duration - t) / fadeLen;
        samples[i] = Math.sin(2 * Math.PI * frequency * t) * volume * envelope;
    }
    return samples;
}

function generateSweep(freqStart, freqEnd, duration, volume = 0.25) {
    const numSamples = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float64Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
        const t = i / SAMPLE_RATE;
        const progress = t / duration;
        const freq = freqStart + (freqEnd - freqStart) * progress;
        const fadeLen = Math.min(0.08, duration / 4);
        let envelope = 1;
        if (t < fadeLen) envelope = t / fadeLen;
        if (t > duration - fadeLen) envelope = (duration - t) / fadeLen;
        samples[i] = Math.sin(2 * Math.PI * freq * t) * volume * envelope;
    }
    return samples;
}

function generateChime(duration, volume = 0.2) {
    const numSamples = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float64Array(numSamples);
    const freq1 = 523.25; // C5
    const freq2 = 659.25; // E5
    for (let i = 0; i < numSamples; i++) {
        const t = i / SAMPLE_RATE;
        // Exponential decay
        const decay = Math.exp(-t * 4);
        const fadeIn = Math.min(t / 0.01, 1);
        // Two harmonics for a bell-like quality
        samples[i] = (
            Math.sin(2 * Math.PI * freq1 * t) * 0.6 +
            Math.sin(2 * Math.PI * freq2 * t) * 0.4
        ) * volume * decay * fadeIn;
    }
    return samples;
}

function samplesToWav(samples) {
    const numSamples = samples.length;
    const bytesPerSample = 2; // 16-bit
    const dataSize = numSamples * bytesPerSample;
    const buffer = Buffer.alloc(44 + dataSize);

    // RIFF header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);

    // fmt chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);          // chunk size
    buffer.writeUInt16LE(1, 20);           // PCM
    buffer.writeUInt16LE(1, 22);           // mono
    buffer.writeUInt32LE(SAMPLE_RATE, 24); // sample rate
    buffer.writeUInt32LE(SAMPLE_RATE * bytesPerSample, 28); // byte rate
    buffer.writeUInt16LE(bytesPerSample, 32); // block align
    buffer.writeUInt16LE(16, 34);          // bits per sample

    // data chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    for (let i = 0; i < numSamples; i++) {
        const clamped = Math.max(-1, Math.min(1, samples[i]));
        const int16 = Math.floor(clamped * 32767);
        buffer.writeInt16LE(int16, 44 + i * bytesPerSample);
    }

    return buffer;
}

// Generate tones
console.log('Generating breathing tones...');

// Inhale — gentle rising sweep (C4 262 → E4 330)
const inhale = generateSweep(262, 330, 0.6, 0.25);
fs.writeFileSync(path.join(SOUNDS_DIR, 'inhale.wav'), samplesToWav(inhale));
console.log('  ✓ inhale.wav');

// Exhale — gentle falling sweep (E4 330 → C4 262)
const exhale = generateSweep(330, 262, 0.6, 0.25);
fs.writeFileSync(path.join(SOUNDS_DIR, 'exhale.wav'), samplesToWav(exhale));
console.log('  ✓ exhale.wav');

// Hold — soft steady tone (G4 392)
const hold = generateSineWave(392, 0.3, 0.15);
fs.writeFileSync(path.join(SOUNDS_DIR, 'hold.wav'), samplesToWav(hold));
console.log('  ✓ hold.wav');

// Complete — bell chime
const complete = generateChime(0.8, 0.2);
fs.writeFileSync(path.join(SOUNDS_DIR, 'complete.wav'), samplesToWav(complete));
console.log('  ✓ complete.wav');

console.log('\nAll tones generated in assets/sounds/');
