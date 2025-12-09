import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { SafeScreen, Header, CustomModal, MealCard } from "@/src/components";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../utils/Colors";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import { LinearGradient } from "expo-linear-gradient";
import { useDietStore } from "../../store/DietStore";
import { useReportStore } from "../../store/ReportStore";
import { useAuthStore } from "../../store/AuthStore";
import { DietMeal } from "@/src/types/DashboardDataTypes";

const DietPlanScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { plans, activePlan, loading, fetchPlans, updateMeal, setActivePlan } = useDietStore();
  const { skinAnalysis } = useReportStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DietMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(-1);
  
  const [editForm, setEditForm] = useState<DietMeal>({
    type: "",
    time: "",
    name: "",
    calories: "",
    details: ""
  });

  const calculateDailyGoals = () => {
    let waterGoal = 2.0;
    let message = "You're doing great! Keep it up.";
    let calorieGoal = 2000;

    // Default values if no analysis
    if (!skinAnalysis) return { waterGoal, message, calorieGoal };

    // Hydration Logic
    if ((skinAnalysis.Hydration || 0) < 50) {
        waterGoal += 0.5;
        message = "Hydration is low! Boost your water intake.";
    }

    // Acne Logic
    if ((skinAnalysis.Acne || 0) > 50) {
        waterGoal += 0.5; // Flush toxins
        if (message === "You're doing great! Keep it up.") {
            message = "Stay hydrated to help clear your skin.";
        }
    }
    
    // Dullness Logic
    if ((skinAnalysis.Dullness || 0) > 50 && message === "You're doing great! Keep it up.") {
         message = "Eat colorful fruits for that glow!";
    }

    return { waterGoal, message, calorieGoal };
  };

  const { waterGoal, message, calorieGoal } = calculateDailyGoals();


  useEffect(() => {
    const userId = user?.uid || "TEST_USER_123";
    fetchPlans(userId);
  }, []);

  // Icon and color now come from backend data (meal.icon, meal.color)

  const handleMealPress = (meal: DietMeal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const handleEditPress = (meal: DietMeal, index: number) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setEditForm(meal);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!activePlan?._id) return;
    
    try {
      await updateMeal(activePlan._id, selectedMealIndex, editForm);
      setEditModalVisible(false);
      Alert.alert("Success", "Meal updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update meal");
    }
  };

  const currentPlan = activePlan || (plans.length > 0 ? plans[0] : null);
  const meals = currentPlan?.meals || [];

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
          {plans.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.planSelector}>
              {plans.map((plan, index) => (
                <TouchableOpacity
                  key={plan._id || index}
                  style={[styles.planTab, activePlan?._id === plan._id && styles.planTabActive]}
                  onPress={() => setActivePlan(plan)}
                >
                  <Text style={[styles.planTabText, activePlan?._id === plan._id && styles.planTabTextActive]}>
                    {plan.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <LinearGradient
            colors={[Colors.GradientOrangeStart, Colors.GradientOrangeEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View>
              <Text style={styles.summaryTitle}>Today's Goal</Text>
              <Text style={styles.summaryValue}>{`1500 / ${calorieGoal} kcal`}</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarFill} />
              </View>
              <Text style={styles.summarySubtitle}>{message}</Text>
            </View>
            <View style={styles.waterContainer}>
              <MaterialCommunityIcons name="water" size={24} color="white" />
              <Text style={styles.waterText}>{`${waterGoal}L`}</Text>
            </View>
          </LinearGradient>

          <Text style={styles.sectionTitle}>Today's Meals</Text>

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : meals.length === 0 ? (
            <Text style={styles.emptyText}>No meals in this plan</Text>
          ) : (
            meals.map((meal, index) => (
              <MealCard
                key={index}
                meal={meal}
                icon={meal.icon!}
                color={meal.color!}
                onPress={() => handleMealPress(meal)}
                RightComponent={
                  <View style={styles.caloriesContainer}>
                    <Text style={styles.caloriesText}>{meal.calories}</Text>
                    <TouchableOpacity onPress={() => handleEditPress(meal, index)}>
                      <Ionicons name="create-outline" size={24} color={Colors.ButtonPink} />
                    </TouchableOpacity>
                  </View>
                }
              />
            ))
          )}

          <View style={styles.tipContainer}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={Colors.DietButton} />
            <Text style={styles.tipText}>
              {currentPlan?.tip?.mainTip 
                ? `Tip: ${currentPlan.tip.mainTip} - ${currentPlan.tip.description}`
                : "Tip: Drink a glass of water before every meal to stay hydrated."}
            </Text>
          </View>
        </ScrollView>

        <CustomModal
          visible={modalVisible}
          title={selectedMeal?.name || "Meal Details"}
          message={selectedMeal ? `${selectedMeal.calories} - ${selectedMeal.time}\n\n${selectedMeal.details}` : ""}
          onClose={() => setModalVisible(false)}
          iconName="restaurant"
          buttonText="Close"
        />

        {editModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.editModal}>
              <Text style={styles.editModalTitle}>Edit Meal</Text>
              
              <Text style={styles.inputLabel}>Meal Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                placeholder="e.g., Oatmeal with Berries"
              />

              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                value={editForm.time}
                onChangeText={(text) => setEditForm({ ...editForm, time: text })}
                placeholder="e.g., 8:00 AM"
              />

              <Text style={styles.inputLabel}>Calories</Text>
              <TextInput
                style={styles.input}
                value={editForm.calories}
                onChangeText={(text) => setEditForm({ ...editForm, calories: text })}
                placeholder="e.g., 350 kcal"
              />

              <Text style={styles.inputLabel}>Details</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editForm.details}
                onChangeText={(text) => setEditForm({ ...editForm, details: text })}
                placeholder="Meal details..."
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
  planSelector: {
    marginBottom: verticalScale(15),
  },
  planTab: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(10),
    borderRadius: ms(20),
    backgroundColor: Colors.WhiteColor,
    marginRight: horizontalScale(10),
  },
  planTabActive: {
    backgroundColor: Colors.ButtonPink,
  },
  planTabText: {
    color: Colors.textPrimary,
    fontSize: textScale(14),
    fontWeight: "600",
  },
  planTabTextActive: {
    color: Colors.WhiteColor,
  },
  summaryCard: {
    borderRadius: ms(20),
    padding: ms(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(25),
    elevation: 4,
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
  loadingText: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginTop: verticalScale(20),
  },
  emptyText: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginTop: verticalScale(20),
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
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  editModal: {
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(20),
    padding: ms(20),
    width: "90%",
    maxHeight: "80%",
  },
  editModalTitle: {
    fontSize: textScale(20),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(20),
    textAlign: "center",
  },
  inputLabel: {
    fontSize: textScale(14),
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: verticalScale(5),
    marginTop: verticalScale(10),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.textMuted,
    borderRadius: ms(10),
    padding: ms(12),
    fontSize: textScale(14),
    color: Colors.textPrimary,
  },
  textArea: {
    height: verticalScale(80),
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(20),
  },
  modalButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: ms(10),
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.textMuted,
    marginRight: horizontalScale(10),
  },
  saveButton: {
    backgroundColor: Colors.ButtonPink,
  },
  cancelButtonText: {
    color: Colors.WhiteColor,
    fontSize: textScale(14),
    fontWeight: "600",
  },
  saveButtonText: {
    color: Colors.WhiteColor,
    fontSize: textScale(14),
    fontWeight: "600",
  },
});

export default DietPlanScreen;
