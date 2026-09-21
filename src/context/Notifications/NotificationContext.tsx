import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import Constants from "expo-constants";
import {
  clearBadge,
  getInbox,
  getPreferences,
  getUnreadCount,
  initNotifications,
  markAllAsRead,
  markAsRead,
  updatePreference,
  type NotificationChannel,
  type NotificationItem,
  type NotificationPreferences,
} from "@shared/notifications";

/** True when running in Expo Go (SDK 53+ removed push from Expo Go). */
function isExpoGo(): boolean {
  return (
    Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === "storeClient"
  );
}

type NotificationContextType = {
  prefs: NotificationPreferences;
  pushToken: string | null;
  inbox: NotificationItem[];
  unreadCount: number;
  toggleChannel: (channel: NotificationChannel, enabled: boolean) => Promise<void>;
  refreshInbox: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>({
  prefs: { transactions: true, emi_reminders: true, promotional: false },
  pushToken: null,
  inbox: [],
  unreadCount: 0,
  toggleChannel: async () => {},
  refreshInbox: async () => {},
  markRead: async () => {},
  markAllRead: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<NotificationPreferences>({ transactions: true, emi_reminders: true, promotional: false });
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [inbox, setInbox] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshInbox = useCallback(async () => {
    setInbox(await getInbox());
    setUnreadCount(await getUnreadCount());
  }, []);

  useEffect(() => {
    getPreferences().then(setPrefs);
    refreshInbox();
  }, []);

  useEffect(() => {
    // initNotifications is a no-op in Expo Go (guards internally).
    initNotifications().then(token => { if (token) setPushToken(token); });

    // Notification listener only works in dev/prod builds, not Expo Go.
    if (isExpoGo()) return;
    try {
      const Notifications = require("expo-notifications");
      const sub = Notifications.addNotificationReceivedListener(() => refreshInbox());
      clearBadge();
      return () => sub.remove();
    } catch { return undefined; }
  }, []);

  const toggleChannel = useCallback(async (channel: NotificationChannel, enabled: boolean) => {
    await updatePreference(channel, enabled);
    setPrefs(prev => ({ ...prev, [channel]: enabled }));
  }, []);

  const markRead = useCallback(async (id: string) => {
    await markAsRead(id);
    await refreshInbox();
  }, [refreshInbox]);

  const markAllRead = useCallback(async () => {
    await markAllAsRead();
    await refreshInbox();
  }, [refreshInbox]);

  return (
    <NotificationContext.Provider value={{ prefs, pushToken, inbox, unreadCount, toggleChannel, refreshInbox, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
