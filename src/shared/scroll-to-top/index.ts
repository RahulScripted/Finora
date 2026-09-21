import { useFocusEffect } from "@react-navigation/native";
import { useCallback, type RefObject } from "react";
import { ScrollView } from "react-native";

/**
 * Scrolls the given ScrollView ref back to the top every time
 * the screen gains focus (navigation transition in, tab press, back nav).
 *
 * Usage:
 *   const scrollRef = useRef<ScrollView>(null);
 *   useScrollToTop(scrollRef);
 *   <ScrollView ref={scrollRef} ...>
 */
export function useScrollToTop(ref: RefObject<ScrollView | null>) {
  useFocusEffect(
    useCallback(() => {
      ref.current?.scrollTo({ y: 0, animated: false });
    }, [ref]),
  );
}
