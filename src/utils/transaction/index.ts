import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ThemeColors } from "@context/Theme/ThemeContext";
import type { TxnKind, TxnStatus } from "@data-types/transaction-history/constants";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

/** Icon shown in the leading circle for each transaction kind. */
const KIND_ICON: Record<TxnKind, IconName> = {
  drawdown: "file-document-outline",
  repayment: "cash-refund",
  emi: "shield-outline",
  fee: "receipt",
  interest: "percent-outline",
  charge: "alert-circle-outline",
};

export function kindIcon(kind: TxnKind): IconName {
  return KIND_ICON[kind];
}

/** Foreground + soft-background colour pair for a transaction's leading icon. */
export type TonePair = { fg: string; bg: string };

/** Adds low-opacity alpha to a hex colour for use as a soft tint. */
const soft = (hex: string, alpha = "22") => `${hex}${alpha}`;

/** Resolves a theme-driven colour pair for each transaction kind's icon. */
export function kindColors(kind: TxnKind, colors: ThemeColors): TonePair {
  switch (kind) {
    case "drawdown":
      return { fg: colors.accent, bg: soft(colors.accent) };
    case "repayment":
      return { fg: colors.success, bg: colors.successSoft };
    case "emi":
      return { fg: colors.danger, bg: colors.dangerSoft };
    case "fee":
      return { fg: colors.info, bg: colors.infoSoft };
    case "interest":
      return { fg: colors.warning, bg: colors.warningSoft };
    case "charge":
    default:
      return { fg: colors.textSecondary, bg: soft(colors.textSecondary, "1A") };
  }
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/**
 * Day label for a grouped statement header. `t` resolves "Today"/"Yesterday";
 * older days fall back to "Nov 4, 2026".
 */
export function dayGroupLabel(isoDay: string, t: (key: string) => string): string {
  const [y, m, d] = isoDay.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000);
  if (diffDays <= 0) return t("transaction_history.today");
  if (diffDays === 1) return t("transaction_history.yesterday");
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** "18 Sep · 02:15 PM" style timestamp for a transaction row. */
export function rowTimestamp(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${String(h).padStart(2, "0")}:${min} ${ampm}`;
}

/**
 * Masks a "Bank Account • 5021" style string into "xxxx-xxxx-5021",
 * keeping only the last group of digits visible.
 */
export function maskAccount(value: string): string {
  const last4 = (value.match(/(\d{3,})\s*$/)?.[1] ?? value).slice(-4);
  return `xxxx-xxxx-${last4}`;
}

/** Foreground + background colour pair for a status pill. */
export function statusColors(status: TxnStatus, colors: ThemeColors): TonePair {
  switch (status) {
    case "credited":
      return { fg: colors.success, bg: colors.successSoft };
    case "pending":
      return { fg: colors.warning, bg: colors.warningSoft };
    case "debited":
    case "failed":
    default:
      return { fg: colors.danger, bg: colors.dangerSoft };
  }
}
