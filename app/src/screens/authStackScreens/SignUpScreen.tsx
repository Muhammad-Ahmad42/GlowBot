import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { 
  horizontalScale,
  ms, 
  textScale
  } from "../../utils/SizeScalingUtility";
import { 
  Card, 
  CustomInput, 
  CustomPrimaryButton 
} from "../../componenets";
import { 
  Formik, 
  FormikHelpers 
} from "formik";
import { verticalScale } from "react-native-size-matters";
import Colors from "../../utils/Colors";
import { useRouter } from "expo-router";
import { SignUpValidationSchema } from "../../utils/ValidationScemas";

interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpScreen = () => {
  const router = useRouter();

  const handleSignUp = async (
    email: string,
    password: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      console.log("Email:", email);
      console.log("Password:", password);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
   <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>GlowBot</Text>
        <Text style={styles.subHeading}>Your AI-Powered Skin Expert</Text>
        <Text style={styles.subtitle}>Join us and start your glow journey</Text>

        <Card style={styles.switchCardBackground}>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={styles.switchCard}
              onPress={() => router.push("/src/screens/authStackScreens/LoginScreen")}
            >
              <Text style={styles.switchText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.switchCard, styles.activeCard]}>
              <Text style={styles.switchTextActive}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignUpValidationSchema}
            onSubmit={(
              values: SignUpFormValues,
              { setSubmitting }: FormikHelpers<SignUpFormValues>
            ) => {
              handleSignUp(values.email, values.password, setSubmitting);
            }}
          >
            {(formikProps) => {

              return (
                <View>
                  <CustomInput
                    label="Name"
                    placeholder="Enter your Name"
                    formikProps={formikProps}
                    formikKey="password"
                    secureTextEntry
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
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity
                      onPress={() =>
                        router.push("/src/screens/authStackScreens/LoginScreen")
                      }
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
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: horizontalScale(20),
  },
  heading: {
    fontSize: textScale(30),
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: verticalScale(8),
    marginTop:verticalScale(50)
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
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(15),
    padding: ms(10),
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
    paddingVertical: verticalScale(12),
    borderRadius: ms(10),
    backgroundColor: Colors.WhiteColor,
    marginHorizontal: horizontalScale(5),
    elevation: 2,
  },
  activeCard: {
    backgroundColor: Colors.BlackColor,
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
    borderRadius: ms(12),
    padding: ms(20),
    elevation: 5,
    marginBottom:verticalScale(40)
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
});
