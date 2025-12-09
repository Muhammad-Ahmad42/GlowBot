import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Header, SafeScreen } from "../../components";
import { useReportStore } from "../../store/ReportStore";
import { useAuthStore } from "../../store/AuthStore";
import ScanHistoryItem from "./components/ScanHistoryItem";
import Colors from "../../utils/Colors";
import { ms, horizontalScale, verticalScale } from "../../utils/SizeScalingUtility";

const AllScansScreen = () => {
  const navigation = useNavigation();
  const { scanHistory, fetchScanHistory } = useReportStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.uid) {
      fetchScanHistory(user.uid);
    }
  }, [user]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <ScanHistoryItem
        date={new Date(item.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        score={item.analysis?.overall_score || 0}
        onPress={() => {
            // Navigate to report with this scan data if needed, 
            // or just show details. For now, maybe just alert or log.
            // Ideally navigate to ReportScreen with scan ID or data.
            // navigation.navigate("Report", { scanData: item });
        }}
      />
      <View style={styles.itemDetails}>
         <Text style={styles.itemTime}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
         <Text style={styles.itemSummary}>
            Acne: {item.analysis?.Acne || 0} | Pigmentation: {item.analysis?.Pigmentation || 0}
         </Text>
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="All Scans"
          subTitle="Your Skin History"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        
        <FlatList
          data={scanHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No scan history found.</Text>
            </View>
          }
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
  listContent: {
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(10),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    backgroundColor: 'white',
    padding: ms(10),
    borderRadius: ms(15),
    elevation: 1,
  },
  itemDetails: {
    marginLeft: horizontalScale(15),
    flex: 1,
  },
  itemTime: {
    fontSize: ms(14),
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  itemSummary: {
    fontSize: ms(12),
    color: Colors.textSecondary,
    marginTop: verticalScale(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(50),
  },
  emptyText: {
    fontSize: ms(16),
    color: Colors.textSecondary,
  },
});

export default AllScansScreen;
