import { useFocusEffect } from "@react-navigation/native";
import { useCallback, type RefObject } from "react";
import type { FlatList, ScrollView } from "react-native";

type Scrollable =
  | ScrollView
  | (FlatList<any> & { scrollToOffset?: (o: { offset: number; animated?: boolean }) => void });

/**
 * Scrolls the given ScrollView / FlatList ref back to the top every time the
 * screen gains focus (navigation in, tab press, back nav). Works with both
 * ScrollView (`scrollTo`) and FlatList (`scrollToOffset`), and defers a couple
 * of frames so it fires after layout has settled.
 */
export function useScrollToTop(ref: RefObject<Scrollable | null>) {
  useFocusEffect(
    useCallback(() => {
      const toTop = () => {
        const node: any = ref.current;
        if (!node) return;
        if (typeof node.scrollToOffset === "function") {
          node.scrollToOffset({ offset: 0, animated: false });
        } else if (typeof node.scrollTo === "function") {
          node.scrollTo({ y: 0, animated: false });
        }
      };
      // Fire now and again after a frame so it lands once layout is ready.
      toTop();
      const id = setTimeout(toTop, 50);
      return () => clearTimeout(id);
    }, [ref]),
  );
}
