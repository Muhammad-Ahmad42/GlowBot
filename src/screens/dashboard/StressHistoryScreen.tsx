import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeScreen, Header, GlowButton, CustomModal } from "@/src/components";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../utils/Colors";
import { useDashboardStore } from "../../store/DashboardStore";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";

import { Platform, ActivityIndicator } from "react-native";
import { HealthService, HealthData } from "../../services/HealthService";
import { StressService } from "../../services/StressService";
import { useAuthStore } from "../../store/AuthStore";

const StressHistoryScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", icon: "information-circle" as any });
  const [todaysHealth, setTodaysHealth] = useState<HealthData | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const { user } = useAuthStore();

  const stressHistory = useDashboardStore((state) => state.stressHistory);

  const getStressColor = (level: string) => {
    switch (level) {
      case "Low": return Colors.StatusGoodText;
      case "Med": return Colors.StatusFairText;
      case "High": return Colors.StatusBadText;
      default: return Colors.StatusGoodText;
    }
  };

  const maxBarHeight = verticalScale(150);

  const handleBarPress = (item: any) => {
    setModalContent({
      title: `Stress Level: ${item.level}`,
      message: `${item.day}: ${item.details}`,
      icon: "pulse",
    });
    setModalVisible(true);
  };

  const handleRecommendationPress = (title: string, message: string, icon: string) => {
    setModalContent({
      title,
      message,
      icon: icon as any,
    });
    setModalVisible(true);
  };

  const handleSyncHealth = async () => {
    if (Platform.OS !== 'android') {
      setModalContent({
        title: "Not Supported",
        message: "Health Connect is only available on Android.",
        icon: "alert-circle" as any,
      });
      setModalVisible(true);
      return;
    }

    if (!user) {
      setModalContent({
        title: "Not Logged In",
        message: "Please log in to sync your health data.",
        icon: "alert-circle" as any,
      });
      setModalVisible(true);
      return;
    }

    setLoadingHealth(true);
    try {
      const isAvailable = await HealthService.checkAvailability();
      if (!isAvailable) {
        setModalContent({
            title: "Health Connect Unavailable",
            message: "Please ensure Health Connect is installed on your device.",
            icon: "alert-circle" as any,
        });
        setModalVisible(true);
        setLoadingHealth(false);
        return;
      }

      const isInitialized = await HealthService.initialize();
      if (!isInitialized) { 
         // Try checking if it's just permissions
         // initialize() usually involves ensuring the SDK is ready.
      }

      const hasPermissions = await HealthService.requestPermissions();
      if (!hasPermissions) {
        setModalContent({
            title: "Permission Denied",
            message: "We need access to your health data to calculate your stress score.",
            icon: "lock-closed" as any,
        });
        setModalVisible(true);
        setLoadingHealth(false);
        return;
      }

      const data = await HealthService.getHealthData();
      setTodaysHealth(data);
      
      // Check if data is actually valid (not all zeros)
      const hasValidData = data.steps > 0 || data.heartRate > 0 || data.sleepHours > 0;
      
      if (!hasValidData) {
        // Fallback to camera scan
        setModalContent({
          title: "No Health Data Available",
          message: "Health Connect has no data for today. Would you like to use Camera Scan instead for stress analysis?",
          icon: "camera" as any,
        });
        setModalVisible(true);
        setLoadingHealth(false);
        
        // Optionally navigate to ScanScreen after user closes modal
        // For now, just inform them
        return;
      }

      // Save to backend
      const saved = await StressService.logStressData(user.uid, data, 'health_connect');
      
      setModalContent({
        title: saved ? "Sync Complete ✓" : "Sync Complete",
        message: `Stress Level: ${data.stressLevel} (${data.stressLabel})\nHR: ${data.heartRate} bpm\nSleep: ${data.sleepHours} hrs\nSteps: ${data.steps}\n${saved ? '\nData saved to your profile.' : '\n(Could not save to server)'}`,
        icon: "checkmark-circle" as any,
      });
      setModalVisible(true);

    } catch (error) {
        console.error("Sync error:", error);
         setModalContent({
            title: "Sync Failed",
            message: "An error occurred while syncing health data. You can use Camera Scan instead.",
            icon: "alert-circle" as any,
        });
        setModalVisible(true);
    } finally {
        setLoadingHealth(false);
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Stress History"
          subTitle="Track your mental well-being"
          titleStyle={styles.headerTitle}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Chart Section */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Weekly Overview</Text>
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: Colors.StatusGoodText }]} />
                        <Text style={styles.legendText}>Low</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: Colors.StatusFairText }]} />
                        <Text style={styles.legendText}>Med</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: Colors.StatusBadText }]} />
                        <Text style={styles.legendText}>High</Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.barChartContainer}>
                {stressHistory.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.barColumn} onPress={() => handleBarPress(item)}>
                        <View style={styles.barWrapper}>
                            <View 
                                style={[
                                    styles.bar, 
                                    { 
                                        height: (item.value / 100) * maxBarHeight, 
                                        backgroundColor: getStressColor(item.level)
                                    }
                                ]} 
                            />
                        </View>
                        <Text style={styles.dayText}>{item.day}</Text>
                    </TouchableOpacity>
                ))}
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
              <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Average Level</Text>
                  <Text style={[styles.statValue, { color: Colors.StatusGoodText }]}>Low</Text>
              </View>
              <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Total Check-ins</Text>
                  <Text style={styles.statValue}>14</Text>
              </View>
          </View>

          {/* Recommendations */}
          <Text style={styles.sectionTitle}>Recommendations</Text>
          
          <TouchableOpacity 
            style={styles.recommendationCard}
            onPress={() => handleRecommendationPress("5-Min Meditation", "Take 5 minutes to focus on your breath. Inhale for 4 seconds, hold for 4, exhale for 4.", "meditation")}
          >
              <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialCommunityIcons name="meditation" size={24} color="#1976D2" />
              </View>
              <View style={styles.recContent}>
                  <Text style={styles.recTitle}>5-Min Meditation</Text>
                  <Text style={styles.recDesc}>Quick reset for a busy day.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.recommendationCard}
            onPress={() => handleRecommendationPress("Sleep Hygiene", "Avoid screens 1 hour before bed. Keep your room cool and dark.", "sleep")}
          >
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="sleep" size={24} color="#388E3C" />
              </View>
              <View style={styles.recContent}>
                  <Text style={styles.recTitle}>Sleep Hygiene</Text>
                  <Text style={styles.recDesc}>Tips for better rest tonight.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <GlowButton
            title={loadingHealth ? "Syncing..." : "Sync Health Data"}
            onPress={handleSyncHealth}
            style={{ marginTop: verticalScale(20) }}
            disabled={loadingHealth}
          />

        </ScrollView>

        <CustomModal
            visible={modalVisible}
            title={modalContent.title}
            message={modalContent.message}
            onClose={() => setModalVisible(false)}
            iconName={modalContent.icon}
            buttonText="Close"
        />
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  headerTitle: {
      fontSize: textScale(24),
  },
  scrollContent: {
    paddingBottom: 80,
  },
  chartCard: {
      backgroundColor: Colors.WhiteColor,
      borderRadius: ms(20),
      padding: ms(20),
      marginBottom: verticalScale(20),
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
  },
  chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(20),
  },
  chartTitle: {
      fontSize: textScale(16),
      fontWeight: 'bold',
      color: Colors.textPrimary,
  },
  legendContainer: {
      flexDirection: 'row',
  },
  legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: horizontalScale(10),
  },
  legendDot: {
      width: ms(8),
      height: ms(8),
      borderRadius: ms(4),
      marginRight: horizontalScale(4),
  },
  legendText: {
      fontSize: textScale(10),
      color: Colors.textSecondary,
  },
  barChartContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: verticalScale(180),
  },
  barColumn: {
      alignItems: 'center',
      flex: 1,
  },
  barWrapper: {
      height: verticalScale(150),
      justifyContent: 'flex-end',
      width: '100%',
      alignItems: 'center',
  },
  bar: {
      width: ms(12),
      borderRadius: ms(6),
  },
  dayText: {
      marginTop: verticalScale(8),
      fontSize: textScale(12),
      color: Colors.textSecondary,
  },
  statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: verticalScale(25),
  },
  statCard: {
      flex: 0.48,
      backgroundColor: Colors.WhiteColor,
      borderRadius: ms(16),
      padding: ms(15),
      alignItems: 'center',
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
  },
  statLabel: {
      fontSize: textScale(12),
      color: Colors.textSecondary,
      marginBottom: verticalScale(5),
  },
  statValue: {
      fontSize: textScale(18),
      fontWeight: 'bold',
      color: Colors.textPrimary,
  },
  sectionTitle: {
      fontSize: textScale(18),
      fontWeight: "bold",
      color: Colors.textPrimary,
      marginBottom: verticalScale(15),
  },
  recommendationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.WhiteColor,
      borderRadius: ms(16),
      padding: ms(15),
      marginBottom: verticalScale(15),
      elevation: 1,
  },
  iconBox: {
      width: ms(45),
      height: ms(45),
      borderRadius: ms(12),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: horizontalScale(15),
  },
  recContent: {
      flex: 1,
  },
  recTitle: {
      fontSize: textScale(16),
      fontWeight: '600',
      color: Colors.textPrimary,
      marginBottom: verticalScale(2),
  },
  recDesc: {
      fontSize: textScale(12),
      color: Colors.textSecondary,
  }
});

export default StressHistoryScreen;
