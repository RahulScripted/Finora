import { GlobalLoadingProvider } from "@context/Loading/GlobalLoadingContext";
import { ThemeProvider } from "@context/Theme/ThemeContext";
import { NotificationProvider } from "@context/Notifications/NotificationContext";
import { ErrorReportProvider } from "@context/ErrorReport/ErrorReportContext";
import { store } from "@store";
import AppRoutes from "../src/routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import { toastConfig } from "../src/components/toast-config";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <GlobalLoadingProvider>
              <NotificationProvider>
                <ErrorReportProvider>
                  <AppRoutes />
                </ErrorReportProvider>
              </NotificationProvider>
            </GlobalLoadingProvider>
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
      <Toast config={toastConfig} topOffset={0} visibilityTime={4000} />
    </GestureHandlerRootView>
  );
}
