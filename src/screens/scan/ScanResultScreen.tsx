import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { SafeScreen, Header, CustomLoader } from "@/src/components";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useReportStore } from "../../store/ReportStore";
import { useProductStore } from "../../store/ProductStore";
import { useAuthStore } from "../../store/AuthStore";
import { useDietStore } from "../../store/DietStore";
import { RootStackParamList } from "../../types/navigation";

// Type definition for route props
type ScanResultRouteProp = RouteProp<RootStackParamList, "ScanResult">;

// ScoreCard component for displaying overall skin health score
const ScoreCard = ({ overallScore, skinAnalysis }: { overallScore: number; skinAnalysis: any }) => (
  <LinearGradient
    colors={['#EC4899', '#8B5CF6']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.scoreCard}
  >
    <View style={styles.scoreCircle}>
      <Text style={styles.scoreValue}>{overallScore || 0}</Text>
      <Text style={styles.scoreLabel}>Score</Text>
    </View>
    <View style={styles.metricsRow}>
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Hydration</Text>
        <Text style={styles.metricValue}>{skinAnalysis?.Hydration ?? 0}%</Text>
      </View>
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Acne</Text>
        <Text style={styles.metricValue}>{skinAnalysis?.Acne ?? 0}%</Text>
      </View>
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>Dullness</Text>
        <Text style={styles.metricValue}>{skinAnalysis?.Dullness ?? 0}%</Text>
      </View>
    </View>
  </LinearGradient>
);

// MealCard component for displaying individual meal items
const MealCard = ({ meal, icon, color }: { meal: any; icon: string; color: string }) => (
  <View style={styles.mealCard}>
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
        {meal.calories && <Text style={styles.nutrientTag}>{meal.calories}</Text>}
      </View>
    </View>
  </View>
);

// FoodCategoryCard component for displaying food category recommendations
const FoodCategoryCard = ({ category }: { category: any }) => (
  <View style={[styles.foodCard, { backgroundColor: category.color }]}>
    <MaterialCommunityIcons name={category.icon as any} size={24} color="white" />
    <Text style={styles.foodTitle}>{category.title}</Text>
    <Text style={styles.foodItems}>{category.items}</Text>
  </View>
);

const ScanResultScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ScanResultRouteProp>();
  const { user } = useAuthStore();
  const { overallScore, skinAnalysis,fetchLatestReport } = useReportStore();
  const { activePlan, fetchPlans, loading: dietLoading } = useDietStore();
  const { userRoutine, fetchUserProducts } = useProductStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScanData();
  }, []);

  const loadScanData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = user?.uid || "anonymous";
      
      await Promise.all([
        fetchLatestReport(userId),
        fetchPlans(userId),
        fetchUserProducts(userId)
      ]);
      
    } catch (err: any) {
      console.error("Error loading scan data:", err);
      setError("Failed to load your scan results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMealIcon = (type: string) => {
    const icons: Record<string, string> = {
      Breakfast: "food-croissant",
      Lunch: "food-drumstick",
      Snack: "food-apple",
      Dinner: "fish",
    };
    return icons[type] || "food";
  };

  const getMealColor = (type: string) => {
    const colors: Record<string, string> = {
      Breakfast: "#FFE5B4",
      Lunch: "#B4E5FF",
      Snack: "#FFF5B4",
      Dinner: "#E5B4FF",
    };
    return colors[type] || "#E0E0E0";
  };

  const meals = activePlan?.meals || [];
  const displayMeals = meals.slice(0, 4);

  const foodCategories = [
    {
      icon: "fish",
      title: "Omega-3\nRich",
      items: "Salmon, walnuts,\nchia seeds",
      color: "rgba(255, 255, 255, 0.15)"
    },
    {
      icon: "leaf",
      title: "Antioxidants",
      items: "Berries, green tea,\nspinach",
      color: "rgba(255, 255, 255, 0.15)"
    },
    {
      icon: "water",
      title: "Hydrating",
      items: "Cucumber,\nwatermelon,\ntomatoes",
      color: "rgba(255, 255, 255, 0.15)"
    },
    {
      icon: "carrot",
      title: "Vitamin A",
      items: "Carrots, sweet\npotato, kale",
      color: "rgba(255,255, 255, 0.15)"
    }
  ];

  if (loading) {
    return (
      <SafeScreen>
        <View style={styles.container}>
          <Header
            heading="Scan Results"
            subTitle="Please wait..."
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
          />
          <CustomLoader visible={true} />
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen>
        <View style={styles.container}>
          <Header
            heading="Scan Results"
            subTitle="Error"
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
          />
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={Colors.textSecondary} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadScanData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Scan Results"
          subTitle="Your personalized plan"
          showBackButton={true}
         onBackPress={() => navigation.goBack()}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <ScoreCard overallScore={overallScore} skinAnalysis={skinAnalysis} />

          <Text style={styles.sectionTitle}>Your Daily Plan</Text>
          
          {dietLoading ? (
            <View style={styles.centeredView}>
              <ActivityIndicator size="small" color={Colors.ButtonPink} />
              <Text style={styles.loadingText}>Loading meal plan...</Text>
            </View>
          ) : displayMeals.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="food-off" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No meal plan available</Text>
              <Text style={styles.emptySubtext}>AI is generating your personalized plan</Text>
            </View>
          ) : (
            displayMeals.map((meal: any, index: number) => (
              <MealCard
                key={index}
                meal={meal}
                icon={getMealIcon(meal.type)}
                color={getMealColor(meal.type)}
              />
            ))
          )}

          <LinearGradient
            colors={['#EC4899', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.foodsSection}
          >
            <View style={styles.foodsHeader}>
              <View style={styles.foodsIconCircle}>
                <MaterialCommunityIcons name="nutrition" size={24} color="white" />
              </View>
              <Text style={styles.foodsTitle}>Skin-Boosting Foods</Text>
            </View>

            <View style={styles.foodsGrid}>
              {(activePlan?.foodCategories || foodCategories).map((category: any, index: number) => (
                <FoodCategoryCard key={index} category={category} />
              ))}
            </View>
          </LinearGradient>

          {/* Recommended Products Section */}
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Recommended Products</Text>
            {userRoutine.filter((p: any) => p.status === 'Wishlist').length === 0 ? (
               <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No recommendations yet</Text>
               </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                {userRoutine.filter((p: any) => p.status === 'Wishlist').map((product: any, index: number) => (
                  <View key={index} style={styles.productCard}>
                    <View style={styles.productIcon}>
                      <MaterialCommunityIcons name="bottle-tonic" size={32} color={Colors.ButtonPink} />
                    </View>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    <View style={styles.productTag}>
                       <Text style={styles.productTagText}>Recommended</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate("DietPlan")}
          >
            <LinearGradient
              colors={[Colors.GradientOrangeStart, Colors.GradientOrangeEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>View Full Diet Plan</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: verticalScale(100),
  },
  centeredView: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: verticalScale(100),
  },
  errorText: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginTop: verticalScale(16),
    textAlign: "center",
    paddingHorizontal: horizontalScale(40),
  },
  retryButton: {
    marginTop: verticalScale(20),
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(12),
    backgroundColor: Colors.ButtonPink,
    borderRadius: ms(12),
  },
  retryText: {
    color: "white",
    fontSize: textScale(14),
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: ms(16),
    padding: ms(32),
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  emptyText: {
    fontSize: textScale(16),
    color: Colors.textPrimary,
    marginTop: verticalScale(12),
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
    marginTop: verticalScale(4),
    textAlign: "center",
  },
  scoreCard: {
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(25),
    elevation: 4,
  },
  scoreCircle: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: verticalScale(15),
  },
  scoreValue: {
    fontSize: textScale(36),
    fontWeight: "bold",
    color: "white",
  },
  scoreLabel: {
    fontSize: textScale(12),
    color: "rgba(255, 255, 255, 0.9)",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metricItem: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: textScale(12),
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: verticalScale(4),
  },
  metricValue: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: "white",
  },
  sectionTitle: {
    fontSize: textScale(20),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(15),
  },
  loadingText: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginTop: verticalScale(8),
  },
  mealCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: verticalScale(12),
    elevation: 2,
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
  foodsSection: {
    borderRadius: ms(20),
    padding: ms(20),
    marginTop: verticalScale(25),
    marginBottom: verticalScale(15),
  },
  foodsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  foodsIconCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(12),
  },
  foodsTitle: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: "white",
  },
  foodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
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
  actionButton: {
    borderRadius: ms(12),
    overflow: "hidden",
    marginTop: verticalScale(10),
  },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(16),
  },
  buttonText: {
    fontSize: textScale(16),
    fontWeight: "600",
    color: "white",
    marginRight: horizontalScale(8),
  },
  productsSection: {
    marginBottom: verticalScale(20),
  },
  productsScroll: {
    paddingRight: horizontalScale(20),
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: ms(16),
    padding: ms(12),
    marginRight: horizontalScale(12),
    width: ms(140),
    elevation: 2,
    alignItems: "center",
  },
  productIcon: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(12),
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  productName: {
    fontSize: textScale(13),
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: verticalScale(4),
    height: verticalScale(36),
  },
  productCategory: {
    fontSize: textScale(11),
    color: Colors.textSecondary,
    marginBottom: verticalScale(8),
  },
  productTag: {
    backgroundColor: Colors.ButtonPink,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(2),
    borderRadius: ms(4),
  },
  productTagText: {
    color: "white",
    fontSize: textScale(10),
    fontWeight: "bold",
  },
});

export default ScanResultScreen;
