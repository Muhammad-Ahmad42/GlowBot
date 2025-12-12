import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../utils/Colors";
import { horizontalScale, ms, textScale, verticalScale } from "../utils/SizeScalingUtility";

interface MealCardProps {
  meal: {
    type: string;
    time: string;
    name: string;
    calories?: string;
    [key: string]: any;
  };
  icon: string;
  color: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  RightComponent?: React.ReactNode;
}

const MealCard = ({ meal, icon, color, onPress, style, RightComponent }: MealCardProps) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={[styles.mealCard, style]} onPress={onPress}>
      <View style={[styles.mealIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon as any} size={28} color={Colors.textPrimary} />
      </View>
      <View style={styles.mealContent}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealType}>{meal.type}</Text>
        </View>
        <Text style={styles.mealTime}>{meal.time}</Text>
        <View style={styles.mealDetails}>
          <Text style={styles.mealName} numberOfLines={1}>{meal.name}</Text>
          {meal.calories && !RightComponent && <Text style={styles.nutrientTag}>{meal.calories}</Text>}
        </View>
      </View>
      {RightComponent}
    </Container>
  );
};

const styles = StyleSheet.create({
  mealCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: verticalScale(12),
    elevation: 2,
    alignItems: "center", 
  },
  mealIcon: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(16),
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(12),
  },
  mealContent: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  mealType: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  mealTime: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
    marginBottom: verticalScale(8),
  },
  mealDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealName: {
    fontSize: textScale(14),
    color: Colors.textPrimary,
    flex: 1,
  },
  nutrientTag: {
    fontSize: textScale(11),
    color: Colors.ButtonPink,
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: ms(8),
    maxWidth: "30%",
  },
});

export default MealCard;
