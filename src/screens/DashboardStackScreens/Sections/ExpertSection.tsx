import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/src/utils/Colors";
import { ms, textScale, verticalScale } from "@/src/utils/SizeScalingUtility";
import { FontAwesome } from "@expo/vector-icons";
import GlowButton from "@/src/components/GlowButton";

interface Props {
  expertName: string;
  subtitle: string;
  buttonTitle?: string;
  onPressButton?: () => void;
  online?: boolean;
  avatarBgColor?: string;
  buttonGradientColors?: readonly [string, string, ...string[]];
}

const ExpertSection: React.FC<Props> = ({
  expertName,
  subtitle,
  buttonTitle = "Book Consultation",
  onPressButton = () => {},
  online = true,
  avatarBgColor = "#BA68C8",
  buttonGradientColors = [Colors.ExpertButton, Colors.ExpertButton],
}) => {
  return (
    <View style={[styles.sectionContainer, { backgroundColor: Colors.ExpertCardBg }]}>
      <View style={styles.headerRow}>
        <View style={[styles.avatarCircle, { backgroundColor: avatarBgColor }]}>
          <FontAwesome name="user-md" size={24} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.expertName}>Expert Available</Text>
          <Text style={styles.expertSubtitle}>{expertName} is {online ? "online now" : "offline"}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: online ? "#4CAF50" : "#F44336" }]} />
      </View>

      <Text style={styles.description}>{subtitle}</Text>

      <GlowButton
        title={buttonTitle}
        onPress={onPressButton}
        gradientColors={buttonGradientColors}
      />
    </View>
  );
};

export default ExpertSection;

const styles = StyleSheet.create({
  sectionContainer: {
    borderRadius: ms(20),
    padding: ms(20),
    elevation: 2,
    marginBottom: verticalScale(20),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  expertName: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  expertSubtitle: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
  },
  description: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
    marginBottom: 20,
  },
});
