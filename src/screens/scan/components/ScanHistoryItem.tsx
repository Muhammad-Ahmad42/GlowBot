import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ms, textScale, verticalScale, horizontalScale } from "../../../utils/SizeScalingUtility";
import Colors from "../../../utils/Colors";

interface ScanHistoryItemProps {
  date: string;
  score: number;
  onPress?: () => void;
}

const ScanHistoryItem: React.FC<ScanHistoryItemProps> = ({ date, score, onPress }) => {
  let statusColor = Colors.StatusGood;
  let statusText = Colors.StatusGoodText;
  let iconName: keyof typeof Ionicons.glyphMap = "checkmark";

  if (score < 70) {
    statusColor = Colors.StatusFair;
    statusText = Colors.StatusFairText;
    iconName = "alert";
  }
  // You can add more logic for "Poor" or other states if needed

  return (
    <TouchableOpacity style={[styles.scanCard, { backgroundColor: statusColor }]} onPress={onPress}>
      <View style={styles.scanIconContainer}>
        <Ionicons name={iconName} size={16} color={statusText} />
      </View>
      <Text style={styles.scanDate}>{date}</Text>
      <Text style={[styles.scanScore, { color: statusText }]}>{score}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scanCard: {
    width: ms(80),
    height: ms(90),
    borderRadius: ms(15),
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
    padding: ms(5),
  },
  scanIconContainer: {
    marginBottom: verticalScale(5),
  },
  scanDate: {
    fontSize: textScale(10),
    color: Colors.textPrimary,
    fontWeight: "500",
    marginBottom: verticalScale(2),
  },
  scanScore: {
    fontSize: textScale(14),
    fontWeight: "bold",
  },
});

export default ScanHistoryItem;
