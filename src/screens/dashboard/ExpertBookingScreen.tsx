import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, TextInput, Alert } from "react-native";
import { SafeScreen, Header, CustomModal } from "@/src/components";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../utils/Colors";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import drawable from "../../utils/drawable";
import { useDashboardStore, DashboardState } from "../../store/DashboardStore";
import { useConnectionStore } from "../../store/ConnectionStore";
import { useAuthStore } from "../../store/AuthStore";

const ExpertBookingScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const experts = useDashboardStore((state: DashboardState) => state.experts);
  const { connections, sendConnectionRequest, fetchMyConnections, getConnectionStatus, getConnectionByExpert } = useConnectionStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [connectingExpertId, setConnectingExpertId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      fetchMyConnections(user.uid);
    }
  }, [user?.uid]);

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExpertPress = (expert: any) => {
    setSelectedExpert(expert);
    setModalVisible(true);
  };

  const handleConnectPress = async (expertId: string) => {
    if (!user?.uid) {
      Alert.alert("Error", "Please login to connect with experts");
      return;
    }

    setConnectingExpertId(expertId);
    try {
      await sendConnectionRequest(
        user.uid,
        user?.displayName || 'User',
        user?.photoURL || undefined,
        user?.email || '',
        expertId,
        'I would like to consult with you about my skin concerns.'
      );
      
      const expert = experts.find(e => e.id === expertId);
      Alert.alert(
        "Request Sent!",
        `Your connection request has been sent to ${expert?.name}. You'll be notified when they accept.`
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send connection request");
    } finally {
      setConnectingExpertId(null);
    }
  };

  const handleChatPress = (expertId: string) => {
    const connection = getConnectionByExpert(expertId);
    const expert = experts.find(e => e.id === expertId);
    
    if (connection) {
      navigation.navigate('ChatScreen', {
        connectionId: connection.id,
        expertName: expert?.name || 'Expert',
        expertAvatar: (expert as any)?.imageUrl,
      });
    }
  };

  const handleDisconnect = (expertId: string) => {
    const connection = getConnectionByExpert(expertId);
    if (!connection) return;

    Alert.alert(
      "Disconnect",
      "Are you sure you want to disconnect from this expert?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Disconnect", 
          style: "destructive",
          onPress: async () => {
            try {
              await useConnectionStore.getState().disconnectExpert(connection.id);
            } catch (error) {
              Alert.alert("Error", "Failed to disconnect");
            }
          }
        }
      ]
    );
  };

  const getButtonConfig = (expertId: string, isAvailable: boolean) => {
    const status = getConnectionStatus(expertId);
    
    if (status === 'accepted') {
      return { text: 'Chat', onPress: () => handleChatPress(expertId), disabled: false, style: styles.chatButton, showDisconnect: true };
    } else if (status === 'pending') {
      return { text: 'Pending...', onPress: () => {}, disabled: true, style: styles.pendingButton, showDisconnect: true };
    } else if (connectingExpertId === expertId) {
      return { text: 'Connecting...', onPress: () => {}, disabled: true, style: styles.bookButton, showDisconnect: false };
    } else {
      return { text: 'Connect', onPress: () => handleConnectPress(expertId), disabled: !isAvailable, style: isAvailable ? styles.bookButton : styles.disabledButton, showDisconnect: false };
    }
  };

  const renderExpertCard = ({ item }: { item: any }) => {
    const buttonConfig = getButtonConfig(item.id, item.available);
    
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleExpertPress(item)}>
        <View style={styles.cardHeader}>
          <Image 
            source={item.imageUrl ? { uri: item.imageUrl } : drawable.reactLogo} 
            style={styles.avatar} 
          />
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {buttonConfig.showDisconnect && (
                <TouchableOpacity 
                    style={[styles.disconnectButton, { marginRight: 8 }]} 
                    onPress={() => handleDisconnect(item.id)}
                >
                    <Ionicons name="close" size={16} color={Colors.StatusBadText} />
                </TouchableOpacity>
            )}
            <TouchableOpacity 
                style={[styles.bookButton, buttonConfig.style]} 
                disabled={buttonConfig.disabled}
                onPress={buttonConfig.onPress}
            >
                <Text style={styles.bookButtonText}>
                {buttonConfig.text}
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Find an Expert"
          subTitle="Book a consultation with top specialists"
          titleStyle={styles.headerTitle}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
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
          contentContainerStyle={{ paddingBottom: 80 }}
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
            message={
              selectedExpert 
              ? connectingExpertId === null && modalVisible 
                ? `Booking request sent to ${selectedExpert.name}!\n\nThey will contact you shortly.`
                : `${selectedExpert.specialty}\n\n${selectedExpert.description}\n\nFee: ${selectedExpert.fee}`
              : ""
            }
            onClose={() => setModalVisible(false)}
            iconName="checkmark-circle"
            iconColor={Colors.StatusGoodText}
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
    paddingBottom: verticalScale(40),
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
  chatButton: {
      backgroundColor: Colors.StatusGoodText,
      paddingHorizontal: horizontalScale(16),
      paddingVertical: verticalScale(8),
      borderRadius: ms(20)
  },
  pendingButton: {
      backgroundColor: Colors.textMuted,
      paddingHorizontal: horizontalScale(16),
      paddingVertical: verticalScale(8),
      borderRadius: ms(20)
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
  },
  disconnectButton: {
      padding: ms(8),
      backgroundColor: '#FFEBEE', // Light red
      borderRadius: ms(20),
      justifyContent: 'center',
      alignItems: 'center'
  }
});

export default ExpertBookingScreen;
