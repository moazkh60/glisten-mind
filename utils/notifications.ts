/**
 * Daily notification scheduling for Glisten Mind.
 * Sends time-appropriate, rotating mindfulness reminders.
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

const AFTERNOON_MESSAGES = [
    { title: 'Midday Reset 🔄', body: 'Feeling the afternoon slump? Box breathing can help.' },
    { title: 'Pause & Breathe 💫', body: 'Even 3 minutes of focused breathing resets your energy.' },
    { title: 'Afternoon Balance ⚖️', body: 'Your body is asking for a moment of stillness.' },
    { title: 'Quick Recharge ⚡', body: 'Step away for a breath session — you\'ll thank yourself.' },
    { title: 'Mind Check 🧠', body: 'A short breathing session now can transform your afternoon.' },
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

function getMessagesForHour(hour: number) {
    if (hour >= 5 && hour < 12) return MORNING_MESSAGES;
    if (hour >= 12 && hour < 17) return AFTERNOON_MESSAGES;
    if (hour >= 17 && hour < 21) return EVENING_MESSAGES;
    return NIGHT_MESSAGES;
}

/** Pick a pseudo-random message for a given day + hour combo */
function pickMessage(hour: number, dayOfYear: number) {
    const messages = getMessagesForHour(hour);
    const index = dayOfYear % messages.length;
    return messages[index];
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
 * Schedule 3 daily notifications at strategic times:
 * - 8:30 AM  (morning)
 * - 1:00 PM  (afternoon)
 * - 8:30 PM  (evening)
 *
 * Messages rotate daily using day-of-year as a seed.
 */
export async function scheduleDailyNotifications(): Promise<void> {
    // Cancel all existing scheduled notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    const scheduleHours = [
        { hour: 8, minute: 30 },   // morning
        { hour: 13, minute: 0 },   // afternoon
        { hour: 20, minute: 30 },  // evening
    ];

    // Get day of year for rotation
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    for (const { hour, minute } of scheduleHours) {
        const { title, body } = pickMessage(hour, dayOfYear);

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: Platform.OS === 'ios' ? 'default' : undefined,
                data: { screen: 'exercises' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour,
                minute,
            },
        });
    }
}

/** Full setup: configure, request permissions, schedule */
export async function initializeNotifications(): Promise<void> {
    configureNotifications();
    const granted = await requestNotificationPermissions();
    if (granted) {
        await scheduleDailyNotifications();
    }
}
