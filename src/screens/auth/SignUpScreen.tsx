import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { horizontalScale, ms, textScale } from "../../utils/SizeScalingUtility";
import {
  Card,
  CustomErrorModal,
  CustomInput,
  CustomLoader,
  CustomPrimaryButton,
  Dropdown,
  CustomDatePicker,
} from "../../components";
import { Formik } from "formik";
import { verticalScale } from "react-native-size-matters";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";
import { SignUpValidationSchema } from "../../utils/ValidationScemas";
import { useAuthStore } from "../../store/AuthStore";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const SignUpScreen = () => {
  const navigation = useNavigation<any>();
  const { signUp, loading } = useAuthStore();
  const [errorNotification, setErrorNotification] = useState({
    visible: false,
    message: "",
  });
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignUp = async (values: any, setSubmitting: any) => {
    try {
      // In a real app, you would upload the image here and get a URL
      // For now, we just pass the local URI if needed, or handle it in the store
      await signUp(values.name, values.email, values.password, image);
    } catch (error: any) {
      setErrorNotification({
        visible: true,
        message: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAge = (date: Date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[Colors.AuthBackgroundStart, Colors.AuthBackgroundEnd]}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Text style={styles.heading}>GlowBot</Text>
            <Text style={styles.subHeading}>Your AI-Powered Skin Expert</Text>
            <Text style={styles.subtitle}>
              Join us and start your glow journey
            </Text>

            <Card style={styles.switchCardBackground}>
              <View style={styles.switchContainer}>
                <TouchableOpacity
                  style={styles.switchCard}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  <Text style={styles.switchText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.switchCard, styles.activeCard]}>
                  <Text style={styles.switchTextActive}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <Card style={styles.formCard}>
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Ionicons name="camera-outline" size={40} color={Colors.textMuted} />
                    </View>
                  )}
                  <View style={styles.editIconContainer}>
                    <Ionicons name="pencil" size={16} color="white" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.uploadText}>Upload Profile Picture</Text>
              </View>

              <Formik
                initialValues={{
                  name: "",
                  gender: "",
                  age: "",
                  dob: null,
                  email: "",
                  password: "",
                  confirmPassword: "",
                  allergies: [] as string[],
                  customAllergy: "",
                }}
                validationSchema={SignUpValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  const profileData = {
                    age: values.age,
                    gender: values.gender,
                    dob: values.dob,
                    allergies: values.allergies,
                  };
                  handleSignUp({ ...values, profile: profileData }, setSubmitting);
                }}
              >
                {(formikProps) => {
                  const toggleAllergy = (allergy: string) => {
                    const currentAllergies = formikProps.values.allergies;
                    if (currentAllergies.includes(allergy)) {
                      formikProps.setFieldValue(
                        "allergies",
                        currentAllergies.filter((a) => a !== allergy)
                      );
                    } else {
                      formikProps.setFieldValue("allergies", [...currentAllergies, allergy]);
                    }
                  };

                  const addCustomAllergy = () => {
                    if (formikProps.values.customAllergy.trim()) {
                      const newAllergy = formikProps.values.customAllergy.trim();
                      if (!formikProps.values.allergies.includes(newAllergy)) {
                        formikProps.setFieldValue("allergies", [
                          ...formikProps.values.allergies,
                          newAllergy,
                        ]);
                        formikProps.setFieldValue("customAllergy", "");
                      }
                    }
                  };

                  return (
                    <View>
                      <CustomInput
                        label="Name"
                        placeholder="Enter your Name"
                        formikProps={formikProps}
                        formikKey="name"
                      />

                      <Dropdown
                        label="Gender"
                        placeholder="Select Gender"
                        options={["Male", "Female", "Other"]}
                        selectedValue={formikProps.values.gender}
                        onSelect={(value) =>
                          formikProps.setFieldValue("gender", value)
                        }
                        error={
                          formikProps.touched.gender &&
                          formikProps.errors.gender
                            ? (formikProps.errors.gender as string)
                            : undefined
                        }
                      />

                      <Text style={styles.label}>Allergies (Optional)</Text>
                      <View style={styles.chipContainer}>
                        {["Dairy", "Nuts", "Gluten", "Shellfish", "Eggs", "Soy", "Wheat"].map((allergy) => (
                          <TouchableOpacity
                            key={allergy}
                            style={[
                              styles.chip,
                              formikProps.values.allergies.includes(allergy) && styles.activeChip,
                            ]}
                            onPress={() => toggleAllergy(allergy)}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                formikProps.values.allergies.includes(allergy) && styles.activeChipText,
                              ]}
                            >
                              {allergy}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {formikProps.values.allergies.length > 0 && (
                        <View style={styles.selectedAllergiesContainer}>
                          <Text style={styles.selectedLabel}>Selected:</Text>
                          <View style={styles.chipContainer}>
                            {formikProps.values.allergies.map((allergy) => (
                              <TouchableOpacity
                                key={allergy}
                                style={[styles.chip, styles.activeChip]}
                                onPress={() => toggleAllergy(allergy)}
                              >
                                <Text style={styles.activeChipText}>{allergy} ✕</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}

                      <View style={styles.customAllergyContainer}>
                        <CustomInput
                          label="Other Allergy"
                          placeholder="Type and press add"
                          formikProps={formikProps}
                          formikKey="customAllergy"
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addCustomAllergy}>
                          <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                      </View>

                      <CustomDatePicker
                        label="Date of Birth"
                        value={formikProps.values.dob}
                        onDateChange={(date) => {
                          formikProps.setFieldValue("dob", date);
                          const age = calculateAge(date);
                          formikProps.setFieldValue("age", age);
                        }}
                        error={
                          (formikProps.touched.dob && formikProps.errors.dob) ||
                          (formikProps.touched.age && formikProps.errors.age)
                            ? ((formikProps.errors.dob ||
                                formikProps.errors.age) as string)
                            : undefined
                        }
                      />

                      <CustomInput
                        label="Email"
                        placeholder="Enter your email"
                        formikProps={formikProps}
                        formikKey="email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />

                      <CustomInput
                        label="Password"
                        placeholder="Enter your Password"
                        formikProps={formikProps}
                        formikKey="password"
                        secureTextEntry
                      />

                      <CustomInput
                        label="Confirm Password"
                        placeholder="Confirm your Password"
                        formikProps={formikProps}
                        formikKey="confirmPassword"
                        secureTextEntry
                      />

                      <CustomPrimaryButton
                        title="Create Account"
                        iconName="person-add-outline"
                        onPress={formikProps.handleSubmit as any}
                      />

                      <View style={styles.footer}>
                        <Text style={styles.footerText}>
                          Already have an account?
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("LoginScreen")}
                        >
                          <Text style={styles.footerLink}> Login</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              </Formik>
            </Card>
          </View>
        </ScrollView>
      </LinearGradient>
      {loading && <CustomLoader visible={loading} />}
      <CustomErrorModal
        visible={errorNotification.visible}
        message={errorNotification.message}
        onClose={() => setErrorNotification({ visible: false, message: "" })}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  heading: {
    fontSize: textScale(32),
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: verticalScale(5),
    marginTop: verticalScale(30),
    letterSpacing: 0.5,
  },
  subHeading: {
    fontSize: textScale(18),
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: textScale(14),
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: verticalScale(20),
  },

  switchCardBackground: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: ms(30),
    padding: ms(5),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: verticalScale(20),
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  switchCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
    borderRadius: ms(25),
    backgroundColor: Colors.WhiteColor,
    marginHorizontal: horizontalScale(5),
    elevation: 2,
  },
  activeCard: {
    backgroundColor: Colors.PrimaryButtonBackgroundColor,
    shadowColor: Colors.PrimaryButtonBackgroundColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  switchText: {
    fontSize: textScale(15),
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  switchTextActive: {
    fontSize: textScale(15),
    fontWeight: "700",
    color: "#fff",
  },
  formCard: {
    width: "100%",
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(20),
    padding: ms(25),
    elevation: 5,
    marginBottom: verticalScale(40),
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  imageWrapper: {
    position: "relative",
    marginBottom: verticalScale(10),
  },
  profileImage: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
  },
  placeholderImage: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.ButtonPink,
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  uploadText: {
    fontSize: textScale(14),
    color: Colors.textSecondary,
    marginTop: verticalScale(5),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: verticalScale(15),
  },
  footerText: {
    fontSize: textScale(13),
    color: Colors.textMuted,
  },
  footerLink: {
    fontSize: textScale(13),
    color: Colors.PrimaryButtonBackgroundColor,
    fontWeight: "700",
  },
  label: {
    fontSize: textScale(14),
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: verticalScale(8),
    marginTop: verticalScale(10),
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: verticalScale(15),
  },
  chip: {
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: ms(20),
    backgroundColor: "#F5F5F5",
    marginRight: horizontalScale(8),
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeChip: {
    backgroundColor: Colors.ButtonPink + "20",
    borderColor: Colors.ButtonPink,
  },
  chipText: {
    fontSize: textScale(13),
    color: Colors.textSecondary,
  },
  activeChipText: {
    color: Colors.ButtonPink,
    fontWeight: "600",
  },
  selectedAllergiesContainer: {
    marginBottom: verticalScale(15),
    padding: ms(10),
    backgroundColor: "#FAFAFA",
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  selectedLabel: {
    fontSize: textScale(12),
    color: Colors.textMuted,
    marginBottom: verticalScale(8),
  },
  customAllergyContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: verticalScale(15),
  },
  addButton: {
    backgroundColor: Colors.ButtonPink,
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(10),
    borderRadius: ms(10),
    marginLeft: horizontalScale(10),
    marginBottom: verticalScale(15), // Align with input
    height: verticalScale(45), // Match input height roughly
    justifyContent: "center",
  },
  addButtonText: {
    color: Colors.WhiteColor,
    fontWeight: "600",
    fontSize: textScale(14),
  },
});