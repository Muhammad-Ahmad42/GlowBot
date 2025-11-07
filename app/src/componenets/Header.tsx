import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  horizontalScale,
  textScale,
  verticalScale,
} from "../utils/SizeScalingUtility";

interface HeaderProps {
  heading: string;
  avatarUri?: string;
  subTittle?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  isUserHeader?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  heading,
  avatarUri,
  subTittle,
  rightIcon,
  onRightIconPress,
  isUserHeader = false,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.contentWrapper}>
        {isUserHeader ? (
          <View style={styles.row}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials(heading)}</Text>
              </View>
            )}

            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Hi, {heading} 👋</Text>
              {subTittle && (
                <Text style={styles.greetingText}>{subTittle}</Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.centeredContainer}>
            <Text style={styles.screenTitle}>{heading}</Text>
            {subTittle && (
              <Text style={styles.centeredSubtitle}>{subTittle}</Text>
            )}
          </View>
        )}

        {rightIcon && (
          <TouchableOpacity
            style={[
              styles.rightIconContainer,
              isUserHeader && styles.rightIconUserLayout,
            ]}
            onPress={onRightIconPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconBackground}>{rightIcon}</View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.gradientOverlay} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fb8787ff",
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(15),
    shadowColor: "#ff7c7cff",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    overflow: "hidden",
    position: "relative",
  },
  contentWrapper: {
    paddingHorizontal: horizontalScale(20),
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: horizontalScale(44),
  },
  screenTitle: {
    fontSize: textScale(20),
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: -0.3,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  centeredSubtitle: {
    fontSize: textScale(14),
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    letterSpacing: -0.2,
    textAlign: "center",
    marginTop: verticalScale(4),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: horizontalScale(52),
    height: horizontalScale(52),
    borderRadius: horizontalScale(26),
    backgroundColor: "#ffffff",
    marginRight: horizontalScale(16),
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarPlaceholder: {
    width: horizontalScale(52),
    height: horizontalScale(52),
    borderRadius: horizontalScale(26),
    backgroundColor: "#fcdcdcff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(16),
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    color: "#fd6060ff",
    fontWeight: "700",
    fontSize: textScale(20),
  },
  textContainer: {
    flexDirection: "column",
    flex: 1,
  },
  welcomeText: {
    fontSize: textScale(18),
    color: "#ffffff",
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: verticalScale(4),
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  greetingText: {
    fontSize: textScale(14),
    color: "rgba(255, 255, 255, 1)",
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  rightIconContainer: {
    position: "absolute",
    right: horizontalScale(20),
  },
  rightIconUserLayout: {
    position: "relative",
    right: 0,
  },
  iconBackground: {
    width: horizontalScale(44),
    height: horizontalScale(44),
    borderRadius: horizontalScale(22),
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
});
