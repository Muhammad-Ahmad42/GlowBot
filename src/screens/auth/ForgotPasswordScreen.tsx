import React, { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Card,
  CustomErrorModal,
  CustomInput,
  CustomLoader,
  CustomPrimaryButton,
} from "../../components";
import { horizontalScale, ms, textScale } from "../../utils/SizeScalingUtility";
import { verticalScale } from "react-native-size-matters";
import Colors from "../../utils/Colors";
import { Formik, FormikHelpers } from "formik";
import { useNavigation } from "@react-navigation/native";
import { ForgotPasswordSchema } from "../../utils/ValidationScemas";
import { useAuthStore } from "../../store/AuthStore";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const { forgotPassword, loading } = useAuthStore();
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });
  const handleForgotPassword = async (
    email: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      await forgotPassword(email);
      navigation.navigate("LoginScreen");
    } catch (error: any) {
      setNotification({
        visible: true,
        message: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.AuthBackgroundStart, Colors.AuthBackgroundEnd]}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />
        <Text style={styles.heading}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered email to reset your password.
        </Text>

        <Card style={styles.formCard}>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={(
              values: ForgotPasswordFormValues,
              { setSubmitting }: FormikHelpers<ForgotPasswordFormValues>
            ) => {
              handleForgotPassword(values.email, setSubmitting);
            }}
          >
            {(formikProps) => (
              <View>
                <CustomInput
                  label="Email"
                  placeholder="Enter your email"
                  formikProps={formikProps}
                  formikKey="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <CustomPrimaryButton
                  title="Reset Password"
                  iconName="send-outline"
                  onPress={formikProps.handleSubmit as any}
                />

                <Text
                  style={styles.backToLogin}
                  onPress={() =>
                    navigation.navigate("LoginScreen")
                  }
                >
                  Back to Login
                </Text>
              </View>
            )}
          </Formik>
        </Card>
      </LinearGradient>
      {loading && <CustomLoader visible={loading} />}
      <CustomErrorModal
        visible={notification.visible}
        message={notification.message}
        onClose={() => setNotification({ visible: false, message: "" })}
      />
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
  },
  heading: {
    fontSize: textScale(28),
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: verticalScale(8),
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: textScale(14),
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: verticalScale(20),
    paddingHorizontal: horizontalScale(10),
  },
  formCard: {
    width: "100%",
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(20),
    padding: ms(25),
    elevation: 5,
  },
  backToLogin: {
    fontSize: textScale(13),
    color: Colors.PrimaryButtonBackgroundColor,
    textAlign: "center",
    marginTop: verticalScale(15),
    fontWeight: "600",
  },
});
