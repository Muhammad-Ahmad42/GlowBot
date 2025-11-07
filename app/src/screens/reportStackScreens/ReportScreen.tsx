import { Text, View } from "react-native";
import { Header, SafeScreen } from "../../componenets";
import { Ionicons } from "@expo/vector-icons";

const ReportScreen = () => {
  return (
    <SafeScreen>
      <Header
        heading="Skin Reports"
        subTittle="Detailed Reports"
        rightIcon={<Ionicons name="analytics" size={24} color="#8d8b8bff" />}
        onRightIconPress={() => console.log("Icon pressed")}
      />
      <View>
        <Text>Ahmad Profile</Text>
      </View>
    </SafeScreen>
  );
};
export default ReportScreen;
