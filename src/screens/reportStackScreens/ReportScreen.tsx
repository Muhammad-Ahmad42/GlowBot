import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Header, SafeScreen } from "../../components";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import {
  horizontalScale,
  ms,
  textScale,
  verticalScale,
} from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";

const ReportScreen = () => {
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
          onRightIconPress={() => { }}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Overall Score Card */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View>
                <Text style={styles.scoreTitle}>Overall Skin Score</Text>
                <Text style={styles.scoreSubtitle}>Based on AI analysis</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.scoreValue}>78</Text>
                <Text style={styles.scoreLabel}>Good</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={["#FF5252", "#FFEB3B", "#4CAF50"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressBar}
              />
              <View style={[styles.progressIndicator, { left: '78%' }]} />
            </View>
            <View style={styles.scoreLabels}>
              <Text style={styles.scoreMinMax}>Poor</Text>
              <Text style={styles.scoreMinMax}>Excellent</Text>
            </View>
          </View>

          {/* Skin Condition Analysis (Donut Chart Mock) */}
          <View style={styles.chartCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="chart-pie" size={20} color={Colors.ButtonPink} />
              <Text style={styles.sectionTitle}>Skin Condition Analysis</Text>
            </View>

            <View style={styles.chartContainer}>
              {/* Mock Donut Chart using border radius trick or Views */}
              <View style={styles.donutChart}>
                <View style={[styles.donutSegment, { borderTopColor: '#4CAF50', transform: [{ rotate: '45deg' }] }]} />
                <View style={[styles.donutSegment, { borderRightColor: '#FF5252', transform: [{ rotate: '135deg' }] }]} />
                <View style={[styles.donutSegment, { borderBottomColor: '#FFC107', transform: [{ rotate: '225deg' }] }]} />
                <View style={[styles.donutSegment, { borderLeftColor: '#448AFF', transform: [{ rotate: '315deg' }] }]} />
                <View style={styles.donutHole} />
              </View>
            </View>

            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Healthy</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF5252' }]} />
                <Text style={styles.legendText}>Acne</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.legendText}>Pigmentation</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#448AFF' }]} />
                <Text style={styles.legendText}>Dullness</Text>
              </View>
            </View>
          </View>

          {/* Detailed Analysis */}
          <View style={styles.detailsCard}>
            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>Detailed Analysis</Text>

            <View style={styles.detailRow}>
              <View style={[styles.detailIconBg, { backgroundColor: '#FFEBEE' }]}>
                <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>!</Text>
              </View>
              <View style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>Acne</Text>
                  <Text style={[styles.detailValue, { color: '#D32F2F' }]}>65</Text>
                </View>
                <Text style={styles.detailSubtitle}>Moderate concern</Text>
                <View style={styles.detailBarBg}>
                  <View style={[styles.detailBarFill, { width: '65%', backgroundColor: '#D32F2F' }]} />
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIconBg, { backgroundColor: '#FFF8E1' }]}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FBC02D' }} />
              </View>
              <View style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>Pigmentation</Text>
                  <Text style={[styles.detailValue, { color: '#FBC02D' }]}>45</Text>
                </View>
                <Text style={styles.detailSubtitle}>Mild spots detected</Text>
                <View style={styles.detailBarBg}>
                  <View style={[styles.detailBarFill, { width: '45%', backgroundColor: '#FBC02D' }]} />
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIconBg, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="moon" size={16} color="#1976D2" />
              </View>
              <View style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>Dullness</Text>
                  <Text style={[styles.detailValue, { color: '#1976D2' }]}>55</Text>
                </View>
                <Text style={styles.detailSubtitle}>Low radiance</Text>
                <View style={styles.detailBarBg}>
                  <View style={[styles.detailBarFill, { width: '55%', backgroundColor: '#1976D2' }]} />
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIconBg, { backgroundColor: '#E0F7FA' }]}>
                <Ionicons name="water" size={16} color="#0097A7" />
              </View>
              <View style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>Hydration</Text>
                  <Text style={[styles.detailValue, { color: '#0097A7' }]}>85</Text>
                </View>
                <Text style={styles.detailSubtitle}>Well moisturized</Text>
                <View style={styles.detailBarBg}>
                  <View style={[styles.detailBarFill, { width: '85%', backgroundColor: '#0097A7' }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Recommended Products */}
          <View style={styles.productsContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Recommended Products</Text>
              <Text style={styles.viewAllText}>View All</Text>
            </View>

            <View style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <MaterialCommunityIcons name="bottle-tonic" size={30} color="#1976D2" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>Gentle Cleanser</Text>
                <Text style={styles.productDesc}>For acne-prone skin</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Ionicons name="star-half" size={12} color="#FFC107" />
                  <Text style={styles.ratingText}>4.8 (120)</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.productCard}>
              <View style={[styles.productImageContainer, { backgroundColor: '#F3E5F5' }]}>
                <FontAwesome5 name="flask" size={24} color="#7B1FA2" />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>Brightening Serum</Text>
                <Text style={styles.productDesc}>Reduces pigmentation</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Ionicons name="star" size={12} color="#FFC107" />
                  <Ionicons name="star-half" size={12} color="#FFC107" />
                  <Text style={styles.ratingText}>4.5 (89)</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Expert Advice Banner */}
          <LinearGradient
            colors={["#E040FB", "#FF4081"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.expertBanner}
          >
            <View style={styles.expertIconCircle}>
              <FontAwesome5 name="user-md" size={24} color="white" />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
              <Text style={styles.expertTitle}>Get Expert Advice</Text>
              <Text style={styles.expertSubtitle}>Consult with certified dermatologists</Text>
            </View>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Track Progress */}
          <View style={styles.trackContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Ionicons name="trending-up" size={20} color={Colors.StatusGoodText} />
              <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>Track Your Progress</Text>
            </View>
            <View style={styles.trackRow}>
              <View style={styles.trackItem}>
                <View style={[styles.trackIconBg, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="calendar" size={20} color="#2E7D32" />
                </View>
                <Text style={styles.trackText}>Weekly Scans</Text>
              </View>
              <View style={styles.trackItem}>
                <View style={[styles.trackIconBg, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialCommunityIcons name="history" size={24} color="#1565C0" />
                </View>
                <Text style={styles.trackText}>View History</Text>
              </View>
              <View style={styles.trackItem}>
                <View style={[styles.trackIconBg, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="notifications" size={20} color="#7B1FA2" />
                </View>
                <Text style={styles.trackText}>Reminders</Text>
              </View>
            </View>
          </View>

        </ScrollView>
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
  },
  scoreCard: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(15),
  },
  scoreTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  scoreSubtitle: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
  },
  scoreValue: {
    fontSize: textScale(24),
    fontWeight: "bold",
    color: "#4CAF50",
  },
  scoreLabel: {
    fontSize: textScale(12),
    color: "#4CAF50",
    fontWeight: "600",
  },
  progressBarContainer: {
    height: verticalScale(10),
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    marginBottom: verticalScale(8),
    position: 'relative',
    justifyContent: 'center',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    opacity: 0.8,
  },
  progressIndicator: {
    position: 'absolute',
    width: 4,
    height: 16,
    backgroundColor: 'black',
    borderRadius: 2,
  },
  scoreLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scoreMinMax: {
    fontSize: textScale(10),
    color: Colors.textMuted,
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginLeft: horizontalScale(8),
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  donutChart: {
    width: ms(150),
    height: ms(150),
    borderRadius: ms(75),
    borderWidth: 15,
    borderColor: 'transparent',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutSegment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: ms(75),
    borderWidth: 15,
    borderColor: 'transparent',
  },
  donutHole: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    backgroundColor: 'white',
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: verticalScale(20),
  },
  detailIconBg: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
  },
  detailContent: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(2),
  },
  detailTitle: {
    fontSize: textScale(14),
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  detailValue: {
    fontSize: textScale(14),
    fontWeight: "bold",
  },
  detailSubtitle: {
    fontSize: textScale(12),
    color: Colors.textMuted,
    marginBottom: verticalScale(6),
  },
  detailBarBg: {
    height: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 3,
  },
  detailBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  productsContainer: {
    marginBottom: verticalScale(20),
  },
  viewAllText: {
    fontSize: textScale(14),
    color: Colors.ButtonPink,
    fontWeight: "600",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: ms(15),
    padding: ms(15),
    marginBottom: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  productImageContainer: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(12),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: textScale(14),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  productDesc: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
    marginBottom: verticalScale(4),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: textScale(10),
    color: Colors.textMuted,
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: Colors.ButtonPink,
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(6),
    borderRadius: ms(8),
  },
  addButtonText: {
    color: "white",
    fontSize: textScale(12),
    fontWeight: "bold",
  },
  expertBanner: {
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    flexDirection: "row",
    alignItems: "center",
  },
  expertIconCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  expertTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: "white",
  },
  expertSubtitle: {
    fontSize: textScale(12),
    color: "rgba(255,255,255,0.9)",
  },
  bookButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: ms(20),
  },
  bookButtonText: {
    color: "white",
    fontSize: textScale(12),
    fontWeight: "bold",
  },
  trackContainer: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    elevation: 2,
  },
  trackRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackItem: {
    alignItems: "center",
    width: "30%",
  },
  trackIconBg: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  trackText: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
    textAlign: "center",
  },
});

