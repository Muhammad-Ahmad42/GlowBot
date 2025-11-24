import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Header, SafeScreen, Card } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";

import { useNavigation } from "@react-navigation/native";

const WeeklyScanScreen = () => {
  const navigation = useNavigation();
  const weeklyData = [
    { day: "Mon", score: 78, status: "Good" },
    { day: "Tue", score: 80, status: "Good" },
    { day: "Wed", score: 75, status: "Fair" },
    { day: "Thu", score: 82, status: "Excellent" },
    { day: "Fri", score: 85, status: "Excellent" },
    { day: "Sat", score: 79, status: "Good" },
    { day: "Sun", score: 81, status: "Good" },
  ];

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header 
          heading="Weekly Scans" 
          subTitle="Your skin progress this week" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {weeklyData.map((item, index) => (
            <Card key={index} style={styles.scanCard}>
              <View style={styles.dayContainer}>
                <Text style={styles.dayText}>{item.day}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{item.score}</Text>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={item.score >= 80 ? "happy" : "happy-outline"}
                  size={24}
                  color={item.score >= 80 ? Colors.StatusGoodText : Colors.StatusFairText}
                />
              </View>
            </Card>
          ))}
        </ScrollView>
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
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ms(15),
    marginBottom: verticalScale(10),
  },
  dayContainer: {
    width: ms(50),
    alignItems: "center",
  },
  dayText: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  scoreContainer: {
    flex: 1,
    alignItems: "center",
  },
  scoreText: {
    fontSize: textScale(24),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  statusText: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
  },
  iconContainer: {
    width: ms(40),
    alignItems: "center",
  },
});

export default WeeklyScanScreen;
