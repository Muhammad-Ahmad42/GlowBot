import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { horizontalScale, ms, textScale } from "../utils/SizeScalingUtility";
import Colors from "../utils/Colors";

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  gradientColors?: readonly [string, string, ...string[]];
}

const GlowButton: React.FC<GlowButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  gradientColors,
}) => {
  const colors: readonly [string, string, ...string[]] = 
    gradientColors || 
    (disabled 
      ? [Colors.textMuted, Colors.textMuted] 
      : [Colors.AuthGradientStart, Colors.AuthGradientEnd]);

  return (
    <TouchableOpacity
      style={[styles.wrapper, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, disabled && styles.buttonDisabled]}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GlowButton;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: ms(15),
    borderRadius: horizontalScale(12),
    overflow: "hidden",
    shadowColor: Colors.AuthGradientStart,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: ms(14),
    borderRadius: horizontalScale(12),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.WhiteColor,
    fontSize: textScale(16),
    fontWeight: "bold",
  },
});
