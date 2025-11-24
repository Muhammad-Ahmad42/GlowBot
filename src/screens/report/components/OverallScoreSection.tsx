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

  return (
    <Card style={styles.scoreCard}>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreTitle}>Overall Skin Score</Text>
        <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
      </View>
      <View style={styles.scoreValueContainer}>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreLabel}>{getScoreLabel(score)}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${score}%` }]} />
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
    marginBottom: verticalScale(10),
  },
  scoreTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  scoreValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: verticalScale(10),
  },
  scoreValue: {
    fontSize: textScale(36),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginRight: 10,
  },
  scoreLabel: {
    fontSize: textScale(18),
    fontWeight: "600",
    color: Colors.StatusGoodText,
  },
  progressBarContainer: {
    height: verticalScale(8),
    backgroundColor: "#E0E0E0",
    borderRadius: ms(4),
    marginBottom: verticalScale(5),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.StatusGoodText,
    borderRadius: ms(4),
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
