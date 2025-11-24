import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Header, SafeScreen, Card } from "@/src/components";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Privacy Policy"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <Card style={styles.contentCard}>
            <Text style={styles.text}>
              Last updated: November 2025
              {"\n\n"}
              Your privacy is important to us. It is GlowBot's policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.
              {"\n\n"}
              1. Information We Collect
              {"\n"}
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
              {"\n\n"}
              2. How We Use Information
              {"\n"}
              We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect GlowBot and our users.
              {"\n\n"}
              3. Data Retention
              {"\n"}
              We only retain collected information for as long as necessary to provide you with your requested service.
            </Text>
          </Card>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  contentCard: {
    marginTop: verticalScale(10),
    padding: ms(20),
  },
  text: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
