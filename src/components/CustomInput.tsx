import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import {
  ms,
  verticalScale,
  horizontalScale,
  textScale,
} from "../utils/SizeScalingUtility";
import { FormikProps } from "formik";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../utils/Colors";

interface InputFieldProps extends TextInputProps {
  label: string;
  formikProps: FormikProps<any>;
  formikKey: string;
  secureTextEntry?: boolean;
}

const CustomInput: React.FC<InputFieldProps> = ({
  label,
  formikProps,
  formikKey,
  secureTextEntry,
  ...rest
}) => {
  const { handleChange, handleBlur, values, touched, errors } = formikProps;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const error = errors[formikKey];
  const touchedField = touched[formikKey];

  let errorMessage: string | null = null;
  if (touchedField && error) {
    if (typeof error === "string") errorMessage = error;
    else if (Array.isArray(error)) errorMessage = error.join(", ");
    else errorMessage = JSON.stringify(error);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}
      >
        <TextInput
          style={styles.input}
          onChangeText={handleChange(formikKey)}
          onBlur={() => {
            setIsFocused(false);
            handleBlur(formikKey);
          }}
          onFocus={() => setIsFocused(true)}
          value={values[formikKey]}
          secureTextEntry={secureTextEntry && !showPassword}
          {...rest}
        />
        {secureTextEntry && values[formikKey]?.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={ms(20)}
              color={Colors.PrimaryButtonBackgroundColor}
            />
          </TouchableOpacity>
        )}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(17),
  },
  label: {
    fontSize: textScale(16),
    marginBottom: verticalScale(5),
    color: Colors.DarkTextColor,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: horizontalScale(1),
    borderColor: Colors.border,
    borderRadius: horizontalScale(8),
    backgroundColor: Colors.InputBackgroundColor,
    shadowColor: Colors.border,
  },
  inputWrapperFocused: {
    shadowColor: Colors.border,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: ms(2),
    shadowRadius: horizontalScale(2),
    elevation: ms(4),
    borderColor: Colors.textPrimary,
  },
  input: {
    flex: 1,
    padding: ms(15),
    fontSize: textScale(15),
  },
  iconContainer: {
    paddingHorizontal: ms(10),
  },
  errorText: {
    color: Colors.TextErrorColor,
    fontSize: textScale(12),
    marginTop: verticalScale(5),
  },
});

export default CustomInput;
