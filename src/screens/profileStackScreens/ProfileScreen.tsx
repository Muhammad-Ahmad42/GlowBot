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
import { Header, SafeScreen } from "@/src/components";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import {
  horizontalScale,
  ms,
  textScale,
  verticalScale,
} from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useAuthStore } from "../../store/AuthStore";

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
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
            <TouchableOpacity onPress={logout}>
              <MaterialCommunityIcons name="logout" size={24} color={Colors.ButtonPink} />
            </TouchableOpacity>
          }
          onRightIconPress={logout}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* User Info Card */}
          <View style={styles.userCard}>
            <Image
              source={{ uri: user?.photoURL || "https://via.placeholder.com/100" }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user?.displayName || "User Name"}</Text>
            <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>

            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Settings</Text>

            <MenuOption
              icon={<Ionicons name="person-outline" size={22} color="#4CAF50" />}
              title="Personal Information"
              subtitle="Update your details"
              onPress={() => { }}
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
            <MenuOption
              icon={<Ionicons name="moon-outline" size={22} color="#3F51B5" />}
              title="Dark Mode"
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: "#767577", true: Colors.TabActivePink }}
                  thumbColor={isDarkMode ? Colors.ButtonPink : "#f4f3f4"}
                />
              }
              onPress={() => setIsDarkMode(!isDarkMode)}
            />
          </View>

          {/* Support Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Support</Text>

            <MenuOption
              icon={<Ionicons name="help-circle-outline" size={22} color="#00BCD4" />}
              title="Help & Support"
              onPress={() => { }}
            />
            <MenuOption
              icon={<Ionicons name="shield-checkmark-outline" size={22} color="#607D8B" />}
              title="Privacy Policy"
              onPress={() => { }}
            />
            <MenuOption
              icon={<Ionicons name="document-text-outline" size={22} color="#795548" />}
              title="Terms & Conditions"
              onPress={() => { }}
            />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

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
  userCard: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(20),
    alignItems: "center",
    marginBottom: verticalScale(20),
    elevation: 2,
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
    fontSize: textScale(20),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(4),
  },
  userEmail: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginBottom: verticalScale(15),
  },
  editProfileButton: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(8),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: Colors.ButtonPink,
  },
  editProfileText: {
    fontSize: textScale(14),
    color: Colors.ButtonPink,
    fontWeight: "600",
  },
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: verticalScale(20),
    elevation: 2,
  },
  sectionHeader: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(15),
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
    borderRadius: ms(20),
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: textScale(14),
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: textScale(12),
    color: Colors.textMuted,
  },
  logoutButton: {
    backgroundColor: "#FFEBEE",
    borderRadius: ms(15),
    paddingVertical: verticalScale(15),
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  logoutText: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: "#D32F2F",
  },
  versionText: {
    textAlign: "center",
    fontSize: textScale(12),
    color: Colors.textMuted,
    marginBottom: verticalScale(20),
  },
});

