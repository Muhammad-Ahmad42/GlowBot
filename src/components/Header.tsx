import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle, TextStyle, ImageSourcePropType } from "react-native";
import {
  horizontalScale,
  textScale,
  verticalScale,
  ms,
} from "../utils/SizeScalingUtility";
import Colors from "../utils/Colors";

import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  heading?: string;
  subTitle?: string;
  avatarUri?: string | ImageSourcePropType;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  children?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  heading,
  subTitle,
  avatarUri,
  rightIcon,
  onRightIconPress,
  containerStyle,
  titleStyle,
  subtitleStyle,
  children,
  showBackButton,
  onBackPress,
}) => {
  const imageSource = typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri;

  return (
    <View style={[styles.headerContainer, containerStyle]}>
      <View style={styles.leftContainer}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          avatarUri && (
            <Image
              source={imageSource}
              style={styles.avatar}
            />
          )
        )}
        <View style={styles.textContainer}>
          {heading && (
            <View style={styles.headingRow}>
              <Text style={[styles.heading, titleStyle]}>{heading}</Text>
            </View>
          )}
          {subTitle && (
            <Text style={[styles.subTitle, subtitleStyle]}>{subTitle}</Text>
          )}
          {children}
        </View>
      </View>

      {rightIcon && (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={onRightIconPress}
          activeOpacity={0.7}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(25),
    paddingHorizontal: horizontalScale(20),
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    marginRight: horizontalScale(12),
    backgroundColor: Colors.GreyColor,
  },
  textContainer: {
    justifyContent: "center",
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  subTitle: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
  },
  rightIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginRight: horizontalScale(12),
    padding: ms(5),
  },
});

