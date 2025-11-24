import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import Colors from "../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";

import {
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
  DashboardScreen,
  ReportScreen,
  ScanScreen,
  ProfileScreen,
  PersonalInformationScreen,
  ExpertBookingScreen,
  DietPlanScreen,
  StressHistoryScreen,
  HelpSupportScreen,
  PrivacyPolicyScreen,
  TermsConditionsScreen,
  AllProductsScreen,
  WeeklyScanScreen,
  RemindersScreen,
} from "../screens";
import { RootStackParamList } from "../types/navigation";
import { useAuthStore } from "../store/AuthStore";

/* ---------------------- STACKS ---------------------- */
const AuthStack = createNativeStackNavigator<RootStackParamList>();
const DashboardStack = createNativeStackNavigator<RootStackParamList>();
const ReportStack = createNativeStackNavigator<RootStackParamList>();
const ScanStack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<RootStackParamList>();

/* ---------------------- AUTH STACK ---------------------- */
const AuthStackNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{ headerShown: false }}
  >
    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} />
    <AuthStack.Screen name="DashboardScreen" component={DashboardScreen} />
    <AuthStack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
    />
  </AuthStack.Navigator>
);

/* ---------------------- DASHBOARD STACK ---------------------- */
const DashboardStackNavigator = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen name="DashboardScreen" component={DashboardScreen} />
    <DashboardStack.Screen name="ExpertBooking" component={ExpertBookingScreen} />
    <DashboardStack.Screen name="DietPlan" component={DietPlanScreen} />
    <DashboardStack.Screen name="StressHistory" component={StressHistoryScreen} />
  </DashboardStack.Navigator>
);

/* ---------------------- REPORT STACK ---------------------- */
const ReportStackNavigator = () => (
  <ReportStack.Navigator screenOptions={{ headerShown: false }}>
    <ReportStack.Screen name="ReportScreen" component={ReportScreen} />
    <ReportStack.Screen name="AllProducts" component={AllProductsScreen} />
    <ReportStack.Screen name="WeeklyScan" component={WeeklyScanScreen} />
    <ReportStack.Screen name="Reminders" component={RemindersScreen} />
  </ReportStack.Navigator>
);

/* ---------------------- SCAN STACK ---------------------- */
const ScanStackNavigator = () => (
  <ScanStack.Navigator screenOptions={{ headerShown: false }}>
    <ScanStack.Screen name="ScanScreen" component={ScanScreen} />
  </ScanStack.Navigator>
);

/* ---------------------- PROFILE STACK ---------------------- */
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    <ProfileStack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
    <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
    <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    <ProfileStack.Screen name="TermsConditions" component={TermsConditionsScreen} />
  </ProfileStack.Navigator>
);

/* ---------------------- BOTTOM TABS ---------------------- */
const BottomTabs = createBottomTabNavigator();

const tabStyles = StyleSheet.create({
  tabBar: {
    height: 70,
    backgroundColor: Colors.WhiteColor,
    borderTopWidth: 0,
    paddingBottom: 6,
    paddingHorizontal: 10,
    elevation: 6,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    marginTop: 2,
  },
  item: {
    borderRadius: 16,
    marginHorizontal: 6,
    marginVertical: 5,
    overflow: "hidden",
  },
});

const BottomTabNavigator = () => (
  <BottomTabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: Colors.WhiteColor,
      tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
      tabBarStyle: {
        ...tabStyles.tabBar,
        backgroundColor: "transparent",
        borderTopWidth: 0,
        elevation: 0,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      },
      tabBarBackground: () => (
        <LinearGradient
          colors={[Colors.GradientOrangeStart, Colors.GradientOrangeEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ),
      tabBarLabelStyle: tabStyles.label,
      tabBarActiveBackgroundColor: "rgba(255, 255, 255, 0.2)",
      tabBarItemStyle: tabStyles.item,
      tabBarIcon: ({ color }) => {
        const iconSize = 24;
        switch (route.name) {
          case "Home":
            return <Feather name="home" size={iconSize} color={color} />;
          case "Scan":
            return (
              <Ionicons name="scan-outline" size={iconSize} color={color} />
            );
          case "Report":
            return (
              <Ionicons
                name="document-text-outline"
                size={iconSize}
                color={color}
              />
            );
          case "Profile":
            return (
              <Ionicons name="person-outline" size={iconSize} color={color} />
            );
          default:
            return null;
        }
      },
    })}
  >
    <BottomTabs.Screen name="Home" component={DashboardStackNavigator} />
    <BottomTabs.Screen name="Scan" component={ScanStackNavigator} />
    <BottomTabs.Screen name="Report" component={ReportStackNavigator} />
    <BottomTabs.Screen name="Profile" component={ProfileStackNavigator} />
  </BottomTabs.Navigator>
);

/* ---------------------- ROOT NAVIGATION ---------------------- */
const AppNavigator: React.FC = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      NavigationBar.setVisibilityAsync("hidden");
      // NavigationBar.setBehaviorAsync("overlay-swipe"); // Not supported with edge-to-edge
    } else {
      NavigationBar.setVisibilityAsync("visible");
    }
  }, [user]);

  return (
    <>
      <StatusBar style="dark" animated />
      {user ? <BottomTabNavigator /> : <AuthStackNavigator />}
    </>
  );
};

export default AppNavigator;
