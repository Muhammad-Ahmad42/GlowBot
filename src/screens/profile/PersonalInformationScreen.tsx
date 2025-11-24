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
import { auth } from "../../config/firebase";

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
    .nullable(),
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .nullable(),
  gender: Yup.string().nullable(),
});

const PersonalInformationScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.photoURL || null);

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  const handleSave = async (values: any) => {
    try {
      setLoading(true);

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: values.displayName,
          photoURL: profileImage,
        });

        // Update local user state
        setUser(auth.currentUser);

        // Here you would typically also save additional fields (phone, DOB, gender)
        // to Firestore or your database
        // Example:
        // await updateDoc(doc(db, "users", auth.currentUser.uid), {
        //   phoneNumber: values.phoneNumber,
        //   dateOfBirth: values.dateOfBirth,
        //   gender: values.gender,
        // });

        Alert.alert(
          "Success",
          "Your profile has been updated successfully!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicked = (uri: string) => {
    setImageLoading(true);
    // Here you would upload the image to Firebase Storage
    // For now, we'll just set the local URI
    setProfileImage(uri);
    setTimeout(() => setImageLoading(false), 500);
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Header
          heading="Personal Information"
          subTitle="Update your profile details"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          centerTitle={true}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card style={styles.card}>
            <ProfileImagePicker
              imageUri={profileImage}
              onImagePicked={handleImagePicked}
              loading={imageLoading}
            />

            <Formik
              initialValues={{
                displayName: user?.displayName || "",
                email: user?.email || "",
                phoneNumber: "",
                dateOfBirth: null as Date | null,
                gender: "",
              }}
              validationSchema={personalInfoSchema}
              onSubmit={handleSave}
            >
              {(formikProps) => (
                <View>
                  <ProfileInput
                    label="Full Name"
                    formikProps={formikProps}
                    formikKey="displayName"
                    icon="person-outline"
                    placeholder="Enter your full name"
                    autoCapitalize="words"
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
                  />

                  <CustomDatePicker
                    label="Date of Birth"
                    value={formikProps.values.dateOfBirth}
                    onDateChange={(date: Date) => formikProps.setFieldValue("dateOfBirth", date)}
                    placeholder="Select your date of birth"
                  />

                  <Dropdown
                    label="Gender"
                    options={genderOptions}
                    selectedValue={formikProps.values.gender}
                    onSelect={(value: string) => formikProps.setFieldValue("gender", value)}
                    placeholder="Select your gender"
                  />

                  <GlowButton
                    title={loading ? "Saving..." : "Save Changes"}
                    onPress={formikProps.handleSubmit}
                    disabled={loading || !formikProps.isValid}
                    style={styles.saveButton}
                    gradientColors={[Colors.ButtonPink, Colors.TabActivePink]}
                  />

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
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
  saveButton: {
    marginTop: verticalScale(30),
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: verticalScale(15),
    marginTop: verticalScale(10),
  },
  cancelButtonText: {
    fontSize: textScale(15),
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});

export default PersonalInformationScreen;
