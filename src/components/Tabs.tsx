import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../utils/Colors";
import {
  horizontalScale,
  ms,
  textScale,
  verticalScale,
} from "../utils/SizeScalingUtility";

interface Props {
  tabs: { name: string; icon: string }[];
  activeTab: string;
  onChange: (tab: string) => void;
}

const Tabs: React.FC<Props> = ({ tabs, activeTab, onChange }) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[styles.tabItem, activeTab === tab.name && styles.activeTabItem]}
          onPress={() => onChange(tab.name)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={tab.icon as keyof typeof Ionicons.glyphMap}
            size={20}
            color={activeTab === tab.name ? "white" : Colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === tab.name && styles.activeTabText]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Tabs;
const styles=StyleSheet.create({
      tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(25),
    backgroundColor: Colors.WhiteColor,
    padding: ms(10),
    borderRadius: ms(15),
    elevation: 2,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: ms(12),
  },
  activeTabItem: {
    backgroundColor: Colors.TabActivePink,
  },
  tabText: {
    marginTop: verticalScale(4),
    fontSize: textScale(12),
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
})
