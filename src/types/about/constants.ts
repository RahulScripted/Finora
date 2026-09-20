export const COMPANY_NAME = "Finora Pvt. Ltd.";
export const COMPANY_FOUNDED = "2024";
export const COMPANY_WEBSITE = "finora.example";
export const COMPANY_WEBSITE_URL = "https://finora.example";

export const OFFICE_ADDRESS =
  "Ground Floor, Dreams Mall, LBS Marg, Bhandup West, Mumbai, Maharashtra 400078, India";
export const OFFICE_COORDS = { latitude: 19.144, longitude: 72.939 };
export const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Dreams+Mall+Bhandup+West+Mumbai+400078";

export const GRIEVANCE_OFFICER = "Grievance Officer";
export const GRIEVANCE_EMAIL = "grievance@finora.example";

export type SocialLink = { name: string; icon: string; color: string };

/** Social icons are shown but intentionally not linked yet. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { name: "linkedin", icon: "linkedin", color: "#0A66C2" },
  { name: "instagram", icon: "instagram", color: "#E4405F" },
  { name: "facebook", icon: "facebook", color: "#1877F2" },
  { name: "x", icon: "alpha-x", color: "#111111" },
] as const;

export type AboutLegalRow = { key: string; route: string; action: string };

export const LEGAL_ROWS: readonly AboutLegalRow[] = [
  { key: "privacy_policy", route: "privacy-policy", action: "view_policy" },
  { key: "terms_conditions", route: "terms-conditions", action: "view_terms" },
  { key: "refund_policy", route: "refund-cancellation", action: "view_policy" },
] as const;
