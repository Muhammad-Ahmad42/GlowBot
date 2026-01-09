import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { verticalScale, textScale, ms, horizontalScale } from "../../../utils/SizeScalingUtility";
import Colors from "../../../utils/Colors";

const DETAILED_ANALYSIS_CONFIG: Record<
  string,
  {
    subtitle: string;
    color: string;
    icon: string;
    iconType: "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
    iconBg: string;
  }
> = {
  Acne: {
    subtitle: "Moderate concern",
    color: "#D32F2F",
    icon: "alert",
    iconType: "MaterialCommunityIcons",
    iconBg: "#FFEBEE",
  },
  Pigmentation: {
    subtitle: "Mild spots detected",
    color: "#FBC02D",
    icon: "circle",
    iconType: "FontAwesome5",
    iconBg: "#FFF8E1",
  },
  Dullness: {
    subtitle: "Low radiance",
    color: "#1976D2",
    icon: "moon",
    iconType: "Ionicons",
    iconBg: "#E3F2FD",
  },
  Dehydration: {
    subtitle: "Dryness levels",
    color: "#FF7043", // Orange/Red indicating warning
    icon: "water",
    iconType: "Ionicons",
    iconBg: "#FBE9E7",
  },
};

interface AnalysisItem {
  name: string;
  value: number;
  subtitle: string;
  color: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
  iconBg: string;
}

interface DetailedAnalysisSectionProps {
  skinAnalysis: Record<string, number>;
}

const DetailedAnalysisSection: React.FC<DetailedAnalysisSectionProps> = ({ skinAnalysis }) => {
  // Transform data for list
  const analysis = Object.entries(skinAnalysis)
    .filter(([key]) => key in DETAILED_ANALYSIS_CONFIG)
    .map(([key, value]) => ({
      name: key,
      value: value,
      ...DETAILED_ANALYSIS_CONFIG[key],
    }));

  const renderIcon = (item: AnalysisItem) => {
    switch (item.iconType) {
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={item.icon as any} size={16} color={item.color} />;
      case "FontAwesome5":
        return <FontAwesome5 name={item.icon as any} size={16} color={item.color} />;
      default:
        return <Ionicons name={item.icon as any} size={16} color={item.color} />;
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === "Acne") {
        if (value >= 30) {
            return `${value}%`;
        } else {
            const outOfFive = (value / 6).toFixed(1);
            return `${outOfFive}/5`; 
        }
    }
    return `${value}%`;
  };

  return (
    <View style={styles.detailsCard}>
      <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Detailed Analysis</Text>

      {analysis.map((item, index) => (
        <View key={index} style={styles.detailRow}>
          <View style={[styles.detailIconBg, { backgroundColor: item.iconBg }]}>
            {renderIcon(item)}
          </View>
          <View style={styles.detailContent}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{item.name}</Text>
              <Text style={[styles.detailValue, { color: item.color }]}>{formatValue(item.name, item.value)}</Text>
            </View>
            <Text style={styles.detailSubtitle}>{item.subtitle}</Text>
            <View style={styles.detailBarBg}>
              <View
                style={[
                  styles.detailBarFill,
                  { width: `${item.value}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  detailsCard: {
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
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: verticalScale(20),
  },
  detailIconBg: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
  },
  detailContent: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(2),
  },
  detailTitle: {
    fontSize: textScale(14),
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  detailValue: {
    fontSize: textScale(14),
    fontWeight: "bold",
  },
  detailSubtitle: {
    fontSize: textScale(12),
    color: Colors.textMuted,
    marginBottom: verticalScale(6),
  },
  detailBarBg: {
    height: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 3,
  },
  detailBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});

export default DetailedAnalysisSection;
