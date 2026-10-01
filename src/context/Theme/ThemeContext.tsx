import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemePreference = "light" | "dark" | "system";

export type ThemeColors = {
  primary: string;
  primaryDark: string;
  accent: string;
  accentAlt: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  text: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;
  success: string;
  warning: string;
  danger: string;
  error: string;
  info: string;
  successSoft: string;
  warningSoft: string;
  dangerSoft: string;
  infoSoft: string;
  disabled: string;
  placeholder: string;
  overlay: string;
  icon: string;
  iconSecondary: string;
  tabBar: string;
  tabBarBorder: string;
};

const THEME_PREF_KEY = "finora_theme_preference";

export const LightColors: ThemeColors = {
  primary: "#FF5A36",
  primaryDark: "#E84727",
  accent: "#FF6B45",
  accentAlt: "#FF8A6D",
  background: "#F7F7F5",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  card: "#FFFFFF",
  text: "#111214",
  textPrimary: "#111214",
  textSecondary: "#686B72",
  textMuted: "#9699A0",
  border: "#E6E7E9",
  divider: "#ECEDEF",
  success: "#16A477",
  warning: "#E99A24",
  danger: "#E5484D",
  error: "#E5484D",
  info: "#3787D8",
  successSoft: "#E9F8F3",
  warningSoft: "#FFF5E3",
  dangerSoft: "#FDEBEC",
  infoSoft: "#EAF3FC",
  disabled: "#D8D9DC",
  placeholder: "#A4A6AC",
  overlay: "rgba(17, 18, 20, 0.45)",
  icon: "#111214",
  iconSecondary: "#73767D",
  tabBar: "#F7F7F5",
  tabBarBorder: "#E6E7E9",
};

export const DarkColors: ThemeColors = {
  primary: "#FF6B45",
  primaryDark: "#FF805F",
  accent: "#FF7855",
  accentAlt: "#FF967A",
  background: "#090A0C",
  surface: "#111316",
  surfaceElevated: "#181B20",
  card: "#15181C",
  text: "#F7F7F5",
  textPrimary: "#F7F7F5",
  textSecondary: "#A5A9B1",
  textMuted: "#72767E",
  border: "#292D33",
  divider: "#202328",
  success: "#25C997",
  warning: "#F5B544",
  danger: "#FF6B70",
  error: "#FF6B70",
  info: "#55A5F5",
  successSoft: "#102C24",
  warningSoft: "#302516",
  dangerSoft: "#32181A",
  infoSoft: "#15283B",
  disabled: "#35383E",
  placeholder: "#666A72",
  overlay: "rgba(0, 0, 0, 0.65)",
  icon: "#F7F7F5",
  iconSecondary: "#A5A9B1",
  tabBar: "#090A0C",
  tabBarBorder: "#292D33",
};

type ThemeContextType = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  resolved: "light" | "dark";
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  // RN's hook subscribes to OS scheme changes and re-renders reliably — no
  // manual Appearance listener, no transient-null flash on reload.
  const systemScheme = useColorScheme();

  // Rehydrate the persisted preference on mount.
  useEffect(() => {
    AsyncStorage.getItem(THEME_PREF_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
        }
      })
      .catch((e) => console.warn("Failed to load theme preference:", e));
  }, []);

  const setPreference = async (next: ThemePreference) => {
    setPreferenceState(next);
    try {
      await AsyncStorage.setItem(THEME_PREF_KEY, next);
    } catch (e) {
      console.warn("Failed to save theme preference:", e);
    }
  };

  const resolved: "light" | "dark" =
    preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;
  const colors = resolved === "dark" ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ preference, setPreference, resolved, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};
