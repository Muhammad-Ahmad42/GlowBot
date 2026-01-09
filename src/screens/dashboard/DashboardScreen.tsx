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
  import { useDashboardStore } from "../../store/DashboardStore";
import drawable from "../../utils/drawable";
import { useNavigation } from "@react-navigation/native";
import { DietTipSection, ExpertSection, LatestSkinScanSection, StressLevelSection } from "./Sections";
import { Header, SafeScreen, Tabs, NotificationPanel } from "@/src/components";
import { socketService } from "../../services/SocketService";
import { useReminderStore } from "../../store/ReminderStore";
import { useConnectionStore } from "../../store/ConnectionStore";

function DashboardScreen() {
  const { user } = useAuthStore();
  const { 
    latestScan, 
    stressLevel, 
    dietTip, 
    experts, 
    fetchScanHistory, 
    fetchExperts, 
    fetchDietPlan 
  } = useDashboardStore();
  const { fetchMyConnections } = useConnectionStore();
  
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Skin");
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  const { reminders } = useReminderStore();
  const activeRemindersCount = reminders.filter(r => r.enabled).length;

  React.useEffect(() => {
    // Fetch initial data
    const userId = user?.uid || "anonymous"; // Use actual user ID
    fetchScanHistory(userId);
    fetchExperts();
    fetchDietPlan(userId);
    if (user?.uid) {
        fetchMyConnections(user.uid);
    }

    // Setup Real-time Updates
    if (user?.uid) {
      socketService.joinUserChannel(user.uid);

      // Listen for new experts/updates
      const cleanupExperts = socketService.onExpertsUpdated(() => {
        console.log("Real-time expert update received");
        fetchExperts();
      });

      // Listen for connection request status changes
      const cleanupStatus = socketService.onRequestStatusUpdated((data) => {
        console.log("Real-time status update received:", data);
        fetchExperts(); // Refresh experts to update button states (Pending -> Chat)
        // Optionally show a toast/notification here
      });

      return () => {
        cleanupExperts();
        cleanupStatus();
      };
    }
  }, [user?.uid]);

  const availableExpert = experts.length > 0 
    ? (experts.find((e) => e.available) || experts[0]) 
    : { 
        name: "Loading...", 
        description: "Fetching experts...", 
        available: false, 
        specialty: "", 
        rating: 0, 
        reviews: 0, 
        fee: "", 
        id: "loading" 
      };

  const tabs = [
    { name: "Skin", icon: "happy-outline" },
    { name: "Stress", icon: "pulse-outline" },
    { name: "Diet", icon: "nutrition-outline" },
    { name: "Experts", icon: "medkit-outline" },
  ];

  const handleTabPress = (tabName: string) => {
    if (tabName === "Skin") {
      setActiveTab("Skin");
    } else {
      switch (tabName) {
        case "Stress":
          navigation.navigate("StressHistory");
          break;
        case "Diet":
          navigation.navigate("DietPlan");
          break;
        case "Experts":
          navigation.navigate("ExpertBooking");
          break;
      }
    }
  };

  const renderNotificationIcon = (
    <View style={styles.notificationButton}>
      <FontAwesome name="bell" size={20} color={Colors.textPrimary} />
      {activeRemindersCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{activeRemindersCount}</Text></View>}
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
          onRightIconPress={() => setNotificationPanelVisible(true)}
          containerStyle={{ paddingHorizontal: 0 }}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabPress} />

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

          <LatestSkinScanSection
            latestScanTime={latestScan.time || "No scans yet"}
            skinAnalysis={latestScan.skinAnalysis}
          />

          <StressLevelSection
            value={stressLevel.value}
            connected={stressLevel.connected}
            onViewHistory={() => navigation.navigate("StressHistory")}
          />
        <DietTipSection
          title={dietTip.title || "Loading..."}
          mainTip={dietTip.mainTip || "Fetching tip..."}
          description={dietTip.description}
          category={dietTip.category}
          items={dietTip.items || []}
          onPressButton={() => navigation.navigate("DietPlan")}
        />
      <ExpertSection
        expertName={availableExpert.name}
        subtitle={availableExpert.description}
        buttonTitle="Book Consultation"
        online={availableExpert.available}
        imageUrl={(availableExpert as any).imageUrl}
        onPressButton={() => navigation.navigate("ExpertBooking")}
      />
        </ScrollView>
      </View>
      <NotificationPanel
        visible={notificationPanelVisible}
        onClose={() => setNotificationPanelVisible(false)}
      />
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
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.ButtonPink,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.WhiteColor,
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
