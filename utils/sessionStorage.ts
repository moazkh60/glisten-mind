/**
 * Session storage utilities for Glisten Mind.
 * Persists completed session data using AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_KEY = '@glisten_sessions';

export interface SessionRecord {
    id: string;
    patternName: string;
    patternId: string;
    durationMin: number;
    completedAt: string; // ISO date string
    breathCycles: number;
    /** Simulated readiness score (0-100) */
    score: number;
    /** Simulated HRV in ms */
    hrv: number;
    /** Breaths per minute based on pattern */
    breathRate: number;
}

/** Generate a unique ID for each session */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Map pattern names to readiness card titles */
const READINESS_TITLES: Record<string, string> = {
    'vagus-calm': 'Deep Stillness',
    'box-breathing': 'Focused Balance',
    '4-7-8': 'Sleep Harmony',
    'coherent': 'Heart Coherence',
    'calming': 'Gentle Calm',
};

export function getReadinessTitle(patternId: string): string {
    return READINESS_TITLES[patternId] || 'Inner Peace';
}

/** Compute simulated metrics from a completed session */
export function computeSessionMetrics(
    patternId: string,
    durationMin: number,
    cycleDurationSec: number
): { score: number; hrv: number; breathRate: number; breathCycles: number } {
    const breathCycles = Math.floor((durationMin * 60) / cycleDurationSec);
    const breathRate = Math.round(60 / cycleDurationSec);

    // Score: base 60, +3 per minute, +random 0-10, capped at 100
    const score = Math.min(60 + durationMin * 3 + Math.floor(Math.random() * 11), 100);

    // HRV: base 50, +4 per minute, +random 0-8
    const hrv = Math.min(50 + durationMin * 4 + Math.floor(Math.random() * 9), 120);

    return { score, hrv, breathRate, breathCycles };
}

/** Save a completed session */
export async function saveSession(record: SessionRecord): Promise<void> {
    try {
        const existing = await getAllSessions();
        existing.push(record);
        await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(existing));
    } catch (error) {
        console.error('Failed to save session:', error);
    }
}

/** Create and save a session record from completion data */
export async function createAndSaveSession(
    patternId: string,
    patternName: string,
    durationMin: number,
    cycleDurationSec: number
): Promise<SessionRecord> {
    const metrics = computeSessionMetrics(patternId, durationMin, cycleDurationSec);

    const record: SessionRecord = {
        id: generateId(),
        patternName,
        patternId,
        durationMin,
        completedAt: new Date().toISOString(),
        ...metrics,
    };

    await saveSession(record);
    return record;
}

/** Retrieve all sessions */
export async function getAllSessions(): Promise<SessionRecord[]> {
    try {
        const json = await AsyncStorage.getItem(SESSIONS_KEY);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Failed to load sessions:', error);
        return [];
    }
}

/** Retrieve the most recent session, or null if none */
export async function getLatestSession(): Promise<SessionRecord | null> {
    const sessions = await getAllSessions();
    if (sessions.length === 0) return null;
    return sessions[sessions.length - 1];
}

/** Filter sessions by time range: 0 = This Week, 1 = This Month, 2 = All Time */
export function getSessionsInRange(sessions: SessionRecord[], rangeIndex: number): SessionRecord[] {
    if (rangeIndex === 2) return sessions; // All Time

    const now = new Date();
    let cutoff: Date;

    if (rangeIndex === 0) {
        // This Week — past 7 days
        cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else {
        // This Month — past 30 days
        cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    }

    return sessions.filter((s) => new Date(s.completedAt) >= cutoff);
}

/** Average HRV across sessions */
export function getAverageHrv(sessions: SessionRecord[]): number {
    if (sessions.length === 0) return 0;
    const sum = sessions.reduce((acc, s) => acc + s.hrv, 0);
    return Math.round(sum / sessions.length);
}

/** Group sessions into daily HRV averages for charting (last 7 days) */
export function getDailyHrvData(sessions: SessionRecord[]): { labels: string[]; values: number[] } {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const dayStr = day.toISOString().split('T')[0]; // YYYY-MM-DD
        labels.push(dayNames[day.getDay()]);

        const daySessions = sessions.filter(
            (s) => s.completedAt.split('T')[0] === dayStr
        );

        if (daySessions.length > 0) {
            const avg = daySessions.reduce((a, s) => a + s.hrv, 0) / daySessions.length;
            values.push(Math.round(avg));
        } else {
            values.push(0); // no data for this day
        }
    }

    return { labels, values };
}

