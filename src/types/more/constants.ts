export type MoreMenuItem = {
  label: string;
  icon: string;
  color: string;
  route: string;
};

export const MORE_MENU: MoreMenuItem[] = [
  { label: "Business Partners", icon: "briefcase-account-outline", color: "#3B61FF", route: "business-partners" },
  { label: "Documents", icon: "folder-outline", color: "#588FB5", route: "documents" },
  { label: "Track Spends", icon: "chart-waterfall", color: "#FF9C01", route: "track-spends" },
  { label: "Support", icon: "headset", color: "#3B61FF", route: "help-support" },
  { label: "Rate Us", icon: "star-outline", color: "#E99A24", route: "rate-us" },
  { label: "About App", icon: "information-outline", color: "#588FB5", route: "about-app" },
  { label: "Quick Review", icon: "map-marker-path", color: "#FF5A36", route: "quick-review" },
  { label: "Settings", icon: "cog-outline", color: "#666BA5", route: "settings" },
];
