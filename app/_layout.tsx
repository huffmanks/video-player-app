import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster, toast } from "sonner-native";
import { useShallow } from "zustand/react/shallow";

import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { DARK_THEME, LIGHT_THEME, NAV_THEME } from "@/lib/constants";
import { migrateDatabase } from "@/lib/migrate-database";
import { useAppStore, useSecurityStore, useSettingsStore } from "@/lib/store";
import { LockScreenProvider } from "@/providers/lock-screen-provider";

import { RouteTracker } from "@/components/route-tracker";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();

  const { isAppStartUp, isAppReady, setIsAppStartUp, setIsAppReady } = useAppStore(
    useShallow((state) => ({
      isAppStartUp: state.isAppStartUp,
      isAppReady: state.isAppReady,
      setIsAppStartUp: state.setIsAppStartUp,
      setIsAppReady: state.setIsAppReady,
    }))
  );
  const { theme, setTheme } = useSettingsStore(
    useShallow((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
    }))
  );
  const { isLockable, setEnablePasscode, setIsLocked } = useSecurityStore(
    useShallow((state) => ({
      isLockable: state.isLockable,
      setEnablePasscode: state.setEnablePasscode,
      setIsLocked: state.setIsLocked,
    }))
  );

  useEffect(() => {
    async function initializeApp() {
      try {
        if (!isAppStartUp) {
          await migrateDatabase();
          setIsAppStartUp(true);
        }

        if (!isAppReady) {
          if (isLockable) {
            setIsLocked(true);
          } else {
            setEnablePasscode(false);
            setIsLocked(false);
          }
        }
      } catch (error) {
        toast.error("Initializing app failed.");
      } finally {
        setIsAppReady(true);
      }
    }
    initializeApp();
  }, []);

  useEffect(() => {
    const navColorScheme = theme || colorScheme;

    setAndroidNavigationBar(navColorScheme);
    setTheme(navColorScheme);

    if (theme !== colorScheme) setColorScheme(navColorScheme);
  }, [colorScheme, theme]);

  if (!isAppReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RouteTracker />
      <ThemeProvider value={!isDarkColorScheme ? LIGHT_THEME : DARK_THEME}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <LockScreenProvider>
              <Stack
                screenOptions={{
                  statusBarStyle: isDarkColorScheme ? "light" : "dark",
                  statusBarAnimation: "fade",
                  statusBarBackgroundColor: NAV_THEME[colorScheme].background,
                  statusBarHidden: false,
                }}>
                <Stack.Screen
                  name="(screens)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false }}
                />
              </Stack>
            </LockScreenProvider>
          </BottomSheetModalProvider>
          <Toaster
            theme={colorScheme}
            richColors
            position="bottom-center"
            offset={70}
          />
          <PortalHost />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
