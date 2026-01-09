import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Header, SafeScreen, Card, GlowButton } from "@/src/components";
import ProfileInput from "@/src/components/ProfileInput";
import ProfileImagePicker from "@/src/components/ProfileImagePicker";
import Dropdown from "@/src/components/Dropdown";
import CustomDatePicker from "@/src/components/CustomDatePicker";
import Colors from "../../utils/Colors";
import { horizontalScale, verticalScale, textScale, ms } from "../../utils/SizeScalingUtility";
import { useAuthStore } from "../../store/AuthStore";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Validation schema
const personalInfoSchema = Yup.object().shape({
  displayName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
    .required("Phone number is required"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .typeError("Invalid date")
    .required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
});

const PersonalInformationScreen = () => {
  const navigation = useNavigation();
  const { user, userProfile, updateUserProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.photoURL || null);

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  const handleSave = async (values: any) => {
    try {
      if (!profileImage) {
        Alert.alert("Error", "Profile image is compulsory");
        return;
      }
      setLoading(true);

      const profileData = {
          phoneNumber: values.phoneNumber,
          dob: values.dateOfBirth,
          gender: values.gender,
      };

      await updateUserProfile(values.displayName, profileImage, profileData);

      Alert.alert(
        "Success",
        "Your profile has been updated successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );

    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicked = (uri: string) => {
    setImageLoading(true);
    setProfileImage(uri);
    setTimeout(() => setImageLoading(false), 500);
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={Platform.OS === "ios"}
        style={styles.container}
      >
        <Header
          heading="Personal Information"
          subTitle="View your profile details"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.card}>
            {/* Image Picker - Read Only (Just Image) */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Image
                  source={{ uri: profileImage || "https://via.placeholder.com/150" }}
                  style={{
                    width: ms(120),
                    height: ms(120),
                    borderRadius: ms(60),
                    borderWidth: 4,
                    borderColor: Colors.TabActivePink,
                  }}
                />
            </View>

            <Formik
              enableReinitialize={true}
              initialValues={{
                displayName: user?.displayName || "",
                email: user?.email || "",
                phoneNumber: userProfile?.phoneNumber || "",
                dateOfBirth: userProfile?.dob ? new Date(userProfile.dob) : null,
                gender: userProfile?.gender || "",
              }}
              onSubmit={() => {}} // No submit
            >
              {(formikProps) => (
                <View pointerEvents="none"> 
                  {/* pointerEvents="none" on the container effectively disables all inputs inside! */}
                  <ProfileInput
                    label="Full Name"
                    formikProps={formikProps}
                    formikKey="displayName"
                    icon="person-outline"
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                    editable={false}
                  />

                  <ProfileInput
                    label="Email Address"
                    formikProps={formikProps}
                    formikKey="email"
                    icon="mail-outline"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={false}
                  />

                  <ProfileInput
                    label="Phone Number"
                    formikProps={formikProps}
                    formikKey="phoneNumber"
                    icon="call-outline"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    editable={false}
                  />

                  {/* For Date and Dropdown, since we use pointerEvents="none", they won't open. Good. 
                      Styles might still look 'interactive' (arrows etc), but that's fine for "view".
                  */}

                  <CustomDatePicker
                    label="Date of Birth"
                    value={formikProps.values.dateOfBirth}
                    onDateChange={(date: Date) => {}}
                    placeholder="Select your date of birth"
                  />

                  <Dropdown
                    label="Gender"
                    options={genderOptions}
                    selectedValue={formikProps.values.gender}
                    onSelect={(value: string) => {}}
                    placeholder="Select your gender"
                  />
                  
                  {/* Removed Buttons */}
                </View>
              )}
            </Formik>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DashboardBackground,
    paddingHorizontal: horizontalScale(20),
  },
  scrollContent: {
    paddingBottom: 80,
  },
  card: {
    marginTop: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(25),
  },
});

export default PersonalInformationScreen;
