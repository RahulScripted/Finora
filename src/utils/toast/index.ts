import Toast from "react-native-toast-message";

type ToastArgs = {
  title: string;
  message?: string;
  /** How long the toast is visible in ms. Defaults to 4000. */
  duration?: number;
};

/** App-wide toast helpers. Toast host is mounted in app/index.tsx. */
export const notify = {
  success: ({ title, message, duration = 4000 }: ToastArgs) =>
    Toast.show({ type: "success", text1: title, text2: message, visibilityTime: duration }),

  error: ({ title, message, duration = 4000 }: ToastArgs) =>
    Toast.show({ type: "error", text1: title, text2: message, visibilityTime: duration }),

  info: ({ title, message, duration = 4000 }: ToastArgs) =>
    Toast.show({ type: "info", text1: title, text2: message, visibilityTime: duration }),

  hide: () => Toast.hide(),
};
