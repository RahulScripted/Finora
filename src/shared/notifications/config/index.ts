import Constants from "expo-constants";
import { Platform } from "react-native";
import type { NotificationChannel } from "@data-types/notifications";

export const CHANNELS: Record<NotificationChannel, { name: string; importance: number; sound: boolean }> = {
  transactions: { name: "Transaction Alerts", importance: 4, sound: true },
  emi_reminders: { name: "EMI & Payment Reminders", importance: 4, sound: true },
  promotional: { name: "Offers & Updates", importance: 3, sound: false },
};

/**
 * Returns true when running inside Expo Go (SDK 53+).
 * expo-notifications remote push was removed from Expo Go in SDK 53 —
 * any require() of expo-notifications throws in that environment.
 */
function isExpoGo(): boolean {
  return (
    Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === "storeClient"
  );
}

export async function setupNotificationChannels() {
  // Android channels are only meaningful in real builds, not Expo Go.
  if (Platform.OS !== "android" || isExpoGo()) return;
  try {
    const Notifications = require("expo-notifications");
    for (const [id, cfg] of Object.entries(CHANNELS)) {
      await Notifications.setNotificationChannelAsync(id, {
        name: cfg.name,
        importance: cfg.importance,
        sound: cfg.sound ? "default" : undefined,
      });
    }
  } catch {}
}