/** Extract score array for vagus tone sparkline */
export function getVagusToneScores(sessions: SessionRecord[]): number[] {
    // Take last 10 sessions for the sparkline
    return sessions.slice(-10).map((s) => s.score);
}

/** Compute HRV trend: 'up' | 'down' | 'stable' */
export function getHrvTrend(sessions: SessionRecord[]): 'up' | 'down' | 'stable' {
    if (sessions.length < 2) return 'stable';
    const recent = sessions.slice(-3);
    const older = sessions.slice(-6, -3);
    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((a, s) => a + s.hrv, 0) / recent.length;
    const olderAvg = older.reduce((a, s) => a + s.hrv, 0) / older.length;

    if (recentAvg > olderAvg + 2) return 'up';
    if (recentAvg < olderAvg - 2) return 'down';
    return 'stable';
}

// ──────── Progress-related helpers ────────

/** Get a Set of day numbers (1-indexed) in the current month when the user had sessions */
export function getActiveDaysThisMonth(sessions: SessionRecord[]): Set<number> {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const activeDays = new Set<number>();

    for (const s of sessions) {
        const d = new Date(s.completedAt);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            activeDays.add(d.getDate());
        }
    }
    return activeDays;
}

/** Get unique session dates as YYYY-MM-DD strings */
function getUniqueDates(sessions: SessionRecord[]): string[] {
    const dates = new Set(sessions.map((s) => s.completedAt.split('T')[0]));
    return [...dates].sort();
}

/** Calculate current daily streak (consecutive days ending today or yesterday) */
export function getCurrentStreak(sessions: SessionRecord[]): number {
    if (sessions.length === 0) return 0;

    const uniqueDates = getUniqueDates(sessions);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Streak must end on today or yesterday
    const lastDate = uniqueDates[uniqueDates.length - 1];
    if (lastDate !== todayStr && lastDate !== yesterdayStr) return 0;

    let streak = 1;
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
        const current = new Date(uniqueDates[i + 1]);
        const prev = new Date(uniqueDates[i]);
        const diffMs = current.getTime() - prev.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

/** Calculate the best streak ever */
export function getBestStreak(sessions: SessionRecord[]): number {
    if (sessions.length === 0) return 0;

    const uniqueDates = getUniqueDates(sessions);
    let best = 1;
    let current = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffMs = curr.getTime() - prev.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            current++;
            best = Math.max(best, current);
        } else {
            current = 1;
        }
    }
    return best;
}

/** Total minutes across all sessions */
export function getTotalMinutes(sessions: SessionRecord[]): number {
    return sessions.reduce((sum, s) => sum + s.durationMin, 0);
}

/** Milestone definitions and their unlock status based on session data */
export interface MilestoneItem {
    id: string;
    title: string;
    icon: string;
    unlocked: boolean;
}

export function getMilestones(sessions: SessionRecord[]): MilestoneItem[] {
    const totalSessions = sessions.length;
    const totalMin = getTotalMinutes(sessions);
    const bestStreak = getBestStreak(sessions);
    const hasNightSession = sessions.some((s) => {
        const h = new Date(s.completedAt).getHours();
        return h >= 22 || h < 5;
    });

    return [
        { id: '1', title: 'First Session', icon: 'leaf', unlocked: totalSessions >= 1 },
        { id: '2', title: '7 Day Streak', icon: 'flame', unlocked: bestStreak >= 7 },
        { id: '3', title: '1 Hour Total', icon: 'time', unlocked: totalMin >= 60 },
        { id: '4', title: '30 Sessions', icon: 'star', unlocked: totalSessions >= 30 },
        { id: '5', title: 'Night Owl', icon: 'moon', unlocked: hasNightSession },
        { id: '6', title: 'Zen Master', icon: 'diamond', unlocked: totalSessions >= 100 },
    ];
}
