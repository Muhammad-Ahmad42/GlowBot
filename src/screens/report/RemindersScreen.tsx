import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { Header, SafeScreen, Card } from "@/src/components";
import { Ionicons } from "@expo/vector-icons";
import { horizontalScale, ms, textScale, verticalScale } from "../../utils/SizeScalingUtility";
import Colors from "../../utils/Colors";

import { useNavigation } from "@react-navigation/native";

const RemindersScreen = () => {
  const navigation = useNavigation();
  const [reminders, setReminders] = useState([
    { id: 1, title: "Morning Routine", time: "08:00 AM", enabled: true },
    { id: 2, title: "Evening Routine", time: "09:00 PM", enabled: true },
    { id: 3, title: "Weekly Scan", time: "Sunday 10:00 AM", enabled: false },
    { id: 4, title: "Drink Water", time: "Every 2 hours", enabled: true },
  ]);

  const toggleSwitch = (id: number) => {
    setReminders((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Header 
          heading="Reminders" 
          subTitle="Stay on track" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {reminders.map((item) => (
            <Card key={item.id} style={styles.reminderCard}>
              <View style={styles.iconContainer}>
                <Ionicons name="alarm-outline" size={24} color={Colors.ButtonPink} />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: Colors.ButtonPink }}
                thumbColor={item.enabled ? "white" : "#f4f3f4"}
                onValueChange={() => toggleSwitch(item.id)}
                value={item.enabled}
              />
            </Card>
          ))}
        </ScrollView>
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
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: ms(15),
    marginBottom: verticalScale(10),
  },
  iconContainer: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: "#FCE4EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: horizontalScale(15),
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: textScale(16),
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  time: {
    fontSize: textScale(12),
    color: Colors.textSecondary,
    marginTop: verticalScale(2),
  },
});

export default RemindersScreen;
