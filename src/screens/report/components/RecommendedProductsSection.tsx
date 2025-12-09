import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { verticalScale, textScale, ms, horizontalScale } from "../../../utils/SizeScalingUtility";
import Colors from "../../../utils/Colors";
import { Card, GlowButton } from "@/src/components";

interface Product {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  category: string;
}

// UI Configuration - maps product categories to their visual styling
const CATEGORY_UI_CONFIG: Record<string, {
  imageIcon: string;
  imageIconType: "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
  imageBg: string;
  iconColor: string;
}> = {
  "Cleanser": {
    imageIcon: "water-outline",
    imageIconType: "Ionicons",
    imageBg: "#E3F2FD",
    iconColor: "#1976D2",
  },
  "Serum": {
    imageIcon: "flask",
    imageIconType: "FontAwesome5",
    imageBg: "#F3E5F5",
    iconColor: "#7B1FA2",
  },
  "Moisturizer": {
    imageIcon: "water",
    imageIconType: "Ionicons",
    imageBg: "#E0F7FA",
    iconColor: "#0097A7",
  },
  "Sunscreen": {
    imageIcon: "sunny",
    imageIconType: "Ionicons",
    imageBg: "#FFF3E0",
    iconColor: "#FF9800",
  },
  "Treatment": {
    imageIcon: "medical",
    imageIconType: "Ionicons",
    imageBg: "#FFEBEE",
    iconColor: "#C62828",
  },
};

interface RecommendedProductsSectionProps {
  products: Product[];
  onViewAll: () => void;
  onAdd: (product: Product) => void;
  addedProducts?: string[];
}

const RecommendedProductsSection: React.FC<RecommendedProductsSectionProps> = ({
  products,
  onViewAll,
  onAdd,
  addedProducts = [],
}) => {
  const renderIcon = (category: string) => {
    const uiConfig = CATEGORY_UI_CONFIG[category] || CATEGORY_UI_CONFIG["Moisturizer"];
    const { imageIcon, imageIconType, iconColor } = uiConfig;

    switch (imageIconType) {
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons name={imageIcon as any} size={30} color={iconColor} />
        );
      case "FontAwesome5":
        return <FontAwesome5 name={imageIcon as any} size={24} color={iconColor} />;
      default:
        return <Ionicons name={imageIcon as any} size={30} color={iconColor} />;
    }
  };

  // Show only first 2 products
  const displayProducts = products.slice(0, 2);

  return (
    <View style={styles.productsContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={styles.sectionTitle}>Recommended Products</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {displayProducts.map((item) => {
        const isAdded = addedProducts.includes(item.id);
        const uiConfig = CATEGORY_UI_CONFIG[item.category] || CATEGORY_UI_CONFIG["Moisturizer"];
        
        return (
          <Card key={item.id} style={styles.productCard}>
            <View style={[styles.productImageContainer, { backgroundColor: uiConfig.imageBg }]}>
              {renderIcon(item.category)}
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDesc}>{item.description}</Text>
              <View style={styles.ratingRow}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < Math.floor(item.rating) ? "star" : "star-outline"}
                    size={12}
                    color="#FFC107"
                  />
                ))}
                <Text style={styles.ratingText}>
                  {item.rating} ({item.reviews})
                </Text>
              </View>
            </View>
            <GlowButton
              title={isAdded ? "Added" : "Add"}
              onPress={() => onAdd(item)}
              disabled={isAdded}
              style={styles.addButton}
              textStyle={styles.addButtonText}
              gradientColors={isAdded ? [Colors.StatusGoodText, Colors.StatusGoodText] : undefined}
            />
          </Card>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  productsContainer: {
    marginBottom: verticalScale(20),
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
  productCard: {
    padding: ms(15),
    marginBottom: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
  },
  productImageContainer: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(12),
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
    marginTop: 0,
    paddingVertical: 0,
    backgroundColor: Colors.BlackColor,
    width: ms(80),
    height: ms(42),
  },
  addButtonText: {
    fontSize: textScale(12),
    color:Colors.WhiteColor
  },
});

export default RecommendedProductsSection;
