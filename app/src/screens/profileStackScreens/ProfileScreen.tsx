import { Text, View } from "react-native";
import { Header, SafeScreen } from "../../componenets";
import { Feather } from "@expo/vector-icons";

const ProfileScreen = () => {
  return (
    <SafeScreen>
      <Header
        heading="Profile"
        subTittle="Users Profile Data"
        rightIcon={<Feather name="user" size={24} color="#8d8b8bff" />}
        onRightIconPress={() => console.log("Icon pressed")}
      />
      <View>
        <Text>Ahmad Profile</Text>
      </View>
    </SafeScreen>
  );
};
export default ProfileScreen;
