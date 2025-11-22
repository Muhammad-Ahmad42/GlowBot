import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, TextInput } from "react-native";
import { SafeScreen, Header, CustomModal } from "@/src/components";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../utils/Colors";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import drawable from "../../utils/drawable";

const experts = [
  {
    id: "1",
    name: "Dr. Emma Wilson",
    specialty: "Dermatologist",
    rating: 4.9,
    reviews: 120,
    image: drawable.reactLogo, 
    available: true,
    fee: "$50",
    description: "Specializes in acne and anti-aging treatments with over 10 years of experience.",
  },
  {
    id: "2",
    name: "Dr. James Carter",
    specialty: "Nutritionist",
    rating: 4.8,
    reviews: 85,
    image: drawable.reactLogo, // Placeholder
    available: false,
    fee: "$40",
    description: "Expert in gut health and skin-friendly diets to help you glow from within.",
  },
  {
    id: "3",
    name: "Dr. Sophia Lee",
    specialty: "Esthetician",
    rating: 4.7,
    reviews: 200,
    image: drawable.reactLogo, // Placeholder
    available: true,
    fee: "$60",
    description: "Certified esthetician focusing on holistic facial treatments and skincare routines.",
  },
];

const ExpertBookingScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExpertPress = (expert: any) => {
    setSelectedExpert(expert);
    setModalVisible(true);
  };

  const renderExpertCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleExpertPress(item)}>
      <View style={styles.cardHeader}>
        <Image source={item.image} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{item.fee}</Text>
            <Text style={styles.perSessionText}>/ session</Text>
        </View>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: item.available ? Colors.StatusGoodText : Colors.textMuted }]} />
            <Text style={[styles.statusText, { color: item.available ? Colors.StatusGoodText : Colors.textMuted }]}>
                {item.available ? "Available Today" : "Next Available: Mon"}
            </Text>
        </View>
        <TouchableOpacity 
            style={[styles.bookButton, !item.available && styles.disabledButton]} 
            disabled={!item.available}
            onPress={() => handleExpertPress(item)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Find an Expert"
          subTitle="Book a consultation with top specialists"
          titleStyle={styles.headerTitle}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />

        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search for doctors, specialists..."
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>

        <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={[styles.filterChip, styles.activeFilter]}>
                    <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterText}>Dermatologists</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterText}>Nutritionists</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                    <Text style={styles.filterText}>Estheticians</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>

        <FlatList
          data={filteredExperts}
          renderItem={renderExpertCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
              <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No experts found.</Text>
              </View>
          }
        />

        <CustomModal
            visible={modalVisible}
            title={selectedExpert?.name || "Expert Details"}
            message={selectedExpert ? `${selectedExpert.specialty}\n\n${selectedExpert.description}\n\nFee: ${selectedExpert.fee}` : ""}
            onClose={() => setModalVisible(false)}
            iconName="person"
            buttonText="Close"
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
  headerTitle: {
      fontSize: textScale(24),
  },
  searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.WhiteColor,
      padding: ms(12),
      borderRadius: ms(12),
      marginBottom: verticalScale(15),
      borderWidth: 1,
      borderColor: Colors.border,
  },
  searchInput: {
      flex: 1,
      marginLeft: horizontalScale(10),
      color: Colors.textPrimary,
      fontSize: textScale(14),
  },
  searchText: { // Kept for compatibility if needed, but replaced by TextInput
      marginLeft: horizontalScale(10),
      color: Colors.textMuted,
      fontSize: textScale(14),
  },
  filterContainer: {
      marginBottom: verticalScale(20),
      height: verticalScale(40),
  },
  filterChip: {
      paddingHorizontal: horizontalScale(16),
      paddingVertical: verticalScale(8),
      borderRadius: ms(20),
      backgroundColor: Colors.WhiteColor,
      marginRight: horizontalScale(10),
      borderWidth: 1,
      borderColor: Colors.border,
  },
  activeFilter: {
      backgroundColor: Colors.ButtonPink,
      borderColor: Colors.ButtonPink,
  },
  filterText: {
      fontSize: textScale(13),
      color: Colors.textSecondary,
  },
  activeFilterText: {
      color: Colors.WhiteColor,
      fontWeight: '600',
  },
  listContent: {
    paddingBottom: verticalScale(20),
  },
  card: {
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: verticalScale(16),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: Colors.GreyColor,
  },
  infoContainer: {
    flex: 1,
    marginLeft: horizontalScale(12),
  },
  name: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  specialty: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
    marginBottom: verticalScale(4),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: textScale(12),
    color: Colors.textMuted,
    marginLeft: horizontalScale(4),
  },
  priceContainer: {
      alignItems: 'flex-end'
  },
  priceText: {
      fontSize: textScale(16),
      fontWeight: 'bold',
      color: Colors.ButtonPink
  },
  perSessionText: {
      fontSize: textScale(10),
      color: Colors.textMuted
  },
  divider: {
      height: 1,
      backgroundColor: Colors.border,
      marginVertical: verticalScale(12)
  },
  cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  statusContainer: {
      flexDirection: 'row',
      alignItems: 'center'
  },
  statusDot: {
      width: ms(8),
      height: ms(8),
      borderRadius: ms(4),
      marginRight: horizontalScale(6)
  },
  statusText: {
      fontSize: textScale(12),
      fontWeight: '500'
  },
  bookButton: {
      backgroundColor: Colors.ButtonPink,
      paddingHorizontal: horizontalScale(16),
      paddingVertical: verticalScale(8),
      borderRadius: ms(20)
  },
  disabledButton: {
      backgroundColor: Colors.textMuted
  },
  bookButtonText: {
      color: Colors.WhiteColor,
      fontSize: textScale(13),
      fontWeight: '600'
  },
  emptyContainer: {
      alignItems: 'center',
      marginTop: verticalScale(20),
  },
  emptyText: {
      color: Colors.textSecondary,
      fontSize: textScale(14),
  }
});

export default ExpertBookingScreen;
