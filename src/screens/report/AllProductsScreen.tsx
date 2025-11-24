import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Header, SafeScreen, Card, GlowButton } from "@/src/components";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useReportStore } from "../../store/ReportStore";
import CustomModal from "@/src/components/CustomModal";
import { useRoute, useNavigation } from "@react-navigation/native";

const AllProductsScreen = () => {
  const { recommendedProducts, addProduct, removeProduct, addedProducts } = useReportStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalType, setModalType] = useState<"add" | "remove">("add");
  const route = useRoute<any>();
  const navigation = useNavigation();
  const filter = route.params?.filter;

  const handleAddProduct = (product: any) => {
    addProduct(product.id);
    setSelectedProduct(product);
    setModalType("add");
    setModalVisible(true);
  };

  const handleRemoveProduct = (product: any) => {
    removeProduct(product.id);
    setSelectedProduct(product);
    setModalType("remove");
    setModalVisible(true);
  };

  const renderIcon = (item: any) => {
    switch (item.imageIconType) {
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons name={item.imageIcon as any} size={30} color={item.iconColor} />
        );
      case "FontAwesome5":
        return <FontAwesome5 name={item.imageIcon as any} size={24} color={item.iconColor} />;
      default:
        return <Ionicons name={item.imageIcon as any} size={30} color={item.iconColor} />;
    }
  };

  const displayedProducts =
    filter === "added"
      ? recommendedProducts.filter((p) => addedProducts.includes(p.id))
      : recommendedProducts;

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading={filter === "added" ? "Your Routine" : "Recommended Products"}
          subTitle={filter === "added" ? "Products you have added" : "Curated for your skin"}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {displayedProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          ) : (
            displayedProducts.map((item) => {
              const isAdded = addedProducts?.includes(item.id);
              return (
                <Card key={item.id} style={styles.productCard}>
                  <View style={[styles.productImageContainer, { backgroundColor: item.imageBg }]}>
                    {renderIcon(item)}
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
                    title={isAdded ? "Remove" : "Add"}
                    onPress={() => (isAdded ? handleRemoveProduct(item) : handleAddProduct(item))}
                    style={[styles.addButton, isAdded ? { backgroundColor: "#FF5252" } : {}]}
                    textStyle={styles.addButtonText}
                    gradientColors={
                      isAdded ? ["#FF5252", "#FF5252"] : undefined
                    }
                  />
                </Card>
              );
            })
          )}
        </ScrollView>

        <CustomModal
          visible={modalVisible}
          title={modalType === "add" ? "Product Added" : "Product Removed"}
          message={
            modalType === "add"
              ? `${selectedProduct?.name} has been added to your routine.`
              : `${selectedProduct?.name} has been removed from your routine.`
          }
          onClose={() => setModalVisible(false)}
          iconName={modalType === "add" ? "checkmark-circle" : "trash"}
          iconColor={modalType === "add" ? Colors.StatusGoodText : "#FF5252"}
          buttonText="Got it"
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
    borderRadius: ms(8),
    width: ms(80),
    height: ms(50),
  },
  addButtonText: {
    fontSize: textScale(12),
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: verticalScale(50),
  },
  emptyText: {
    fontSize: textScale(16),
    color: Colors.textSecondary,
  },
});

export default AllProductsScreen;
