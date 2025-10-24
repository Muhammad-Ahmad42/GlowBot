import { View } from "react-native";
import AppNavigator from "./src/navigations/AppNavigation";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
    </View>
  );
}
