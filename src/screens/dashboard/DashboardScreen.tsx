import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { horizontalScale, ms, textScale } from "../../utils/SizeScalingUtility";
import { verticalScale } from "react-native-size-matters";
import Colors from "../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../store/AuthStore";
import drawable from "../../utils/drawable";
import { useNavigation } from "@react-navigation/native";
import { DietTipSection, ExpertSection, LatestSkinScanSection, StressLevelSection } from "./Sections";
import { Header, SafeScreen, Tabs } from "@/src/components";


function DashboardScreen() {
  const { user } = useAuthStore();
    const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Skin");

  const tabs = [
    { name: "Skin", icon: "happy-outline" },
    { name: "Stress", icon: "pulse-outline" },
    { name: "Diet", icon: "nutrition-outline" },
    { name: "Experts", icon: "medkit-outline" },
  ];

  const renderNotificationIcon = (
    <View style={styles.notificationButton}>
      <FontAwesome name="bell" size={20} color={Colors.textPrimary} />
      <View style={styles.badge} />
    </View>
  );

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading={`Hi ${user?.displayName?.split(" ")[0] || "User"} 👋`}
          subTitle="Ready to glow today?"
          avatarUri={user?.photoURL || drawable.reactLogo}
          rightIcon={renderNotificationIcon}
          onRightIconPress={() => {}}
          containerStyle={{ paddingHorizontal: 0 }}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {/* Skin Scan Card - Full Width */}
          <TouchableOpacity style={styles.fullWidthCardWrapper} onPress={() => {navigation.navigate("Scan")}}>
            <LinearGradient
              colors={[Colors.GradientOrangeStart, Colors.GradientOrangeEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="camera" size={24} color={Colors.GradientOrangeStart} />
                </View>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitleLarge}>Skin Scan</Text>
                <Text style={styles.cardSubtitleLarge}>Analyze your skin now</Text>
              </View>
            </LinearGradient>
            
          </TouchableOpacity>

          {/* Latest Skin Scan Section */}
          <LatestSkinScanSection
          latestScanTime="2 hours ago"
          acneStatus="Good"
          dullnessStatus="Fair"
          pigmentationStatus="Needs Care"
        />

         <StressLevelSection
          currentLevel="Low"
          progressPercent={50}
          connected={true}
          onViewHistory={() => navigation.navigate("StressHistory")}
         />
        <DietTipSection
          title="Diet Tip of the Day"
          mainTip="Boost Vitamin C"
          description="Add citrus fruits to your breakfast for brighter, more radiant skin."
          mainIcon="carrot"
          items={[
             { name: "Lemon", icon: "fruit-citrus", color: "#FDD835" },
             { name: "Orange", icon: "fruit-cherries", color: "#FF9800" },
             { name: "Kiwi", icon: "leaf", color: "#4CAF50" },
          ]}
          onPressButton={() => navigation.navigate("DietPlan")}
        />


          {/* Expert Section */}
      <ExpertSection
        expertName="Dr. Emma Wilson"
        subtitle="Get personalized advice for your pigmentation concerns."
        buttonTitle="Book Consultation"
        online={true}
        onPressButton={() => navigation.navigate("ExpertBooking")}
      />

        </ScrollView>
      </View>
    </SafeScreen>
  );
}

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  notificationButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.WhiteColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.ButtonPink,
    justifyContent: "center",
    alignItems: "center",
  },

  fullWidthCardWrapper: {
    width: "100%",
    height: verticalScale(150),
    borderRadius: ms(20),
    overflow: "hidden",
    elevation: 4,
    marginBottom: verticalScale(25),
  },
  gradientCard: {
    flex: 1,
    padding: ms(20),
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(15),
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowCircle: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    marginTop: verticalScale(10),
  },
  cardTitleLarge: {
    fontSize: textScale(24),
    fontWeight: "bold",
    color: "white",
    marginBottom: verticalScale(4),
    textAlign:"center"
  },
  cardSubtitleLarge: {
    fontSize: textScale(14),
    color: "rgba(255,255,255,0.9)",
    textAlign:"center"

  },

});
