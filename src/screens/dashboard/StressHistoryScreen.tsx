import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeScreen, Header, GlowButton, CustomModal } from "@/src/components";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../utils/Colors";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";

const StressHistoryScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "", icon: "information-circle" as any });

  const historyData = [
    { day: "Mon", level: "Low", value: 30, color: Colors.StatusGoodText, details: "Felt relaxed and productive." },
    { day: "Tue", level: "Med", value: 55, color: Colors.StatusFairText, details: "Some work pressure, but manageable." },
    { day: "Wed", level: "High", value: 80, color: Colors.StatusBadText, details: "Tight deadlines caused high stress." },
    { day: "Thu", level: "Low", value: 25, color: Colors.StatusGoodText, details: "Great day, exercised in the morning." },
    { day: "Fri", level: "Med", value: 60, color: Colors.StatusFairText, details: "Busy end to the week." },
    { day: "Sat", level: "Low", value: 20, color: Colors.StatusGoodText, details: "Relaxing weekend vibes." },
    { day: "Sun", level: "Low", value: 15, color: Colors.StatusGoodText, details: "Prepared for the week ahead." },
  ];

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

  const handleLogStress = () => {
    setModalContent({
      title: "Log Stress Level",
      message: "This feature will allow you to record your daily stress levels and add notes.",
      icon: "create",
    });
    setModalVisible(true);
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
                {historyData.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.barColumn} onPress={() => handleBarPress(item)}>
                        <View style={styles.barWrapper}>
                            <View 
                                style={[
                                    styles.bar, 
                                    { 
                                        height: (item.value / 100) * maxBarHeight, 
                                        backgroundColor: item.color 
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
            title="Log Stress Level"
            onPress={handleLogStress}
            style={{ marginTop: verticalScale(20) }}
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
    paddingBottom: verticalScale(30),
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
