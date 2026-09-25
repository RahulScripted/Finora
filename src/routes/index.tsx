import AnimatedTabBar from "@components/tab-bar/AnimatedTabBar";
import { useTheme } from "@context/Theme/ThemeContext";
import { useAppDispatch, useAppSelector } from "@store";
import { popRoute, pushRoute } from "@store/navSlice";
import { HomeIcon, InvoiceIcon, MoreIcon, OffersIcon, RepayIcon } from "@assets/svgs/TabIcons";
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigationContainerRef,
  type NavigationState,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useRef } from "react";
import { BackHandler } from "react-native";
import { useGlobalLoading } from "@context/Loading/GlobalLoadingContext";

import HomeScreen from "@screens/home";
import CreditScreen from "@/src/screens/offer";
import MoneyScreen from "@screens/money";
import InvoicesScreen from "@screens/invoices";
import MoreScreen from "@screens/more";
import ProfileScreen from "@screens/profile";
import PersonalScreen from "@screens/profile/personal";
import CoApplicantDetailScreen from "@screens/profile/personal/components/coapplicant";
import CompanyScreen from "@screens/profile/company";
import ProfileDocumentsScreen from "@screens/profile/documents";
import AboutAppScreen from "@screens/profile/about-app";
import RateUsScreen from "@screens/profile/rate-us";
import SettingsScreen from "@screens/profile/settings";
import QuickReviewScreen from "@screens/profile/quick-review";
import PrivacyPolicyScreen from "@screens/profile/privacy-policy";
import TermsConditionsScreen from "@screens/profile/terms-conditions";
import RefundCancellationScreen from "@screens/profile/refund-cancellation";
import NachCancellationScreen from "@screens/profile/nach-cancellation";
import NdcCertificateScreen from "@screens/profile/ndc-certificate";
import UpdateContactScreen from "@screens/profile/update-contact";
import TrackSpendScreen from "@screens/track-spend";
import CreditScoreScreen from "@screens/credit-score";
import PaymentHistoryScreen from "@screens/payment-history";
import BusinessPartnersScreen from "@screens/business-partners";
import BusinessPartnerDetailScreen from "@screens/business-partners/detail";
import SupportScreen from "@screens/profile/support";
import CreateTicketScreen from "@screens/profile/support/create-ticket";
import TrackTicketScreen from "@screens/profile/support/track-ticket";
import TicketDetailScreen from "@screens/profile/support/ticket-detail";

const Tab = createBottomTabNavigator();

const HIDDEN_TAB = {
  tabBarItemStyle: { display: "none" as const },
  unmountOnBlur: true,
};

export default function AppRoutes() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const navStack = useAppSelector((s) => s.nav.stack);
  const navigationRef = useNavigationContainerRef();
  const { showLoading, hideLoading } = useGlobalLoading();
  // Track the active route so we only fire on actual screen changes.
  const currentRouteRef = useRef<string | undefined>(undefined);

  const resolveTabRoute = useCallback(
    (routeName: string): string => {
      const state = navigationRef.getRootState();
      if (!state) return routeName;
      for (const route of state.routes) {
        if (route.name === routeName) return routeName;
        const nested = route.state;
        if (nested) {
          for (const nestedRoute of (nested.routes as any[])) {
            if (nestedRoute.name === routeName) return route.name;
          }
        }
      }
      return routeName;
    },
    [navigationRef],
  );

  // Hardware back — pop navSlice stack, navigate to previous, no infinite loops
  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!navigationRef.isReady()) return false;

      // Let nested stack handle its own back first
      const state = navigationRef.getRootState();
      const activeRoute = state?.routes[state.index];
      const nestedState = activeRoute?.state;
      if (nestedState && nestedState.index != null && nestedState.index > 0) {
        navigationRef.goBack();
        return true;
      }

      // At root — exit app
      if (navStack.length <= 1) return false;

      dispatch(popRoute());
      const previous = navStack[navStack.length - 2];
      const target = resolveTabRoute(previous || "home");
      navigationRef.navigate(target as never);
      return true;
    });
    return () => handler.remove();
  }, [navigationRef, navStack, resolveTabRoute, dispatch]);

  const getActiveRouteName = useCallback(
    (state: NavigationState | undefined): string | undefined => {
      if (!state) return undefined;
      const route = state.routes[state.index];
      if (route.state) return getActiveRouteName(route.state as NavigationState);
      return route.name;
    },
    [],
  );

  const onStateChange = useCallback(
    (state: NavigationState | undefined) => {
      if (!state) return;
      const current = getActiveRouteName(state);
      if (current) {
        dispatch(pushRoute(current));
        // Show the global loader briefly on each screen change.
        if (current !== currentRouteRef.current) {
          currentRouteRef.current = current;
          showLoading();
          setTimeout(hideLoading, 900);
        }
      }
    },
    [getActiveRouteName, dispatch, showLoading, hideLoading],
  );

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={onStateChange}
        onUnhandledAction={() => {
          if (navigationRef.isReady()) navigationRef.navigate("home" as never);
        }}
      >
        <Tab.Navigator
          initialRouteName="home"
          tabBar={(props) => <AnimatedTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textMuted,
            sceneStyle: { backgroundColor: colors.background },
          }}
        >
          {/* Visible tabs — Home · Invoices · Money · Offers · More */}
          <Tab.Screen
            name="home"
            component={HomeScreen}
            options={{ title: "Home", tabBarIcon: ({ color, size, focused }) => <HomeIcon size={size} color={color} filled={focused} /> }}
          />
          <Tab.Screen
            name="invoices"
            component={InvoicesScreen}
            options={{ title: "Invoices", tabBarIcon: ({ color, size, focused }) => <InvoiceIcon size={size} color={color} filled={focused} /> }}
          />
          <Tab.Screen
            name="money"
            component={MoneyScreen}
            options={{ title: "Money", tabBarIcon: ({ color, size, focused }) => <RepayIcon size={size} color={color} filled={focused} /> }}
          />
          <Tab.Screen
            name="credit"
            component={CreditScreen}
            options={{ title: "Offers", tabBarIcon: ({ color, size, focused }) => <OffersIcon size={size} color={color} filled={focused} /> }}
          />
          <Tab.Screen
            name="more"
            component={MoreScreen}
            options={{ title: "More", tabBarIcon: ({ color, size, focused }) => <MoreIcon size={size} color={color} filled={focused} /> }}
          />

          {/* Hidden screens — navigated to from More/Profile, not shown in tab bar */}
          <Tab.Screen name="profile" component={ProfileScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="personal" component={PersonalScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="co-applicant-detail" component={CoApplicantDetailScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="company" component={CompanyScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="documents" component={ProfileDocumentsScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="about-app" component={AboutAppScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="rate-us" component={RateUsScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="settings" component={SettingsScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="quick-review" component={QuickReviewScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="privacy-policy" component={PrivacyPolicyScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="terms-conditions" component={TermsConditionsScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="refund-cancellation" component={RefundCancellationScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="nach-cancellation" component={NachCancellationScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="ndc-certificate" component={NdcCertificateScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="update-contact" component={UpdateContactScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="track-spends" component={TrackSpendScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="credit-score" component={CreditScoreScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="payment-history" component={PaymentHistoryScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="business-partners" component={BusinessPartnersScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="business-partner-detail" component={BusinessPartnerDetailScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="help-support" component={SupportScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="support-create-ticket" component={CreateTicketScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="support-track-ticket" component={TrackTicketScreen} options={HIDDEN_TAB} />
          <Tab.Screen name="support-ticket-detail" component={TicketDetailScreen} options={HIDDEN_TAB} />
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
