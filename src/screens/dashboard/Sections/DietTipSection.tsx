import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/src/utils/Colors";
import { ms, textScale, verticalScale } from "@/src/utils/SizeScalingUtility";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlowButton from "@/src/components/GlowButton";
import { DIET_ITEMS_CONFIG, CATEGORY_CONFIG, getDietItemConfig } from "@/src/store/DietStore";

interface Props {
  title: string;
  mainTip: string;
  description: string;
  category: string;
  items: string[];
  onPressButton?: () => void;
}

const DietTipSection: React.FC<Props> = ({
  title,
  mainTip,
  description,
  category,
  items,
  onPressButton = () => {},
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons name="lightbulb-on" size={20} color="#FBC02D" />
      </View>

      <View style={styles.mainTipRow}>
        <View style={styles.mainIconContainer}>
          <MaterialCommunityIcons
            name={CATEGORY_CONFIG[category] as any || "food-apple"}
            size={30}
            color={Colors.DietButton}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.mainTipTitle}>{mainTip}</Text>
          <Text style={styles.mainTipDesc}>{description}</Text>
        </View>
      </View>

      <View style={styles.itemsRow}>
        {items.slice(0, 3).map((itemName, index) => {
          const config = getDietItemConfig(itemName);
          return (
            <View key={index} style={styles.itemContainer}>
              <MaterialCommunityIcons
                name={config.icon as any}
                size={20}
                color={config.color}
                style={{ marginBottom: 5 }}
              />
              <Text style={styles.itemText}>{itemName}</Text>
            </View>
          );
        })}
      </View>

      <GlowButton
        title="Get Personalized Plan"
        onPress={onPressButton}
        gradientColors={[Colors.DietButton, Colors.DietButton]}
      />
    </View>
  );
};

export default DietTipSection;

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(20),
    padding: ms(20),
    elevation: 2,
    marginBottom: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  mainTipRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  mainIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.DietIconBg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  mainTipTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mainTipDesc: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
  },
  itemsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemContainer: {
    width: "30%",
    backgroundColor: Colors.ActivityIconBg,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  itemText: {
    fontSize: textScale(12),
    color: Colors.textPrimary,
  },
});
