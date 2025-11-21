
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeScreen, Header } from "../../components";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { horizontalScale, ms, textScale } from "../../utils/SizeScalingUtility";
import { verticalScale } from "react-native-size-matters";
import Colors from "../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../store/AuthStore";

function DashboardScreen() {
  const { user } = useAuthStore();
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
      <View style={styles.badge}>
        <Text style={styles.badgeText}>3</Text>
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={styles.container}>
        {/* Header */}
        <Header
          heading={`Hi ${user?.displayName?.split(" ")[0] || "User"} 👋`}
          subTitle="Ready to glow today?"
          avatarUri={user?.photoURL || "https://via.placeholder.com/50"}
          rightIcon={renderNotificationIcon}
          onRightIconPress={() => { }}
          containerStyle={{ paddingHorizontal: 0 }} // Override default padding since container has padding
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.tabItem,
                  activeTab === tab.name && styles.activeTabItem,
                ]}
                onPress={() => setActiveTab(tab.name)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={activeTab === tab.name ? "white" : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.name && styles.activeTabText,
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Skin Scan Card - Full Width */}
          <TouchableOpacity style={styles.fullWidthCardWrapper}>
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
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Skin Scan</Text>
              <Text style={styles.sectionDate}>2 hours ago</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.statusCircle, { backgroundColor: Colors.StatusGood }]}>
                  <Ionicons name="checkmark" size={24} color={Colors.StatusGoodText} />
                </View>
                <Text style={styles.statusLabel}>Acne</Text>
                <Text style={[styles.statusValue, { color: Colors.StatusGoodText }]}>Good</Text>
              </View>

              <View style={styles.statusItem}>
                <View style={[styles.statusCircle, { backgroundColor: Colors.StatusFair }]}>
                  <Text style={{ color: Colors.StatusFairText, fontSize: 24, fontWeight: 'bold' }}>!</Text>
                </View>
                <Text style={styles.statusLabel}>Dullness</Text>
                <Text style={[styles.statusValue, { color: Colors.StatusFairText }]}>Fair</Text>
              </View>

              <View style={styles.statusItem}>
                <View style={[styles.statusCircle, { backgroundColor: Colors.StatusBad }]}>
                  <Ionicons name="close" size={24} color={Colors.StatusBadText} />
                </View>
                <Text style={styles.statusLabel}>Pigmentation</Text>
                <Text style={[styles.statusValue, { color: Colors.StatusBadText }]}>Needs Care</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.fullReportButton}>
              <LinearGradient
                colors={[Colors.ButtonPink, "#FF8C61"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>View Full Report</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Stress Level Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Stress Level Today</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', marginRight: 6 }} />
                <Text style={styles.sectionDate}>Connected</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: textScale(14), color: Colors.textSecondary }}>Current Level</Text>
              <Text style={{ fontSize: textScale(18), fontWeight: 'bold', color: Colors.StressBlue }}>Low</Text>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="heart" size={20} color={Colors.StressBlue} />
              </View>
            </View>

            <View style={{ height: 6, backgroundColor: Colors.ProgressBarBackground, borderRadius: 3, marginBottom: 15 }}>
              <View style={{ width: '30%', height: '100%', backgroundColor: Colors.StressBlue, borderRadius: 3 }} />
            </View>

            <Text style={{ fontSize: textScale(13), color: Colors.textSecondary, marginBottom: 20 }}>
              Great! Your stress levels are optimal for healthy skin.
            </Text>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.StressBlue }]}>
              <Text style={styles.buttonText}>View Stress History</Text>
            </TouchableOpacity>
          </View>

          {/* Diet Tip Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Diet Tip of the Day</Text>
              <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FBC02D" />
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: Colors.DietIconBg, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                <MaterialCommunityIcons name="carrot" size={30} color={Colors.DietButton} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: textScale(16), fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 }}>Boost Vitamin C</Text>
                <Text style={{ fontSize: textScale(13), color: Colors.textSecondary }}>Add citrus fruits to your breakfast for brighter, more radiant skin.</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              {[
                { name: 'Lemon', icon: 'fruit-citrus', color: '#FDD835' },
                { name: 'Orange', icon: 'fruit-cherries', color: '#FF9800' }, // Using cherries as generic fruit placeholder if orange not available, or circle
                { name: 'Kiwi', icon: 'leaf', color: '#4CAF50' }
              ].map((item, index) => (
                <View key={index} style={{ width: '30%', backgroundColor: Colors.ActivityIconBg, borderRadius: 12, padding: 10, alignItems: 'center' }}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} style={{ marginBottom: 5 }} />
                  <Text style={{ fontSize: textScale(12), color: Colors.textPrimary }}>{item.name}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.DietButton }]}>
              <Text style={styles.buttonText}>Get Personalized Plan</Text>
            </TouchableOpacity>
          </View>

          {/* Expert Section */}
          <View style={[styles.sectionContainer, { backgroundColor: Colors.ExpertCardBg }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#BA68C8', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                <FontAwesome name="user-md" size={24} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: textScale(16), fontWeight: 'bold', color: Colors.textPrimary }}>Expert Available</Text>
                <Text style={{ fontSize: textScale(13), color: Colors.textSecondary }}>Dr. Emma Wilson is online now</Text>
              </View>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50' }} />
            </View>

            <Text style={{ fontSize: textScale(13), color: Colors.textSecondary, marginBottom: 20 }}>
              Get personalized advice for your pigmentation concerns.
            </Text>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.ExpertButton }]}>
              <Text style={styles.buttonText}>Book Consultation</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View style={[styles.sectionContainer, { marginBottom: 20 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Recent Activity</Text>

            {[
              { title: 'Skin scan completed', time: '2 hours ago', icon: 'camera', color: '#A5D6A7', iconColor: '#2E7D32' },
              { title: 'Stress data synced', time: '4 hours ago', icon: 'heart', color: '#90CAF9', iconColor: '#1565C0' },
              { title: 'Diet plan updated', time: '1 day ago', icon: 'apple', color: '#FFCC80', iconColor: '#EF6C00' }
            ].map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: item.color, justifyContent: 'center', alignItems: 'center', marginRight: 15, opacity: 0.5 }}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color={item.iconColor} style={{ opacity: 1 }} />
                </View>
                <View>
                  <Text style={{ fontSize: textScale(14), fontWeight: '600', color: Colors.textPrimary }}>{item.title}</Text>
                  <Text style={{ fontSize: textScale(12), color: Colors.textSecondary }}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>

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
  badgeText: {
    color: "white",
    fontSize: 6,
    fontWeight: "bold",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(25),
    backgroundColor: Colors.WhiteColor,
    padding: ms(10),
    borderRadius: ms(15),
    elevation: 2,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: ms(12),
  },
  activeTabItem: {
    backgroundColor: Colors.TabActivePink,
  },
  tabText: {
    marginTop: verticalScale(4),
    fontSize: textScale(12),
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
  fullWidthCardWrapper: {
    width: "100%",
    height: verticalScale(180),
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
  },
  cardSubtitleLarge: {
    fontSize: textScale(14),
    color: "rgba(255,255,255,0.9)",
  },
  sectionContainer: {
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(20),
    padding: ms(20),
    elevation: 2,
    marginBottom: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  sectionDate: {
    fontSize: textScale(12),
    color: Colors.textMuted,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  statusItem: {
    alignItems: "center",
  },
  statusCircle: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  statusLabel: {
    fontSize: textScale(12),
    color: Colors.textPrimary,
    fontWeight: "600",
    marginBottom: verticalScale(2),
  },
  statusValue: {
    fontSize: textScale(12),
    fontWeight: "bold",
  },
  fullReportButton: {
    width: "100%",
    height: verticalScale(45),
    borderRadius: ms(12),
    overflow: "hidden",
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: textScale(14),
    fontWeight: "bold",
  },
  actionButton: {
    width: "100%",
    height: verticalScale(45),
    borderRadius: ms(12),
    justifyContent: "center",
    alignItems: "center",
  },
});
