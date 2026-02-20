/**
 * Unified health service for Glisten Mind.
 * Reads HRV, heart rate, and respiratory data from
 * Apple HealthKit (iOS) and Google Health Connect (Android).
 * Falls back gracefully when unavailable.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const HEALTH_STATUS_KEY = '@glisten_health_status';

export interface HealthSample {
    date: string; // ISO string
    value: number;
}

export type HealthStatus = 'not_asked' | 'granted' | 'denied' | 'unavailable';

// ──────── Platform availability ────────

let AppleHealth: any = null;

// Android Health Connect — named imports
let HC_getSdkStatus: any = null;
let HC_SdkAvailabilityStatus: any = null;
let HC_initialize: any = null;
let HC_requestPermission: any = null;
let HC_readRecords: any = null;
let HC_insertRecords: any = null;

try {
    if (Platform.OS === 'ios') {
        AppleHealth = require('react-native-health').default;
    }
} catch {
    // Not available (e.g. Expo Go)
}

try {
    if (Platform.OS === 'android') {
        const hc = require('react-native-health-connect');
        HC_getSdkStatus = hc.getSdkStatus;
        HC_SdkAvailabilityStatus = hc.SdkAvailabilityStatus;
        HC_initialize = hc.initialize;
        HC_requestPermission = hc.requestPermission;
        HC_readRecords = hc.readRecords;
        HC_insertRecords = hc.insertRecords;
    }
} catch {
    // Not available
}

// ──────── Status persistence ────────

export async function getHealthStatus(): Promise<HealthStatus> {
    try {
        const status = await AsyncStorage.getItem(HEALTH_STATUS_KEY);
        return (status as HealthStatus) || 'not_asked';
    } catch {
        return 'not_asked';
    }
}

async function setHealthStatus(status: HealthStatus): Promise<void> {
    await AsyncStorage.setItem(HEALTH_STATUS_KEY, status);
}

// ──────── Check availability ────────

export function isHealthAvailable(): boolean {
    if (Platform.OS === 'ios') return AppleHealth !== null;
    if (Platform.OS === 'android') return HC_getSdkStatus !== null;
    return false;
}

// ──────── Request permissions ────────

export async function requestHealthPermissions(): Promise<boolean> {
    if (!isHealthAvailable()) {
        await setHealthStatus('unavailable');
        return false;
    }

    try {
        if (Platform.OS === 'ios') {
            return await requestIOSPermissions();
        } else if (Platform.OS === 'android') {
            return await requestAndroidPermissions();
        }
    } catch (error) {
        console.warn('Health permission error:', error);
    }

    await setHealthStatus('denied');
    return false;
}

// ──── iOS HealthKit ────

const IOS_READ_PERMISSIONS = [
    'HeartRateVariabilitySDNN',
    'HeartRate',
    'RespiratoryRate',
    'RestingHeartRate',
];

const IOS_WRITE_PERMISSIONS = ['MindfulSession'];

async function requestIOSPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
        const permissions = {
            permissions: {
                read: IOS_READ_PERMISSIONS,
                write: IOS_WRITE_PERMISSIONS,
            },
        };

        AppleHealth.initHealthKit(permissions, (error: any) => {
            if (error) {
                console.warn('HealthKit init error:', error);
                setHealthStatus('denied');
                resolve(false);
            } else {
                setHealthStatus('granted');
                resolve(true);
            }
        });
    });
}

// ──── Android Health Connect ────

async function requestAndroidPermissions(): Promise<boolean> {
    try {
        const sdkStatus = await HC_getSdkStatus();
        if (sdkStatus !== HC_SdkAvailabilityStatus?.SDK_AVAILABLE) {
            await setHealthStatus('unavailable');
            return false;
        }

        await HC_initialize();

        const granted = await HC_requestPermission([
            { accessType: 'read', recordType: 'HeartRate' },
            { accessType: 'read', recordType: 'RestingHeartRate' },
            { accessType: 'write', recordType: 'ExerciseSession' },
        ]);

        if (granted && granted.length > 0) {
            await setHealthStatus('granted');
            return true;
        }
    } catch (error) {
        console.warn('Health Connect error:', error);
    }

    await setHealthStatus('denied');
    return false;
}

// ──────── Read health data ────────

/** Get the most recent HRV reading (ms) */
export async function getLatestHrv(): Promise<number | null> {
    const status = await getHealthStatus();
    if (status !== 'granted') return null;

    try {
        if (Platform.OS === 'ios') {
            return await getIOSLatestHrv();
        }
        // Android Health Connect doesn't have native HRV type
        return null;
    } catch (error) {
        console.warn('Failed to read HRV:', error);
        return null;
    }
}

