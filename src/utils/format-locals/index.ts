import i18n from "../../context/language";

const LOCALE_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  guj: "gu-IN",
};

const DIGIT_MAP: Record<string, string[]> = {
  hi: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  mr: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  bn: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
  ta: ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"],
  te: ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"],
  kn: ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"],
  guj: ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"],
};

const SUFFIX_MAP: Record<string, { cr: string; l: string; k: string }> = {
  en: { cr: "Cr", l: "L", k: "K" },
  hi: { cr: "करोड़", l: "लाख", k: "हज़ार" },
  bn: { cr: "কোটি", l: "লক্ষ", k: "হাজার" },
  mr: { cr: "कोटी", l: "लाख", k: "हजार" },
  ta: { cr: "கோடி", l: "லட்சம்", k: "ஆயிரம்" },
  te: { cr: "కోట్లు", l: "లక్షలు", k: "వేలు" },
  kn: { cr: "ಕೋಟಿ", l: "ಲಕ್ಷ", k: "ಸಾವಿರ" },
  guj: { cr: "કરોડ", l: "લાખ", k: "હજાર" },
};

export function getLocale(): string {
  return LOCALE_MAP[i18n.language] || "en-IN";
}

function convertDigits(str: string): string {
  const digits = DIGIT_MAP[i18n.language];
  if (!digits) return str;
  return str.replace(/[0-9]/g, (d) => digits[parseInt(d, 10)]);
}

function getSuffix(type: "cr" | "l" | "k"): string {
  const map = SUFFIX_MAP[i18n.language] || SUFFIX_MAP.en;
  return map[type];
}

export function formatCurrency(n: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return convertDigits(formatted);
}

export function formatCurrencyCompact(n: number): string {
  const hasDecimals = n % 1 !== 0;
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(n);
  return convertDigits(formatted);
}

export function formatNumber(n: number): string {
  const formatted = new Intl.NumberFormat("en-IN").format(n);
  return convertDigits(formatted);
}

export function localizeDigits(str: string): string {
  return convertDigits(str);
}

export function formatInputNumber(raw: string): string {
  if (!raw) return "";
  const parts = raw.split(".");
  const intPart = parts[0].replace(/\D/g, "");
  if (!intPart) return raw;
  const num = parseInt(intPart, 10);
  const formatted = new Intl.NumberFormat("en-IN").format(num);
  let result = formatted;
  if (parts.length > 1) result += "." + parts[1];
  else if (raw.endsWith(".")) result += ".";
  return convertDigits(result);
}

export function parseLocalizedInput(text: string): string {
  const digits = DIGIT_MAP[i18n.language];
  if (digits) {
    text = text.replace(new RegExp(`[${digits.join("")}]`, "g"), (ch) => {
      const idx = digits.indexOf(ch);
      return idx >= 0 ? String(idx) : ch;
    });
  }
  return text.replace(/[^\d.]/g, "");
}

export function sanitizeAmountInput(raw: string): string | null {
  if (!raw) return "";
  if (raw.length === 1 && (raw[0] === "0" || raw[0] === ".")) return "MIN_ERROR";
  if (raw[0] === "0" || raw[0] === ".") return null;
  if (!/^\d*\.?\d{0,2}$/.test(raw)) return null;
  const parts = raw.split(".");
  if (parts[0].length > 10) return null;
  return raw;
}

export function formatAmountWithWords(n: number): string {
  const suffixes = SUFFIX_MAP[i18n.language] || SUFFIX_MAP.en;
  const formatted = new Intl.NumberFormat("en-IN").format(n);
  let word = "";
  if (n >= 10000000) word = `${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)} ${suffixes.cr}`;
  else if (n >= 100000) word = `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} ${suffixes.l}`;
  else if (n >= 1000) word = `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)} ${suffixes.k}`;
  return word ? `${formatted} (${word})` : formatted;
}

export function formatCompactCurrency(n: number): string {
  let formatted: string;
  if (n >= 10000000) {
    formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n / 10000000) + " " + getSuffix("cr");
  } else if (n >= 100000) {
    formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n / 100000) + " " + getSuffix("l");
  } else if (n >= 1000) {
    formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n / 1000) + " " + getSuffix("k");
  } else {
    formatted = new Intl.NumberFormat("en-IN").format(n);
  }
  return convertDigits(formatted);
}

