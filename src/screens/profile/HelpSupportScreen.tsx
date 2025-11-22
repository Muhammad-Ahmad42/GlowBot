import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Header, SafeScreen, Card } from "@/src/components";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";

const HelpSupportScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Help & Support"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={styles.contentCard}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            <View style={styles.faqItem}>
              <Text style={styles.question}>How do I scan my skin?</Text>
              <Text style={styles.answer}>Go to the Scan tab and follow the on-screen instructions to take a photo of your face.</Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.question}>How do I book an expert?</Text>
              <Text style={styles.answer}>Navigate to the Dashboard and click on "Book Consultation" in the Expert section.</Text>
            </View>

            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.contactText}>Email: support@glowbot.com</Text>
            <Text style={styles.contactText}>Phone: +1 (555) 123-4567</Text>
          </Card>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default HelpSupportScreen;

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
  sectionTitle: {
    fontSize: textScale(18),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(15),
    marginTop: verticalScale(10),
  },
  faqItem: {
    marginBottom: verticalScale(15),
  },
  question: {
    fontSize: textScale(16),
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: verticalScale(5),
  },
  answer: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contactText: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginBottom: verticalScale(5),
  },
});
