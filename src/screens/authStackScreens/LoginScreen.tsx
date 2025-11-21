import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { horizontalScale, ms, textScale } from "../../utils/SizeScalingUtility";
import { verticalScale } from "react-native-size-matters";
import Colors from "../../utils/Colors";
import { Formik, FormikHelpers } from "formik";
import { LogInValidationSchema } from "../../utils/ValidationScemas";
import { useNavigation } from "@react-navigation/native";
import {
  Card,
  CustomErrorModal,
  CustomInput,
  CustomLoader,
  CustomPrimaryButton,
} from "../../components";
import { useAuthStore } from "../../store/AuthStore";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { login, loading } = useAuthStore();

  const [errorNotification, setErrorNotification] = useState({
    visible: false,
    message: "",
  });

  const handleLogin = async (
    email: string,
    password: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      await login(email, password);
    } catch (error: any) {
      setErrorNotification({
        visible: true,
        message: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>GlowBot</Text>
        <Text style={styles.subHeading}>Your AI-Powered Skin Expert</Text>
        <Text style={styles.subtitle}>Welcome back to your glow journey</Text>

        <Card style={styles.switchCardBackground}>
          <View style={styles.switchContainer}>
            <TouchableOpacity style={[styles.switchCard, styles.activeCard]}>
              <Text style={styles.switchTextActive}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchCard}
              onPress={() =>
                navigation.navigate("SignUpScreen")
              }
            >
              <Text style={styles.switchText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LogInValidationSchema}
            onSubmit={(
              values: LoginFormValues,
              { setSubmitting }: FormikHelpers<LoginFormValues>
            ) => {
              handleLogin(values.email, values.password, setSubmitting);
            }}
          >
            {(formikProps) => {
              return (
                <View>
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

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ForgotPasswordScreen")
                    }
                  >
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <CustomPrimaryButton
                    title="Login to GlowBot"
                    iconName="log-in-outline"
                    onPress={formikProps.handleSubmit as any}
                  />
                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Dont have an account?</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("SignUpScreen")
                      }
                    >
                      <Text style={styles.footerLink}> SignUp</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          </Formik>
        </Card>
      </View>
      {loading && <CustomLoader visible={loading} />}
      <CustomErrorModal
        visible={errorNotification.visible}
        message={errorNotification.message}
        onClose={() => setErrorNotification({ visible: false, message: "" })}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
  },
  forgotPasswordText: {
    fontSize: textScale(13),
    color: Colors.PrimaryButtonBackgroundColor,
    textAlign: "right",
    marginTop: verticalScale(3),
    marginBottom: verticalScale(10),
    fontWeight: "500",
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
