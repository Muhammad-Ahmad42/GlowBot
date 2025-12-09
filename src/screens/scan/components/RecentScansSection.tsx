import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ms, textScale, verticalScale, horizontalScale } from "../../../utils/SizeScalingUtility";
import Colors from "../../../utils/Colors";
import ScanHistoryItem from "./ScanHistoryItem";

interface RecentScansSectionProps {
  scans: any[]; // Replace 'any' with proper type from store/types
  onViewAllPress: () => void;
  onScanPress: (scan: any) => void;
}

const RecentScansSection: React.FC<RecentScansSectionProps> = ({ scans, onViewAllPress, onScanPress }) => {
  return (
    <View style={styles.recentScansContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 5 }}>
        {scans && scans.length > 0 ? (
          scans.slice(0, 5).map((scan, index) => (
            <ScanHistoryItem
              key={scan._id || index}
              date={new Date(scan.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              score={scan.analysis?.overall_score || 0}
              onPress={() => onScanPress(scan)}
            />
          ))
        ) : (
          <Text style={styles.noScansText}>No recent scans found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  noScansText: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
});

export default RecentScansSection;
