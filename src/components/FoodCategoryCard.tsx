import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ms, textScale, verticalScale } from "../utils/SizeScalingUtility";

interface FoodCategoryCardProps {
  category: {
    color: string;
    icon: string;
    title: string;
    items: string;
  };
}

const FoodCategoryCard = ({ category }: FoodCategoryCardProps) => (
  <View style={[styles.foodCard, { backgroundColor: category.color }]}>
    <MaterialCommunityIcons name={category.icon as any} size={24} color="white" />
    <Text style={styles.foodTitle}>{category.title}</Text>
    <Text style={styles.foodItems}>{category.items}</Text>
  </View>
);

const styles = StyleSheet.create({
  foodCard: {
    width: "48%",
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: verticalScale(12),
  },
  foodTitle: {
    fontSize: textScale(13),
    fontWeight: "600",
    color: "white",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
  },
  foodItems: {
    fontSize: textScale(11),
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: textScale(15),
  },
});

export default FoodCategoryCard;
