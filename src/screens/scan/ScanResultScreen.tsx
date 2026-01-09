import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { SafeScreen, Header, CustomLoader, ScoreCard, MealCard, FoodCategoryCard } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useReportStore } from "../../store/ReportStore";
import { useProductStore } from "../../store/ProductStore";
import { useAuthStore } from "../../store/AuthStore";
import { useDietStore } from "../../store/DietStore";
import { RootStackParamList } from "../../types/navigation";
type ScanResultRouteProp = RouteProp<RootStackParamList, "ScanResult">;
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

  // Icon and color now come from backend data (meal.icon, meal.color)

  const meals = activePlan?.meals || [];
  const displayMeals = meals.slice(0, 4);


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
                icon={meal.icon}
                color={meal.color}
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
              {(!activePlan?.foodCategories || activePlan.foodCategories.length === 0) ? (
                 <Text style={{color: 'white', textAlign: 'center', width: '100%', marginTop: 10}}>
                   Generating food recommendations...
                 </Text>
              ) : (
                activePlan.foodCategories.map((category: any, index: number) => (
                  <FoodCategoryCard key={index} category={category} />
                ))
              )}
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
                    <View style={styles.productIconContainer}>
                       <MaterialCommunityIcons name="bottle-tonic-plus-outline" size={24} color={Colors.ButtonPink} />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                      <Text style={styles.productCategory}>{product.category}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              navigation.navigate("Report", { screen: "ReportScreen" });
            }}
          >
            <LinearGradient
              colors={[Colors.GradientOrangeStart, Colors.GradientOrangeEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>View Full Report</Text>
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
    borderRadius: ms(12),
    marginRight: horizontalScale(12),
    width: ms(130),
    padding: ms(10),
    elevation: 2,
    shadowColor: Colors.ButtonPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 64, 129, 0.08)",
  },
  productIconContainer: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    backgroundColor: "rgba(255, 64, 129, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: textScale(12),
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: verticalScale(2),
    height: verticalScale(32),
  },
  productCategory: {
    fontSize: textScale(10),
    color: Colors.textSecondary,
    marginBottom: verticalScale(4),
  },
});

export default ScanResultScreen;
