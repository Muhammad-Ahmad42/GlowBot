import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { verticalScale, textScale, ms, horizontalScale } from "../../../utils/SizeScalingUtility";

interface ExpertAdviceSectionProps {
  onBookNow: () => void;
}

const ExpertAdviceSection: React.FC<ExpertAdviceSectionProps> = ({ onBookNow }) => {
  return (
    <LinearGradient
      colors={["#E040FB", "#FF4081"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.expertBanner}
    >
      <View style={styles.expertIconCircle}>
        <FontAwesome5 name="user-md" size={24} color="white" />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <Text style={styles.expertTitle}>Get Expert Advice</Text>
        <Text style={styles.expertSubtitle}>Consult with certified dermatologists</Text>
      </View>
      <TouchableOpacity style={styles.bookButton} onPress={onBookNow}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  expertBanner: {
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    flexDirection: "row",
    alignItems: "center",
  },
  expertIconCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  expertTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: "white",
  },
  expertSubtitle: {
    fontSize: textScale(12),
    color: "rgba(255,255,255,0.9)",
  },
  bookButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: ms(20),
  },
  bookButtonText: {
    color: "white",
    fontSize: textScale(12),
    fontWeight: "bold",
  },
});

export default ExpertAdviceSection;
