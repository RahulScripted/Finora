export type NotificationChannel = "transactions" | "emi_reminders" | "promotional";

export type NotificationType =
  | "TRANSACTION_SUCCESS"
  | "TRANSACTION_FAILED"
  | "EMI_REMINDER"
  | "LOAN_DISBURSED"
  | "REFUND_PROCESSED"
  | "PROMOTIONAL"
  | "DOWNLOAD_COMPLETE";

export type NotificationPriority = "high" | "default";

export type PushPayload = {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  data: Record<string, string>;
  priority: NotificationPriority;
  timestamp: string;
  screen?: string;
  params?: Record<string, string>;
};

export type NotificationItem = PushPayload & { read: boolean };

export type NotificationPreferences = {
  transactions: boolean;
  emi_reminders: boolean;
  promotional: boolean;
};
