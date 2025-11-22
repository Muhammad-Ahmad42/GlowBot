import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Header, SafeScreen, Card } from "@/src/components";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";

const TermsConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header
          heading="Terms & Conditions"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={styles.contentCard}>
            <Text style={styles.text}>
              Last updated: November 2025
              {"\n\n"}
              1. Terms
              {"\n"}
              By accessing GlowBot, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
              {"\n\n"}
              2. Use License
              {"\n"}
              Permission is granted to temporarily download one copy of the materials (information or software) on GlowBot's website for personal, non-commercial transitory viewing only.
              {"\n\n"}
              3. Disclaimer
              {"\n"}
              The materials on GlowBot's website are provided on an 'as is' basis. GlowBot makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </Text>
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
