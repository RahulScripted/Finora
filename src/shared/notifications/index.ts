// Types live in @data-types/notifications — re-export for convenience.
export type {
  NotificationChannel,
  NotificationType,
  NotificationPreferences,
  NotificationItem,
  PushPayload,
} from "@data-types/notifications";

// Config
export { CHANNELS, setupNotificationChannels } from "./config";

// Template helpers — imported directly from sub-files, no intermediate barrel.
export { getDownloadNotification } from "./templates/download";
export { getDisbursalNotification } from "./templates/disbursal";
export { getRepaymentReminderNotification, getOverdueNotification, getRepaymentSuccessNotification } from "./templates/repayment";
export { getLimitUpdateNotification } from "./templates/limit";
export { getPromotionalNotification } from "./templates/promotional";

// Content router
import type { NotificationChannel } from "@data-types/notifications";
import { getDisbursalNotification as _disbursal } from "./templates/disbursal";
import { getOverdueNotification as _overdue, getRepaymentReminderNotification as _reminder, getRepaymentSuccessNotification as _repaySuccess } from "./templates/repayment";
import { getPromotionalNotification as _promo } from "./templates/promotional";

type Template = { title: string; body: string };

export function getNotificationContent(channel: NotificationChannel, data?: Record<string, string>): Template {
  switch (channel) {
    case "transactions":
      return data?.subtype === "repayment_success"
        ? _repaySuccess(data?.amount ?? "0")
        : _disbursal(data?.amount ?? "0", data?.reference);
    case "emi_reminders":
      return data?.subtype === "overdue"
        ? _overdue(data?.amount ?? "0")
        : _reminder(data?.amount ?? "0", data?.dueDate ?? "soon");
    case "promotional":
      return _promo();
  }
}

// Service functions
export {
  initNotifications,
  getPushToken,
  getPreferences,
  savePreferences,
  updatePreference,
  getInbox,
  addToInbox,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  fireNotification,
  clearBadge,
  cancelAllNotifications,
} from "./service";
