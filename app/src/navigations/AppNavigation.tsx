import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import {
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
  DashboardScreen,
  ReportScreen,
  ScanScreen,
  ProfileScreen,
} from "../screens";
import { RootStackParamList } from "../types/navigation";

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
  </DashboardStack.Navigator>
);

/* ---------------------- REPORT STACK ---------------------- */
const ReportStackNavigator = () => (
  <ReportStack.Navigator screenOptions={{ headerShown: false }}>
    <ReportStack.Screen name="ReportScreen" component={ReportScreen} />
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
  </ProfileStack.Navigator>
);

/* ---------------------- COLORS ---------------------- */
const COLORS = {
  tabActiveBg: "#fd6060ff",
  tabInactive: "#fcdcdcff",
  tabBg: "#ff8d8dff",
  white: "#ffffffff",
};

/* ---------------------- BOTTOM TABS ---------------------- */
const BottomTabs = createBottomTabNavigator();

const tabStyles = StyleSheet.create({
  tabBar: {
    height: 70,
    backgroundColor: COLORS.tabBg,
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
      tabBarActiveTintColor: COLORS.white,
      tabBarInactiveTintColor: COLORS.tabInactive,
      tabBarStyle: tabStyles.tabBar,
      tabBarLabelStyle: tabStyles.label,
      tabBarActiveBackgroundColor: COLORS.tabActiveBg,
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
  const auth = false;

  useEffect(() => {
    if (auth) {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    } else {
      NavigationBar.setVisibilityAsync("visible");
    }
  }, [auth]);
  return (
    <>
      <StatusBar style="dark" animated />
      {auth ? <BottomTabNavigator /> : <AuthStackNavigator />}
    </>
  );
};

export default AppNavigator;
