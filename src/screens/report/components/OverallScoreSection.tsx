import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale, textScale, ms } from "../../../utils/SizeScalingUtility";
import Colors from "../../../utils/Colors";
import { Card } from "@/src/components";

const OVERALL_SCORE_LABELS = {
  label: "Good",
  minLabel: "Poor",
  maxLabel: "Excellent",
};

interface OverallScoreSectionProps {
  score: number;
}

const OverallScoreSection: React.FC<OverallScoreSectionProps> = ({ score }) => {
  const getScoreLabel = (score: number) => {
    if (score >= 80) return OVERALL_SCORE_LABELS.maxLabel;
    if (score >= 60) return OVERALL_SCORE_LABELS.label;
    return OVERALL_SCORE_LABELS.minLabel;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#4CAF50"; // Green
    if (score >= 60) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  const scoreColor = getScoreColor(score);
  const displayScore = score !== undefined && score !== null ? score : 0;

  return (
    <Card style={styles.scoreCard}>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreTitle}>Overall Skin Score</Text>
        <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
      </View>
      
      <View style={styles.centerContainer}>
        <Text style={[styles.scoreValue, { color: scoreColor }]}>{displayScore}</Text>
        <Text style={[styles.scoreLabel, { color: scoreColor }]}>{getScoreLabel(displayScore)}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${displayScore}%`, backgroundColor: scoreColor }]} />
      </View>
      <View style={styles.scoreLabels}>
        <Text style={styles.minMaxLabel}>{OVERALL_SCORE_LABELS.minLabel}</Text>
        <Text style={styles.minMaxLabel}>{OVERALL_SCORE_LABELS.maxLabel}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  scoreCard: {
    padding: ms(20),
    marginBottom: verticalScale(20),
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  scoreTitle: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(15),
  },
  scoreValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: verticalScale(10),
  },
  scoreValue: {
    fontSize: textScale(48), // Much larger
    fontWeight: "bold",
    marginBottom: verticalScale(5),
  },
  scoreLabel: {
    fontSize: textScale(20),
    fontWeight: "600",
  },
  progressBarContainer: {
    height: verticalScale(12),
    backgroundColor: "#F5F5F5",
    borderRadius: ms(5),
    marginBottom: verticalScale(5),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: ms(5),
  },
  scoreLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  minMaxLabel: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
  },
});

export default OverallScoreSection;
