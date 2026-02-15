/**
 * Daily notification scheduling for Glisten Mind.
 * Sends one time-appropriate, rotating mindfulness reminder per day.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ──────── Notification messages by time slot ────────

const MORNING_MESSAGES = [
    { title: 'Good Morning ☀️', body: 'Start your day with 5 minutes of coherent breathing.' },
    { title: 'Rise & Breathe 🌅', body: 'A calm morning sets the tone for the whole day.' },
    { title: 'Morning Check-in 🧘', body: 'Your nervous system is ready to find balance.' },
    { title: 'Begin with Clarity 🌿', body: 'A few deep breaths can sharpen your focus for hours.' },
    { title: 'Fresh Start 🌤️', body: 'Your vagus nerve responds best to morning breathwork.' },
];

const EVENING_MESSAGES = [
    { title: 'Evening Unwind 🌙', body: 'Let your vagus nerve guide you into calm tonight.' },
    { title: 'Wind Down Time 🌸', body: 'Extended exhales tell your body it\'s safe to relax.' },
    { title: 'Settle In 🛋️', body: 'A vagus calm session is the perfect evening ritual.' },
    { title: 'Release the Day 🍃', body: 'Your nervous system is ready to shift into rest mode.' },
    { title: 'Gentle Close 🌺', body: 'Tonight, let your breath carry away the day\'s tension.' },
];

const NIGHT_MESSAGES = [
    { title: 'Sleep Prep 😴', body: '4-7-8 breathing is your natural sleep aid — try it now.' },
    { title: 'Drift Off 🌊', body: 'A breathing session before bed deepens your sleep quality.' },
    { title: 'Deep Rest Awaits 💤', body: 'Slow your breath, slow your mind, welcome sleep.' },
    { title: 'Bedtime Ritual 🌙', body: 'Your body heals during deep sleep — breathwork helps you get there.' },
    { title: 'Nightly Calm 🔮', body: 'Let your last waking moments be ones of peace.' },
];

/** Pick one slot randomly based on the day of year */
function pickDailySlot(dayOfYear: number): { hour: number; minute: number; messages: typeof MORNING_MESSAGES } {
    const slots = [
        { hour: 8, minute: 30, messages: MORNING_MESSAGES },    // morning
        { hour: 19, minute: 0, messages: EVENING_MESSAGES },    // evening
        { hour: 21, minute: 30, messages: NIGHT_MESSAGES },     // night
    ];
    return slots[dayOfYear % slots.length];
}

// ──────── Setup and scheduling ────────

/** Configure notification handler */
export function configureNotifications() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

/** Request notification permissions */
export async function requestNotificationPermissions(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

/**
 * Schedule 1 daily notification.
 * The time slot (morning, evening, or night) rotates each day.
 * The message within that slot also rotates daily.
 */
export async function scheduleDailyNotification(): Promise<void> {
    // Cancel all existing scheduled notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Get day of year for rotation
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const { hour, minute, messages } = pickDailySlot(dayOfYear);
    const message = messages[dayOfYear % messages.length];

    // Calculate seconds until the target time today (or tomorrow if passed)
    const target = new Date(now);
    target.setHours(hour, minute, 0, 0);
    let secondsUntil = Math.floor((target.getTime() - now.getTime()) / 1000);
    if (secondsUntil <= 0) {
        secondsUntil += 86400; // push to tomorrow
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: message.title,
            body: message.body,
            sound: Platform.OS === 'ios' ? 'default' : undefined,
            data: { screen: 'exercises' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: secondsUntil,
            repeats: false, // we reschedule on each app launch anyway
        },
    });
}

/** Full setup: configure, request permissions, schedule */
export async function initializeNotifications(): Promise<void> {
    configureNotifications();
    const granted = await requestNotificationPermissions();
    if (granted) {
        await scheduleDailyNotification();
    }
}
