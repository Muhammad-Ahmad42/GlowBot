import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Header, SafeScreen } from "../../componenets";
import { FontAwesome, FontAwesome6, SimpleLineIcons } from "@expo/vector-icons";
import { horizontalScale } from "../../utils/SizeScalingUtility";

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
      <View style={styles.container}>
        <View style={styles.card}>
          <View>
            {/*CAMERA ON THE LEFT SIDE   */}
            <SimpleLineIcons name="camera" size={24} color="white" />
            {/*THIS ICON ON THE RIGHT   */}

            <FontAwesome6 name="arrow-right-long" size={24} color="#8d8b8bff" />
          </View>
          {/* YHIS TEXT IN CENTER  */}
          <Text>Skin Scan</Text>

          <Text>Analyze your Skin now</Text>
        </View>
      </View>
    </SafeScreen>
  );
}

export default DashboardScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(16),
  },
  card: {},
});
