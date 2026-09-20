import type { TourRect, TourStep } from "@data-types/product-tour/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import { Platform, StatusBar, type View } from "react-native";

const Y_OFFSET = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;
type TourContextValue = {
  register: (key: string) => (node: View | null) => void;
  rects: Record<string, TourRect | null>;
  measureAll: () => void;
  measureOne: (key: string) => void;

  open: boolean;
  index: number;
  steps: TourStep[];
  setIndex: (i: number) => void;
  setOpen: (open: boolean) => void;
  startTour: (steps: TourStep[]) => void;
  finishTour: (storageKey?: string) => void;
};

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const refs = useRef<Record<string, View | null>>({});
  const [rects, setRects] = useState<Record<string, TourRect | null>>({});
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const register = useCallback(
    (key: string) => (node: View | null) => {
      if (node) refs.current[key] = node;
    },
    [],
  );

  const measureNode = useCallback(
    (node: View, done: (rect: TourRect | null) => void) => {
      const emit = (x: number, y: number, width: number, height: number) => {
        if (width > 0 && height > 0) done({ x, y, width, height });
        else done(null);
      };

      const viaWindow = () => {
        if (node.measureInWindow) {
          node.measureInWindow((mx, my, mw, mh) =>
            emit(mx, my + Y_OFFSET, mw, mh),
          );
        } else {
          done(null);
        }
      };

      if (node.measure) {
        node.measure((_x, _y, width, height, pageX, pageY) => {
          if (width > 0 && height > 0) emit(pageX, pageY, width, height);
          else viaWindow();
        });
        return;
      }

      viaWindow();
    },
    [],
  );

  const measureOne = useCallback(
    (key: string) => {
      const node = refs.current[key];
      if (!node) {
        setRects((prev) => ({ ...prev, [key]: null }));
        return;
      }
      measureNode(node, (rect) => {
        setRects((prev) => ({ ...prev, [key]: rect }));
      });
    },
    [measureNode],
  );

  const measureAll = useCallback(() => {
    const keys = Object.keys(refs.current);
    let pending = keys.length;
    if (pending === 0) return;
    const collected: Record<string, TourRect | null> = {};
    keys.forEach((key) => {
      const node = refs.current[key];
      if (!node) {
        collected[key] = null;
        pending -= 1;
        if (pending === 0) setRects((prev) => ({ ...prev, ...collected }));
        return;
      }
      measureNode(node, (rect) => {
        collected[key] = rect;
        pending -= 1;
        if (pending === 0) setRects((prev) => ({ ...prev, ...collected }));
      });
    });
  }, [measureNode]);

  const startTour = useCallback((next: TourStep[]) => {
    setSteps(next);
    setIndex(0);
    setOpen(true);
  }, []);

  const finishTour = useCallback((storageKey?: string) => {
    setOpen(false);
    setIndex(0);
    if (storageKey) {
      AsyncStorage.setItem(storageKey, "1").catch(() => {});
    }
  }, []);

  const value = useMemo(
    () => ({
      register,
      rects,
      measureAll,
      measureOne,
      open,
      index,
      steps,
      setIndex,
      setOpen,
      startTour,
      finishTour,
    }),
    [
      register,
      rects,
      measureAll,
      measureOne,
      open,
      index,
      steps,
      startTour,
      finishTour,
    ],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTourRegistry(): TourContextValue {
  const ctx = useContext(TourContext);
  if (ctx) return ctx;
  return {
    register: () => () => {},
    rects: {},
    measureAll: () => {},
    measureOne: () => {},
    open: false,
    index: 0,
    steps: [],
    setIndex: () => {},
    setOpen: () => {},
    startTour: () => {},
    finishTour: () => {},
  };
}
