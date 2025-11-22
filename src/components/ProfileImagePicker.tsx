import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../utils/Colors";
import { ms, verticalScale, horizontalScale, textScale } from "../utils/SizeScalingUtility";

interface ProfileImagePickerProps {
  imageUri: string | null | undefined;
  onImagePicked: (uri: string) => void;
  loading?: boolean;
}

const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  imageUri,
  onImagePicked,
  loading = false,
}) => {
  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to change your profile picture."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: imageUri || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        
        {loading ? (
          <View style={styles.editButton}>
            <ActivityIndicator size="small" color={Colors.WhiteColor} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={ms(20)} color={Colors.WhiteColor} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.helperText}>Tap the camera icon to change photo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: verticalScale(20),
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    borderWidth: 4,
    borderColor: Colors.TabActivePink,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.ButtonPink,
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.WhiteColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  helperText: {
    marginTop: verticalScale(10),
    fontSize: textScale(12),
    color: Colors.textMuted,
  },
});

export default ProfileImagePicker;
