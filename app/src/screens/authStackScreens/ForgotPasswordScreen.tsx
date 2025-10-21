import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {Card, CustomInput, CustomPrimaryButton} from "../../componenets"
import { horizontalScale, ms, textScale } from "../../utils/SizeScalingUtility";
import { verticalScale } from "react-native-size-matters";
import Colors from "../../utils/Colors";
import { Formik, FormikHelpers } from "formik";
import { useRouter } from "expo-router";
import { ForgotPasswordSchema } from "../../utils/ValidationScemas";


interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordScreen = () => {
  const router = useRouter();

  const handleForgotPassword = async (
    email: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      console.log("Forgot password request for:", email);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <View style={styles.container}>
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
                    router.push("/src/screens/authStackScreens/LoginScreen")
                  }
                >
                   Back to Login
                </Text>
              </View>
            )}
          </Formik>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: horizontalScale(20),
  },
  heading: {
    fontSize: textScale(28),
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: verticalScale(8),
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
    borderRadius: ms(12),
    padding: ms(20),
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
