import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Header, SafeScreen } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import { horizontalScale, ms } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useReportStore } from "../../store/ReportStore";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import OverallScoreSection from "./components/OverallScoreSection";
import SkinConditionSection from "./components/SkinConditionSection";
import DetailedAnalysisSection from "./components/DetailedAnalysisSection";
import RecommendedProductsSection from "./components/RecommendedProductsSection";
import ExpertAdviceSection from "./components/ExpertAdviceSection";
import ProgressSection from "./components/ProgressSection";
import CustomModal from "@/src/components/CustomModal";

const ReportScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const {
    overallScore,
    skinAnalysis,
    recommendedProducts,
    addProduct,
    addedProducts,
    fetchUserProducts,
    fetchLatestReport,
  } = useReportStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const userId = user?.uid || "anonymous";
      fetchUserProducts(userId);
      // Also fetch latest report to ensure recommendations are shown if app was restarted
      fetchLatestReport(userId);
    }, [user?.uid])
  );

  const handleAddProduct = (product: any) => {
    const userId = user?.uid || "anonymous";
    addProduct(product.id, userId);
    setSelectedProduct(product);
    setModalVisible(true);
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Skin Analysis"
          subTitle="Detailed Report"
          rightIcon={
            <View style={styles.shareIcon}>
              <Ionicons name="share-social" size={20} color={Colors.textSecondary} />
            </View>
          }
          onRightIconPress={() => {}}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Overall Score Card */}
          <OverallScoreSection score={overallScore} />

          {/* Skin Condition Analysis (Donut Chart) */}
          <SkinConditionSection skinAnalysis={skinAnalysis} />

          {/* Detailed Analysis */}
          <DetailedAnalysisSection skinAnalysis={skinAnalysis} />

          {/* Recommended Products */}
          <RecommendedProductsSection
            products={recommendedProducts}
            onViewAll={() => navigation.navigate("AllProducts")}
            onAdd={handleAddProduct}
            addedProducts={addedProducts}
          />

          {/* Expert Advice Banner */}
          <ExpertAdviceSection onBookNow={() => navigation.navigate("ExpertBooking")} />

          {/* Track Progress */}
          <ProgressSection />
        </ScrollView>

        <CustomModal
          visible={modalVisible}
          title="Product Added"
          message={`${selectedProduct?.name} has been added to your routine.`}
          onClose={() => setModalVisible(false)}
          iconName="checkmark-circle"
          iconColor={Colors.StatusGoodText}
          buttonText="Got it"
        />
      </View>
    </SafeScreen>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  shareIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