async function getIOSLatestHrv(): Promise<number | null> {
    return new Promise((resolve) => {
        const options = {
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString(),
            ascending: false,
            limit: 1,
        };

        AppleHealth.getHeartRateVariabilitySamples(options, (error: any, results: any[]) => {
            if (error || !results || results.length === 0) {
                resolve(null);
            } else {
                // HRV is in seconds in HealthKit, convert to ms
                resolve(Math.round(results[0].value * 1000));
            }
        });
    });
}

/** Get recent HRV samples for charting */
export async function getHrvSamples(days: number = 7): Promise<HealthSample[]> {
    const status = await getHealthStatus();
    if (status !== 'granted') return [];

    try {
        if (Platform.OS === 'ios') {
            return await getIOSHrvSamples(days);
        }
        return [];
    } catch {
        return [];
    }
}

async function getIOSHrvSamples(days: number): Promise<HealthSample[]> {
    return new Promise((resolve) => {
        const options = {
            startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString(),
            ascending: true,
        };

        AppleHealth.getHeartRateVariabilitySamples(options, (error: any, results: any[]) => {
            if (error || !results) {
                resolve([]);
            } else {
                resolve(
                    results.map((r: any) => ({
                        date: r.startDate || r.endDate,
                        value: Math.round(r.value * 1000), // sec → ms
                    }))
                );
            }
        });
    });
}

/** Get the most recent resting heart rate (bpm) */
export async function getLatestHeartRate(): Promise<number | null> {
    const status = await getHealthStatus();
    if (status !== 'granted') return null;

    try {
        if (Platform.OS === 'ios') {
            return await getIOSLatestHeartRate();
        } else if (Platform.OS === 'android') {
            return await getAndroidLatestHeartRate();
        }
        return null;
    } catch {
        return null;
    }
}

async function getIOSLatestHeartRate(): Promise<number | null> {
    return new Promise((resolve) => {
        const options = {
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString(),
            ascending: false,
            limit: 1,
        };

        AppleHealth.getRestingHeartRateSamples(options, (error: any, results: any[]) => {
            if (error || !results || results.length === 0) {
                // Fall back to regular heart rate
                AppleHealth.getHeartRateSamples(options, (err2: any, hr: any[]) => {
                    if (err2 || !hr || hr.length === 0) {
                        resolve(null);
                    } else {
                        resolve(Math.round(hr[0].value));
                    }
                });
            } else {
                resolve(Math.round(results[0].value));
            }
        });
    });
}

async function getAndroidLatestHeartRate(): Promise<number | null> {
    try {
        await HC_initialize();

        const result = await HC_readRecords('HeartRate', {
            timeRangeFilter: {
                operator: 'between',
                startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                endTime: new Date().toISOString(),
            },
        });

        if (result?.records?.length > 0) {
            const latest = result.records[result.records.length - 1];
            if (latest.samples?.length > 0) {
                return Math.round(latest.samples[0].beatsPerMinute);
            }
        }
        return null;
    } catch {
        return null;
    }
}

/** Get respiratory rate (breaths/min) — iOS only */
export async function getLatestRespiratoryRate(): Promise<number | null> {
    const status = await getHealthStatus();
    if (status !== 'granted' || Platform.OS !== 'ios') return null;

    try {
        return new Promise((resolve) => {
            const options = {
                startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString(),
                ascending: false,
                limit: 1,
            };

            AppleHealth.getRespiratoryRateSamples(options, (error: any, results: any[]) => {
                if (error || !results || results.length === 0) {
                    resolve(null);
                } else {
                    resolve(Math.round(results[0].value));
                }
            });
        });
    } catch {
        return null;
    }
}

// ──────── Write session data ────────

/** Write a mindfulness session to HealthKit / Health Connect */
export async function writeBreathingSession(
    durationMin: number,
    startDate: Date
): Promise<void> {
    const status = await getHealthStatus();
    if (status !== 'granted') return;

    const endDate = new Date(startDate.getTime() + durationMin * 60 * 1000);

    try {
        if (Platform.OS === 'ios') {
            await writeIOSMindfulSession(startDate, endDate);
        } else if (Platform.OS === 'android') {
            await writeAndroidMindfulSession(startDate, endDate);
        }
    } catch (error) {
        console.warn('Failed to write health session:', error);
    }
}

async function writeIOSMindfulSession(startDate: Date, endDate: Date): Promise<void> {
    return new Promise((resolve, reject) => {
        AppleHealth.saveMindfulSession(
            { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
            (error: any) => {
                if (error) reject(error);
                else resolve();
            }
        );
    });
}

async function writeAndroidMindfulSession(startDate: Date, endDate: Date): Promise<void> {
    try {
        await HC_initialize();
        await HC_insertRecords([
            {
                recordType: 'ExerciseSession',
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                exerciseType: 74, // EXERCISE_TYPE_YOGA
                title: 'Glisten Mind Breathing',
            },
        ]);
    } catch (error) {
        console.warn('Health Connect write error:', error);
    }
}
