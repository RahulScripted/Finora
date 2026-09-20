import type { View } from "react-native";

export type TourRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TourPlacement = "top" | "bottom" | "auto" | "center";
export type TourStep = {
  target?: string;
  title: string;
  content: string;
  placement?: TourPlacement;
  padding?: number;
  sliceCount?: number;
  sliceIndex?: number;
};

export type TourProps = {
  steps: TourStep[];
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  index?: number;
  onIndexChange?: (index: number) => void;
  onFinish?: () => void;
  onSkip?: () => void;
  showProgress?: boolean;
  rects?: Record<string, TourRect | null | undefined>;
};

export type UseTourReturn = {
  open: boolean;
  setOpen: (open: boolean) => void;
  index: number;
  setIndex: (index: number) => void;
  start: () => void;
  markSeen: () => Promise<void>;
  reset: () => Promise<void>;
  hasSeen: boolean;
  seenLoaded: boolean;
};

export type UseTourTargetsReturn<K extends string> = {
  register: (key: K) => (node: View | null) => void;
  rects: Record<string, TourRect | null>;
  measureAll: () => void;
  measureOne: (key: K) => void;
};
