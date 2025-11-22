import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import {
  horizontalScale,
  ms,
  textScale,
  verticalScale,
} from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Header, SafeScreen } from "@/src/components";

const ScanScreen = () => {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  const handleScanPress = async () => {
    try {
      // Check permissions
      if (!permission?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Permission Required",
            "Please grant camera permission to scan your skin."
          );
          return;
        }
      }

      // Launch Camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Navigate to Report Screen with the image uri (mocking analysis)
        navigation.navigate("ReportStackScreens", { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.log("Error launching camera:", error);
      Alert.alert("Error", "Could not open camera.");
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Skin Scan"
          subTitle="AI-Powered Analysis"
          rightIcon={
            <View style={styles.helpIcon}>
              <Text style={styles.helpText}>?</Text>
            </View>
          }
          onRightIconPress={() => { }}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Scan Tips */}
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <MaterialCommunityIcons name="lightbulb-on" size={18} color="#FBC02D" />
              <Text style={styles.tipsTitle}>Scan Tips</Text>
            </View>
            <View style={styles.tipsRow}>
              <View style={styles.tipItem}>
                <View style={[styles.tipIconBg, { backgroundColor: "#E3F2FD" }]}>
                  <Ionicons name="sunny" size={20} color="#1976D2" />
                </View>
                <Text style={styles.tipText}>Good lighting</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={[styles.tipIconBg, { backgroundColor: "#E8F5E9" }]}>
                  <Ionicons name="happy" size={20} color="#388E3C" />
                </View>
                <Text style={styles.tipText}>Clean face</Text>
              </View>
              <View style={styles.tipItem}>
                <View style={[styles.tipIconBg, { backgroundColor: "#F3E5F5" }]}>
                  <Ionicons name="phone-portrait" size={20} color="#7B1FA2" />
                </View>
                <Text style={styles.tipText}>Hold steady</Text>
              </View>
            </View>
          </View>

          {/* Main Action: Shutter Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={handleScanPress}
            >
              <View style={styles.shutterInner}>
                <Ionicons name="camera" size={32} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={styles.actionText}>Tap to Start Scan</Text>
          </View>

          {/* Recent Scans */}
          <View style={styles.recentScansContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Scans</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 5 }}>
              <View style={[styles.scanCard, { backgroundColor: Colors.StatusGood }]}>
                <View style={styles.scanIconContainer}>
                  <Ionicons name="checkmark" size={16} color={Colors.StatusGoodText} />
                </View>
                <Text style={styles.scanDate}>Today</Text>
              </View>

              <View style={[styles.scanCard, { backgroundColor: Colors.StatusFair }]}>
                <View style={styles.scanIconContainer}>
                  <Text style={{ color: Colors.StatusFairText, fontWeight: 'bold' }}>!</Text>
                </View>
                <Text style={styles.scanDate}>2 days</Text>
              </View>

              <View style={[styles.scanCard, { backgroundColor: "#E3F2FD" }]}>
                <View style={styles.scanIconContainer}>
                  <Text style={{ color: "#1976D2", fontWeight: 'bold' }}>i</Text>
                </View>
                <Text style={styles.scanDate}>1 week</Text>
              </View>
              <View style={[styles.scanCard, { backgroundColor: "#F3E5F5", width: 40 }]} />
            </ScrollView>
          </View>

          {/* Premium Banner */}
          <LinearGradient
            colors={[Colors.GradientOrangeStart, Colors.GradientOrangeEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBanner}
          >
            <View style={styles.premiumContent}>
              <View style={styles.premiumIconCircle}>
                <Text style={{ color: "white", fontSize: 18 }}>?</Text>
              </View>
              <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <Text style={styles.premiumTitle}>Get Premium Analysis</Text>
                <Text style={styles.premiumSubtitle}>Unlock detailed reports & recommendations</Text>
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  helpIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  helpText: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.textSecondary,
  },
  tipsContainer: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(15),
    marginBottom: verticalScale(30),
    marginTop: verticalScale(10),
    elevation: 2,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  tipsTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginLeft: horizontalScale(8),
  },
  tipsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipItem: {
    alignItems: "center",
    width: "30%",
  },
  tipIconBg: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  tipText: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
    textAlign: "center",
  },
  actionContainer: {
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  shutterButton: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
    backgroundColor: "rgba(255, 64, 129, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  shutterInner: {
    width: ms(70),
    height: ms(70),
    borderRadius: ms(35),
    backgroundColor: Colors.ButtonPink,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  actionText: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  recentScansContainer: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontSize: textScale(14),
    color: Colors.ButtonPink,
    fontWeight: "600",
  },
  scanCard: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(15),
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
  },
  scanIconContainer: {
    marginBottom: verticalScale(5),
  },
  scanDate: {
    fontSize: textScale(12),
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  premiumBanner: {
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  premiumIconCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  premiumTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: "white",
  },
  premiumSubtitle: {
    fontSize: textScale(12),
    color: "rgba(255,255,255,0.9)",
  },
  upgradeButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: ms(20),
  },
  upgradeText: {
    color: "white",
    fontSize: textScale(12),
    fontWeight: "bold",
  },
});
