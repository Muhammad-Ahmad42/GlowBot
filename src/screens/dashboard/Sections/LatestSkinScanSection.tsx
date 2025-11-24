import { Card } from "@/src/components";
import GlowButton from "@/src/components/GlowButton";
import Colors from "@/src/utils/Colors";
import { ms, textScale, verticalScale } from "@/src/utils/SizeScalingUtility";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  latestScanTime: string;
  skinAnalysis: Record<string, number>;
}

const LatestSkinScanSection: React.FC<Props> = ({ latestScanTime, skinAnalysis }) => {
  const navigation = useNavigation<any>();

  const getStatus = (value: number) => {
    if (value < 30) return "Good";
    if (value <= 60) return "Fair";
    return "Needs Care";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Good":
        return {
          bg: Colors.StatusGood,
          text: Colors.StatusGoodText,
          icon: <Ionicons name="checkmark" size={24} color={Colors.StatusGoodText} />,
        };
      case "Fair":
        return {
          bg: Colors.StatusFair,
          text: Colors.StatusFairText,
          icon: (
            <Text style={{ color: Colors.StatusFairText, fontSize: 24, fontWeight: "bold" }}>
              !
            </Text>
          ),
        };
      default:
        return {
          bg: Colors.StatusBad,
          text: Colors.StatusBadText,
          icon: <Ionicons name="close" size={24} color={Colors.StatusBadText} />,
        };
    }
  };

  const items = Object.entries(skinAnalysis).map(([key, value]) => ({
    label: key,
    value: getStatus(value),
  }));

  return (
    <Card>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Skin Scan</Text>
        <Text style={styles.sectionDate}>{latestScanTime}</Text>
      </View>

      <View style={styles.statusRow}>
        {items.map((item, index) => {
          const status = getStatusConfig(item.value);

          return (
            <View key={index} style={styles.statusItem}>
              <View style={[styles.statusCircle, { backgroundColor: status.bg }]}>
                {status.icon}
              </View>
              <Text style={styles.statusLabel}>{item.label}</Text>
              <Text style={[styles.statusValue, { color: status.text }]}>{item.value}</Text>
            </View>
          );
        })}
      </View>

      <GlowButton
        title="View Full Report"
        onPress={() => navigation.navigate("Report")}
      />
    </Card>
  );
};

export default LatestSkinScanSection;

const styles = StyleSheet.create({
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
});
