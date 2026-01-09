import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ms, textScale, verticalScale } from "../utils/SizeScalingUtility";

interface ScoreCardProps {
  overallScore: number;
  skinAnalysis: {
    Dehydration?: number;
    Acne?: number;
    Dullness?: number;
    [key: string]: any;
  };
}

const ScoreCard = ({ overallScore, skinAnalysis }: ScoreCardProps) => (
  <LinearGradient
    colors={['#EC4899', '#8B5CF6']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.scoreCard}
  >
    <View style={styles.scoreCircle}>
      <Text style={styles.scoreValue}>{overallScore || 0}</Text>
      <Text style={styles.scoreLabel}>Score</Text>
    </View>
    <View style={styles.metricsRow}>
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Dehydration</Text>
        <Text style={styles.metricValue}>{skinAnalysis?.Dehydration ?? 0}%</Text>
      </View>
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Acne</Text>
        <Text style={styles.metricValue}>{skinAnalysis?.Acne ?? 0}%</Text>
      </View>
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Dullness</Text>
        <Text style={styles.metricValue}>{skinAnalysis?.Dullness ?? 0}%</Text>
      </View>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  scoreCard: {
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(25),
    elevation: 4,
  },
  scoreCircle: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: verticalScale(15),
  },
  scoreValue: {
    fontSize: textScale(36),
    fontWeight: "bold",
    color: "white",
  },
  scoreLabel: {
    fontSize: textScale(12),
    color: "rgba(255, 255, 255, 0.9)",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metricItem: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: textScale(12),
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: verticalScale(4),
  },
  metricValue: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: "white",
  },
});

export default ScoreCard;
