import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import { Header, SafeScreen, Card, GlowButton } from "@/src/components";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  horizontalScale,
  ms,
  textScale,
  verticalScale,
} from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useAuthStore } from "../../store/AuthStore";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);

  const MenuOption = ({ icon, title, subtitle, onPress, showArrow = true, rightElement }: any) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        {icon}
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement ? (
        rightElement
      ) : (
        showArrow && <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Profile"
          subTitle="My Account"
          rightIcon={
            <TouchableOpacity onPress={logout} style={styles.headerLogoutButton}>
               <MaterialCommunityIcons name="logout" size={20} color={Colors.WhiteColor} />
            </TouchableOpacity>
          }
          onRightIconPress={logout}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* User Info Card */}
          <Card style={styles.userCard}>
            <Image
              source={{ uri: user?.photoURL || "https://via.placeholder.com/100" }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user?.displayName || "User Name"}</Text>
            <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>


          </Card>

          {/* Settings Section */}
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Settings</Text>

            <MenuOption
              icon={<Ionicons name="person-outline" size={22} color="#4CAF50" />}
              title="Personal Information"
              subtitle="Update your details"
              onPress={() => navigation.navigate("PersonalInformation")}
            />
            <MenuOption
              icon={<Ionicons name="notifications-outline" size={22} color="#FF9800" />}
              title="Notifications"
              rightElement={
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={setIsNotificationsEnabled}
                  trackColor={{ false: "#767577", true: Colors.TabActivePink }}
                  thumbColor={isNotificationsEnabled ? Colors.ButtonPink : "#f4f3f4"}
                />
              }
              onPress={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
            />
          </Card>

          {/* Support Section */}
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Support</Text>

            <MenuOption
              icon={<Ionicons name="help-circle-outline" size={22} color="#00BCD4" />}
              title="Help & Support"
              onPress={() => navigation.navigate("HelpSupport")}
            />
            <MenuOption
              icon={<Ionicons name="shield-checkmark-outline" size={22} color="#607D8B" />}
              title="Privacy Policy"
              onPress={() => navigation.navigate("PrivacyPolicy")}
            />
            <MenuOption
              icon={<Ionicons name="document-text-outline" size={22} color="#795548" />}
              title="Terms & Conditions"
              onPress={() => navigation.navigate("TermsConditions")}
            />
          </Card>

          <GlowButton
            title="Log Out"
            onPress={logout}
            style={styles.logoutButton}
            gradientColors={["#FF5252", "#D32F2F"]}
          />

          <Text style={styles.versionText}>Version 1.0.0</Text>

        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  headerLogoutButton: {
    padding: ms(8),
    backgroundColor: Colors.ButtonPink,
    borderRadius: ms(12),
  },
  userCard: {
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  avatar: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    marginBottom: verticalScale(15),
    borderWidth: 3,
    borderColor: Colors.TabActivePink,
  },
  userName: {
    fontSize: textScale(22),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(4),
  },
  userEmail: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginBottom: verticalScale(20),
  },
  editProfileButton: {
    marginTop: 0,
    width: "60%",
    paddingVertical: 0,
  },
  editProfileButtonText: {
    fontSize: textScale(14),
  },
  sectionCard: {
    paddingVertical: ms(10),
  },
  sectionHeader: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(15),
    marginLeft: horizontalScale(5),
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  menuIconContainer: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: textScale(15),
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: textScale(12),
    color: Colors.textMuted,
    marginTop: verticalScale(2),
  },
  logoutButton: {
    marginBottom: verticalScale(20),
  },
  versionText: {
    textAlign: "center",
    fontSize: textScale(12),
    color: Colors.textMuted,
    marginBottom: verticalScale(20),
  },
});

