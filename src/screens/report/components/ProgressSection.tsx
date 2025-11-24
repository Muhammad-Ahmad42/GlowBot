import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { verticalScale, textScale, ms } from "../../../utils/SizeScalingUtility";
import Colors from "../../../utils/Colors";
import { Card } from "@/src/components";
import { useNavigation } from "@react-navigation/native";

const ProgressSection = () => {
  const navigation = useNavigation<any>();

  return (
    <Card style={styles.trackContainer}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Ionicons name="trending-up" size={20} color={Colors.StatusGoodText} />
        <Text style={[styles.sectionTitle, { marginLeft: 10 }]}>Track Your Progress</Text>
      </View>
      <View style={styles.trackRow}>
        <TouchableOpacity style={styles.trackItem} onPress={() => navigation.navigate("WeeklyScan")}>
          <View style={[styles.trackIconBg, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons name="calendar" size={20} color="#2E7D32" />
          </View>
          <Text style={styles.trackText}>Weekly Scans</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.trackItem}
          onPress={() => navigation.navigate("AllProducts", { filter: "added" })}
        >
          <View style={[styles.trackIconBg, { backgroundColor: "#E3F2FD" }]}>
            <MaterialCommunityIcons name="basket" size={24} color="#1565C0" />
          </View>
          <Text style={styles.trackText}>Added Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trackItem} onPress={() => navigation.navigate("Reminders")}>
          <View style={[styles.trackIconBg, { backgroundColor: "#F3E5F5" }]}>
            <Ionicons name="notifications" size={20} color="#7B1FA2" />
          </View>
          <Text style={styles.trackText}>Reminders</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  trackContainer: {
    padding: ms(20),
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
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

export default ProgressSection;
