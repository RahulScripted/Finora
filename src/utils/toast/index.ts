import Toast from "react-native-toast-message";

type ToastArgs = { title: string; message?: string };

export const notify = {
  success: ({ title, message }: ToastArgs) => Toast.show({ type: "success", text1: title, text2: message }),
  error: ({ title, message }: ToastArgs) => Toast.show({ type: "error", text1: title, text2: message }),
  info: ({ title, message }: ToastArgs) => Toast.show({ type: "info", text1: title, text2: message }),
};