export function formatCompactValue(n: number): string {
  const abs = Math.abs(n);
  let formatted: string;
  if (abs >= 10000000) {
    formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n / 10000000) + " " + getSuffix("cr");
  } else if (abs >= 100000) {
    formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n / 100000) + " " + getSuffix("l");
  } else if (abs >= 1000) {
    formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n / 1000) + " " + getSuffix("k");
  } else {
    formatted = new Intl.NumberFormat("en-IN").format(n);
  }
  return convertDigits(formatted);
}

/** ISO date string -> "14 Mar 1992" (en-IN locale) */
export function formatDob(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Address object -> single comma-separated string */
export function formatAddress(a: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}): string {
  return [a.line1, a.line2, `${a.city}, ${a.state} ${a.pincode}`].filter(Boolean).join(", ");
}

/** Mask Aadhaar — show only last 4 digits */
export function maskAadhaar(last4: string): string {
  return `XXXX XXXX ${last4}`;
}

/** Mask an email: "rahul@gmail.com" -> "r***@gmail.com" */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const first = local[0] ?? "";
  return `${first}${"*".repeat(Math.max(local.length - 1, 2))}@${domain}`;
}

/** Mask a mobile: "+919833011267" -> "+91 98****1267" */
export function maskMobile(mobile: string): string {
  const digits = mobile.replace(/\s+/g, "");
  if (digits.length < 6) return mobile;
  const start = digits.slice(0, digits.length - 8 > 0 ? digits.length - 8 : 2);
  const last4 = digits.slice(-4);
  return `${start}${"*".repeat(4)}${last4}`;
}

/** "Rahul Goswami" -> "RG" */
export function getPersonInitials(name: string): string {
  return (
    name.trim().split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?"
  );
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate().toString().padStart(2, "0");
  const mon = months[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return convertDigits(`${day} ${mon}, ${year} | ${hours}:${mins}${ampm}`);
}

export function formatMonthShort(monthIndex: number): string {
  const locale = getLocale();
  try {
    const d = new Date(2024, monthIndex, 1);
    return d.toLocaleDateString(locale, { month: "short" });
  } catch {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthIndex];
  }
}

export function formatDaysText(days: number, t: (key: string, opts?: any) => string): string {
  return convertDigits(String(days)) + " " + t("common.days");
}

/* ------------------------------------------------------------------ */
/* Spend formatting helpers (used by Track Spend and others)          */
/* ------------------------------------------------------------------ */

const FALLBACK_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Localized short month names, read from the active locale. */
export function getMonthsShort(): string[] {
  const months = i18n.t("common.months", { returnObjects: true }) as unknown;
  return Array.isArray(months) && months.length === 12 ? (months as string[]) : FALLBACK_MONTHS;
}

/** 428650 -> "₹4,28,650" (Indian digit grouping, localized digits). */
export function formatINR(n: number): string {
  const digits = Math.round(Math.abs(n)).toString();
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}` : last3;
  return `${n < 0 ? "-" : ""}₹${convertDigits(grouped)}`;
}

/** 570000 -> "₹5.7L", 428650 -> "₹4.29L", 25000 -> "₹25,000" */
export function formatLakh(n: number): string {
  if (Math.abs(n) < 100_000) return formatINR(n);
  const lakhs = Math.round((n / 100_000) * 100) / 100;
  return `₹${convertDigits(String(lakhs))}L`;
}

const DAY_MS = 86_400_000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Whole days between today and an ISO date (negative = in the past). */
export function daysUntil(iso: string): number {
  return Math.round((startOfDay(new Date(iso)) - startOfDay(new Date())) / DAY_MS);
}

/** ISO date -> "5 Sep" using localized month names + digits. */
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${convertDigits(String(d.getDate()))} ${getMonthsShort()[d.getMonth()]}`;
}

/** "Kapoor Foods" -> "KF" */
export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
