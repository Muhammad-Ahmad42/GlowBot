import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Header, SafeScreen, Card } from "@/src/components";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";

const TermsConditionsScreen = () => {
  const navigation = useNavigation();

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{children}</Text>
    </View>
  );

  const BulletPoint = ({ text }: { text: string }) => (
    <View style={styles.bulletContainer}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Terms & Conditions"
          subTitle="Please read carefully"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card style={styles.contentCard}>
            <Text style={styles.lastUpdated}>Last updated: November 23, 2025</Text>
            
            <Text style={styles.introText}>
              Welcome to GlowBot! By accessing and using our skincare analysis application, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
            </Text>

            <Section title="1. Acceptance of Terms">
              By creating an account and using GlowBot, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our application.
            </Section>

            <Section title="2. Use License">
              GlowBot grants you a personal, non-transferable, non-exclusive license to use our application subject to these terms:
            </Section>
            <BulletPoint text="Use the app for personal, non-commercial purposes only" />
            <BulletPoint text="Not modify, copy, or create derivative works from our content" />
            <BulletPoint text="Not reverse engineer or attempt to extract source code" />
            <BulletPoint text="Comply with all applicable laws and regulations" />

            <Section title="3. User Account">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
            </Section>
            <BulletPoint text="Provide accurate and complete registration information" />
            <BulletPoint text="Keep your password secure and confidential" />
            <BulletPoint text="Immediately notify us of any unauthorized use" />
            <BulletPoint text="Be responsible for all activities under your account" />

            <Section title="4. Skincare Advice Disclaimer">
              GlowBot provides AI-powered skincare analysis and recommendations. However, our service is NOT a substitute for professional medical advice, diagnosis, or treatment:
            </Section>
            <BulletPoint text="Always consult with a qualified dermatologist for serious skin conditions" />
            <BulletPoint text="Our AI analysis is for informational purposes only" />
            <BulletPoint text="We do not diagnose medical conditions or prescribe treatments" />
            <BulletPoint text="Results may vary based on individual skin types and conditions" />

            <Section title="5. Intellectual Property">
              All content, features, and functionality of GlowBot, including but not limited to text, graphics, logos, icons, images, and software, are the exclusive property of GlowBot and protected by international copyright, trademark, and other intellectual property laws.
            </Section>

            <Section title="6. User Conduct">
              You agree not to use GlowBot to:
            </Section>
            <BulletPoint text="Upload or share inappropriate, offensive, or harmful content" />
            <BulletPoint text="Violate any applicable laws or regulations" />
            <BulletPoint text="Impersonate others or provide false information" />
            <BulletPoint text="Interfere with or disrupt the service or servers" />
            <BulletPoint text="Attempt to gain unauthorized access to any part of the service" />

            <Section title="7. Data Privacy">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using GlowBot, you consent to our data practices as described in the Privacy Policy.
            </Section>

            <Section title="8. Limitation of Liability">
              To the maximum extent permitted by law, GlowBot shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </Section>
            <BulletPoint text="Your use or inability to use the service" />
            <BulletPoint text="Any unauthorized access to or use of our servers" />
            <BulletPoint text="Any bugs, viruses, or other harmful code" />
            <BulletPoint text="Any errors or omissions in any content" />

            <Section title="9. Modifications to Terms">
              GlowBot reserves the right to modify or replace these Terms and Conditions at any time. We will notify users of any material changes via email or in-app notification. Continued use of the service after such modifications constitutes acceptance of the updated terms.
            </Section>

            <Section title="10. Termination">
              We reserve the right to suspend or terminate your account and access to GlowBot at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </Section>

            <Section title="11. Governing Law">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
            </Section>

            <Section title="12. Contact Information">
              If you have any questions about these Terms and Conditions, please contact us at:
            </Section>
            <Text style={styles.contactInfo}>
              Email: legal@glowbot.com{"\n"}
              Support: support@glowbot.com{"\n"}
              Phone: +1 (555) 123-4567
            </Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By using GlowBot, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
              </Text>
            </View>
          </Card>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default TermsConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  scrollContent: {
    paddingBottom: 80,
  },
  contentCard: {
    marginTop: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(25),
  },
  lastUpdated: {
    fontSize: textScale(12),
    color: Colors.textMuted,
    fontStyle: "italic",
    marginBottom: verticalScale(15),
  },
  introText: {
    fontSize: textScale(15),
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: verticalScale(20),
    fontWeight: "500",
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: verticalScale(8),
    lineHeight: 24,
  },
  sectionContent: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  bulletContainer: {
    flexDirection: "row",
    marginBottom: verticalScale(8),
    paddingLeft: horizontalScale(10),
  },
  bullet: {
    fontSize: textScale(14),
    color: Colors.TabActivePink,
    marginRight: horizontalScale(8),
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
    fontSize: textScale(14),
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  contactInfo: {
    fontSize: textScale(14),
    color: Colors.textPrimary,
    lineHeight: 24,
    paddingLeft: horizontalScale(10),
    marginTop: verticalScale(5),
    fontWeight: "500",
  },
  footer: {
    marginTop: verticalScale(30),
    paddingTop: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: textScale(13),
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
  },
});
