import { captureScreen } from "react-native-view-shot";

/** Captures the whole screen as a JPG and returns its file URI (or null on failure). */
export async function captureScreenshot(): Promise<string | null> {
  try {
    const uri = await captureScreen({ format: "jpg", quality: 0.7 });
    return uri ?? null;
  } catch {
    return null;
  }
}
