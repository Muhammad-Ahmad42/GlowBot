import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { horizontalScale, ms, textScale } from "../utils/SizeScalingUtility";
import Colors from "../utils/Colors";

interface CustomPrimaryButtonProps {
  title: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomPrimaryButton: React.FC<CustomPrimaryButtonProps> = ({
  title,
  onPress,
  iconName,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.wrapper, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={
          disabled
            ? [Colors.textMuted, Colors.textMuted]
            : ["#e943e9ff", "#4C9DFE"] 
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, disabled && styles.buttonDisabled]}
      >
        <View style={styles.contentContainer}>
          {iconName && (
            <Ionicons
              name={iconName}
              size={ms(20)}
              color={Colors.WhiteColor}
              style={styles.icon}
            />
          )}
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomPrimaryButton;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: ms(15),
    borderRadius: horizontalScale(8),
    overflow: "hidden", 
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ms(12),
    borderRadius: horizontalScale(8),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: ms(8),
  },
  buttonText: {
    color: Colors.WhiteColor,
    fontSize: textScale(16),
    fontWeight: "bold",
  },
});
