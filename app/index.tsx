import { View, StyleSheet } from "react-native";
import AppNavigator from "../src/navigations/AppNavigation";

export default function Index() {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
