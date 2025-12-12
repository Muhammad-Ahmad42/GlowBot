import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/src/utils/Colors";
import { ms, textScale, verticalScale } from "@/src/utils/SizeScalingUtility";
import { Ionicons } from "@expo/vector-icons";
import GlowButton from "@/src/components/GlowButton";

interface Props {
  value: number; // 0 to 100
  connected?: boolean;
  onViewHistory?: () => void;
}

const StressLevelSection: React.FC<Props> = ({
  value,
  connected = true,
  onViewHistory = () => {},
}) => {
  const getStressLevel = (val: number) => {
    if (val < 30) return "Low";
    if (val <= 70) return "Medium";
    return "High";
  };

  const currentLevel = getStressLevel(value);

  const getStressInfo = (val: number) => {
    if (val < 30) return "Great! Your stress levels are optimal for healthy skin.";
    if (val <= 70) return "Moderate stress signs detected. Consider some relaxation.";
    return "High stress detected. Your skin is showing signs of fatigue.";
  };

  const stressInfo = getStressInfo(value);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Stress Level Today</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: connected ? "#4CAF50" : "#F44336",
              marginRight: 6,
            }}
          />
          <Text style={styles.sectionDate}>{connected ? "Connected" : "Disconnected"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Current Level</Text>
        <Text style={styles.level}>{currentLevel}</Text>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={20} color={Colors.StressBlue} />
        </View>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${value}%` }]} />
      </View>

      <Text style={styles.infoText}>
        {stressInfo}
      </Text>

      <GlowButton
        title="View Stress History"
        onPress={onViewHistory}
        gradientColors={[Colors.StressBlue, Colors.StressBlue]}
      />
    </View>
  );
};

export default StressLevelSection;

const styles = StyleSheet.create({
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
  },
  level: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.StressBlue,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.ProgressBarBackground,
    borderRadius: 3,
    marginBottom: 15,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.StressBlue,
    borderRadius: 3,
  },
  infoText: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
    marginBottom: 20,
  },
});
