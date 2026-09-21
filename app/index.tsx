import { GlobalLoadingProvider } from "@context/Loading/GlobalLoadingContext";
import { ThemeProvider } from "@context/Theme/ThemeContext";
import { store } from "@store";
import AppRoutes from "../src/routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <GlobalLoadingProvider>
              <AppRoutes />
            </GlobalLoadingProvider>
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
