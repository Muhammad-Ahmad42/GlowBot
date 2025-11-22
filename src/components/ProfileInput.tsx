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

interface ProfileInputProps extends TextInputProps {
  label: string;
  formikProps: FormikProps<any>;
  formikKey: string;
  icon?: keyof typeof Ionicons.glyphMap;
  editable?: boolean;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  formikProps,
  formikKey,
  icon,
  editable = true,
  ...rest
}) => {
  const { handleChange, handleBlur, values, touched, errors } = formikProps;
  const [isFocused, setIsFocused] = useState(false);

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
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !editable && styles.inputWrapperDisabled,
          errorMessage && touchedField && styles.inputWrapperError,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={ms(20)}
            color={editable ? Colors.TabActivePink : Colors.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          onChangeText={handleChange(formikKey)}
          onBlur={() => {
            setIsFocused(false);
            handleBlur(formikKey);
          }}
          onFocus={() => setIsFocused(true)}
          value={values[formikKey]}
          editable={editable}
          {...rest}
        />
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: textScale(14),
    fontWeight: "600",
    marginBottom: verticalScale(8),
    color: Colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: ms(12),
    backgroundColor: Colors.WhiteColor,
    paddingHorizontal: horizontalScale(15),
  },
  inputWrapperFocused: {
    borderColor: Colors.TabActivePink,
    shadowColor: Colors.TabActivePink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapperDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  inputWrapperError: {
    borderColor: Colors.TextErrorColor,
  },
  input: {
    flex: 1,
    paddingVertical: verticalScale(15),
    fontSize: textScale(15),
    color: Colors.textPrimary,
  },
  inputDisabled: {
    color: Colors.textMuted,
  },
  icon: {
    marginRight: horizontalScale(10),
  },
  errorText: {
    color: Colors.TextErrorColor,
    fontSize: textScale(12),
    marginTop: verticalScale(5),
    marginLeft: horizontalScale(5),
  },
});

export default ProfileInput;
