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
  centerTitle?: boolean;
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
  centerTitle = false,
}) => {
  const imageSource = typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri;

  return (
    <View style={[styles.headerContainer, containerStyle]}>
      <View style={[styles.leftContainer, centerTitle && styles.leftContainerCentered]}>
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
        {!centerTitle && (
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
        )}
      </View>

      {centerTitle && (
          <View style={styles.centerContainer}>
            {heading && (
                <Text style={[styles.heading, styles.centerHeading, titleStyle]} numberOfLines={1}>{heading}</Text>
            )}
            {subTitle && (
                <Text style={[styles.subTitle, styles.centerSubTitle, subtitleStyle]} numberOfLines={1}>{subTitle}</Text>
            )}
            {children}
          </View>
      )}

      <View style={styles.rightContainer}>
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
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  leftContainerCentered: {
      flex: 0,
      marginRight: horizontalScale(10),
  },
  centerContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
  },
  rightContainer: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
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
    fontSize: textScale(20),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  centerHeading: {
      textAlign: 'center',
  },
  subTitle: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
  },
  centerSubTitle: {
      textAlign: 'center',
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

