import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { G, Circle } from "react-native-svg";
import { verticalScale, textScale, ms, horizontalScale } from "../../../utils/SizeScalingUtility";
import Colors from "../../../utils/Colors";

const SKIN_CONDITIONS_CONFIG: Record<string, { color: string; label: string }> = {
  Acne: { color: "#FF5252", label: "Acne" },
  Pigmentation: { color: "#FFC107", label: "Pigmentation" },
  Dullness: { color: "#448AFF", label: "Dullness" },
  Stress: { color: "#9C27B0", label: "Stress" },
};

interface SkinConditionSectionProps {
  skinAnalysis: Record<string, number>;
}

const SkinConditionSection: React.FC<SkinConditionSectionProps> = ({ skinAnalysis }) => {
  const radius = 70;
  const strokeWidth = 20;
  const center = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  let currentAngle = 0;

  // Transform data for chart
  const conditions = Object.entries(skinAnalysis)
    .filter(([key]) => key in SKIN_CONDITIONS_CONFIG)
    .map(([key, value]) => ({
      name: SKIN_CONDITIONS_CONFIG[key]?.label || key,
      value: value,
      color: SKIN_CONDITIONS_CONFIG[key]?.color || "#CCCCCC",
    }));

  const total = conditions.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.chartCard}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="chart-pie" size={20} color={Colors.ButtonPink} />
        <Text style={styles.sectionTitle}>Skin Condition Analysis</Text>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={center * 2} height={center * 2} viewBox={`0 0 ${center * 2} ${center * 2}`}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {conditions.map((item, index) => {
              const strokeDashoffset = circumference - (circumference * item.value) / total;
              const angle = (item.value / total) * 360;
              const component = (
                <Circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  rotation={currentAngle}
                  origin={`${center}, ${center}`}
                  fill="none"
                />
              );
              currentAngle += angle;
              return component;
            })}
          </G>
        </Svg>
      </View>

      <View style={styles.legendContainer}>
        {conditions.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginLeft: horizontalScale(8),
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
  },
});

export default SkinConditionSection;
