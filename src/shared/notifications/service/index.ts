import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { playNotification } from "@helpers/sounds";
import { setupNotificationChannels } from "../config";
import type { NotificationChannel, NotificationItem, NotificationPreferences, PushPayload } from "@data-types/notifications";

const PREFS_KEY = "finora_notification_prefs";
const INBOX_KEY = "finora_notification_inbox";
const PUSH_TOKEN_KEY = "finora_push_token";

const DEFAULT_PREFS: NotificationPreferences = {
  transactions: true,
  emi_reminders: true,
  promotional: false,
};

/** True when running in Expo Go (SDK 53+ removed push from Expo Go). */
function isExpoGo(): boolean {
  return (
    Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === "storeClient"
  );
}

/**
 * Returns the expo-notifications module only in dev/prod builds.
 * Expo Go SDK 53+ throws on require, so we guard before calling require.
 */
function getNotificationsModule() {
  if (isExpoGo()) return null;
  try { return require("expo-notifications"); } catch { return null; }
}

// ─── Init ────────────────────────────────────────────────────────────────────

export async function initNotifications(): Promise<string | null> {
  await setupNotificationChannels();
  const Notifications = getNotificationsModule();
  if (!Notifications) return null;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return null;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) return null;
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    return token;
  } catch { return null; }
}

export async function getPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export async function getPreferences(): Promise<NotificationPreferences> {
  const stored = await AsyncStorage.getItem(PREFS_KEY);
  return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS;
}

export async function savePreferences(prefs: NotificationPreferences): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export async function updatePreference(channel: NotificationChannel, enabled: boolean): Promise<void> {
  const prefs = await getPreferences();
  prefs[channel] = enabled;
  await savePreferences(prefs);
}

// ─── Inbox ───────────────────────────────────────────────────────────────────

export async function getInbox(): Promise<NotificationItem[]> {
  const stored = await AsyncStorage.getItem(INBOX_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function addToInbox(item: NotificationItem): Promise<void> {
  const inbox = await getInbox();
  inbox.unshift(item);
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(inbox.slice(0, 100)));
}

export async function markAsRead(id: string): Promise<void> {
  const inbox = await getInbox();
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(inbox.map(n => n.id === id ? { ...n, read: true } : n)));
}

export async function markAllAsRead(): Promise<void> {
  const inbox = await getInbox();
  await AsyncStorage.setItem(INBOX_KEY, JSON.stringify(inbox.map(n => ({ ...n, read: true }))));
}

export async function getUnreadCount(): Promise<number> {
  return (await getInbox()).filter(n => !n.read).length;
}

// ─── Fire ────────────────────────────────────────────────────────────────────

export async function fireNotification(payload: PushPayload): Promise<string | null> {
  await addToInbox({ ...payload, read: false });
  playNotification();
  const Notifications = getNotificationsModule();
  if (!Notifications) return null;
  const prefs = await getPreferences();
  if (!prefs[payload.channel]) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        sound: payload.channel !== "promotional" ? "default" : undefined,
        priority: payload.priority === "high" ? "high" : "default",
        data: { ...payload.data, channel: payload.channel, type: payload.type },
        ...(Platform.OS === "android" && { channelId: payload.channel }),
      },
      trigger: null,
    });
  } catch { return null; }
}

// ─── Badge / Cancel ──────────────────────────────────────────────────────────

export async function clearBadge(): Promise<void> {
  const Notifications = getNotificationsModule();
  if (Notifications) await Notifications.setBadgeCountAsync(0);
}

export async function cancelAllNotifications(): Promise<void> {
  const Notifications = getNotificationsModule();
  if (Notifications) await Notifications.cancelAllScheduledNotificationsAsync();
}
