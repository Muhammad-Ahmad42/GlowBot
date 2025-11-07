import { Text, View } from "react-native";
import { Header, SafeScreen } from "../../componenets";
import { Feather } from "@expo/vector-icons";

const ScanScreen = () => {
  return (
    <SafeScreen>
      <Header
        heading="Skin Scan"
        subTittle="Ai-powered Skin Analysis"
        rightIcon={<Feather name="camera" size={24} color="#8d8b8bff" />}
        onRightIconPress={() => console.log("Icon pressed")}
      />
      <View>
        <Text>Ahmad Profile</Text>
      </View>
    </SafeScreen>
  );
};
export default ScanScreen;
