import React from "react";
import { Text, View } from "react-native";
import { Header, SafeScreen } from "../../componenets";
import { FontAwesome } from "@expo/vector-icons";

function DashboardScreen() {
  return (
    <SafeScreen>
      <Header
        heading="John Doe"
        subTittle="How are you feeling today?"
        rightIcon={<FontAwesome name="bell" size={24} color="#8d8b8bff" />}
        isUserHeader={true}
        onRightIconPress={() => console.log("Icon pressed")}
      />
      <View>
        <Text>Ahmad</Text>
      </View>
    </SafeScreen>
  );
}

export default DashboardScreen;
