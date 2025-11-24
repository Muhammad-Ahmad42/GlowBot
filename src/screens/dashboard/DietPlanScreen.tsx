import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeScreen, Header, GlowButton, CustomModal } from "@/src/components";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../utils/Colors";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import { LinearGradient } from "expo-linear-gradient";
import { useDashboardStore } from "../../store/DashboardStore";

const DietPlanScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [customizeModalVisible, setCustomizeModalVisible] = useState(false);

  const dietPlan = useDashboardStore((state) => state.dietPlan);

  const getMealConfig = (type: string) => {
    switch (type) {
      case "Breakfast": return { icon: "food-croissant", color: "#FFCC80" };
      case "Lunch": return { icon: "food-drumstick", color: "#A5D6A7" };
      case "Snack": return { icon: "food-apple", color: "#FFF59D" };
      case "Dinner": return { icon: "fish", color: "#90CAF9" };
      default: return { icon: "food", color: "#E0E0E0" };
    }
  };

  const handleMealPress = (meal: any) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Diet Plan"
          subTitle="Nourish your skin from within"
          rightIcon={<Ionicons name="calendar-outline" size={24} color={Colors.textPrimary} />}
          onRightIconPress={() => {}}
          titleStyle={styles.headerTitle}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Today's Summary Card */}
          <LinearGradient
            colors={[Colors.GradientOrangeStart, Colors.GradientOrangeEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View>
              <Text style={styles.summaryTitle}>Today's Goal</Text>
              <Text style={styles.summaryValue}>1500 / 2000 kcal</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarFill} />
              </View>
              <Text style={styles.summarySubtitle}>You're doing great! Keep it up.</Text>
            </View>
            <View style={styles.waterContainer}>
              <MaterialCommunityIcons name="water" size={24} color="white" />
              <Text style={styles.waterText}>1.5L</Text>
            </View>
          </LinearGradient>

          <Text style={styles.sectionTitle}>Today's Meals</Text>

          {dietPlan.map((meal, index) => (
            <TouchableOpacity key={index} style={styles.mealCard} onPress={() => handleMealPress(meal)}>
              <View style={[styles.iconContainer, { backgroundColor: getMealConfig(meal.type).color }]}>
                <MaterialCommunityIcons name={getMealConfig(meal.type).icon as any} size={24} color={Colors.textPrimary} />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealType}>{meal.type}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesText}>{meal.calories}</Text>
                <TouchableOpacity onPress={() => handleMealPress(meal)}>
                    <Ionicons name="add-circle" size={28} color={Colors.ButtonPink} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.tipContainer}>
             <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={Colors.DietButton} />
             <Text style={styles.tipText}>Tip: Drink a glass of water before every meal to stay hydrated and improve digestion.</Text>
          </View>

          <GlowButton
            title="Customize Plan"
            onPress={() => setCustomizeModalVisible(true)}
            style={{ marginTop: verticalScale(20) }}
          />

        </ScrollView>

        <CustomModal
            visible={modalVisible}
            title={selectedMeal?.name || "Meal Details"}
            message={selectedMeal ? `${selectedMeal.calories} - ${selectedMeal.time}\n\n${selectedMeal.details}` : ""}
            onClose={() => setModalVisible(false)}
            iconName="restaurant"
            buttonText="Close"
        />

        <CustomModal
            visible={customizeModalVisible}
            title="Customize Plan"
            message="This feature will allow you to swap meals and adjust calorie goals based on your preferences."
            onClose={() => setCustomizeModalVisible(false)}
            iconName="settings"
            buttonText="Got it"
        />
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  headerTitle: {
      fontSize: textScale(24),
  },
  scrollContent: {
    paddingBottom: 80,
  },
  summaryCard: {
    borderRadius: ms(20),
    padding: ms(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(25),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: textScale(14),
    marginBottom: verticalScale(5),
  },
  summaryValue: {
    color: "white",
    fontSize: textScale(22),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  progressBarContainer: {
    width: horizontalScale(150),
    height: verticalScale(6),
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: ms(3),
    marginBottom: verticalScale(8),
  },
  progressBarFill: {
    width: "75%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: ms(3),
  },
  summarySubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: textScale(12),
  },
  waterContainer: {
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: ms(10),
      borderRadius: ms(15)
  },
  waterText: {
      color: 'white',
      fontWeight: 'bold',
      marginTop: verticalScale(4)
  },
  sectionTitle: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(15),
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(16),
    padding: ms(15),
    marginBottom: verticalScale(15),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(12),
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
    marginBottom: verticalScale(2),
  },
  mealName: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(2),
  },
  mealTime: {
    fontSize: textScale(12),
    color: Colors.textMuted,
  },
  caloriesContainer: {
    alignItems: "flex-end",
  },
  caloriesText: {
    fontSize: textScale(14),
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: verticalScale(5),
  },
  tipContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.StatusFair,
      padding: ms(15),
      borderRadius: ms(12),
      alignItems: 'center',
      marginTop: verticalScale(10)
  },
  tipText: {
      flex: 1,
      marginLeft: horizontalScale(10),
      color: Colors.StatusFairText,
      fontSize: textScale(13)
  }
});

export default DietPlanScreen;
