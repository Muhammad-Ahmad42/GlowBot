import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import {
  ms,
  verticalScale,
  horizontalScale,
  textScale,
} from "../utils/SizeScalingUtility";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../utils/Colors";

interface DropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValue,
  placeholder = "Select",
  onSelect,
  error,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.dropdownField,
          open && styles.dropdownFocused,
          error ? styles.dropdownError : null,
        ]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={styles.textValue}>{selectedValue || placeholder}</Text>
        <Ionicons
          name={open ? "chevron-up-outline" : "chevron-down-outline"}
          size={ms(18)}
          color={open ? Colors.PrimaryButtonBackgroundColor : Colors.DarkTextColor}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownModal}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: verticalScale(150) }}>
            {options.map((option) => {
              const isSelected = selectedValue === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownItem,
                    isSelected && styles.dropdownSelected,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.textValue}>{option}</Text>

                  {isSelected && (
                    <Ionicons
                      name="checkmark-outline"
                      size={ms(18)}
                      color={Colors.PrimaryButtonBackgroundColor}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(17), // same as CustomInput
  },

  label: {
    fontSize: textScale(16),
    marginBottom: verticalScale(5),
    color: Colors.DarkTextColor,
  },

  dropdownField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: horizontalScale(1),
    borderColor: Colors.border,
    borderRadius: horizontalScale(8),

    backgroundColor: Colors.InputBackgroundColor,

    paddingVertical: verticalScale(15),
    paddingHorizontal: horizontalScale(14),
  },

  dropdownFocused: {
    shadowColor: Colors.border,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: ms(2),
    shadowRadius: horizontalScale(2),
    elevation: ms(4),
    borderColor: Colors.PrimaryButtonBackgroundColor,
  },

  dropdownError: {
    borderColor: "red",
  },

  errorText: {
    color: "red",
    fontSize: textScale(12),
    marginTop: verticalScale(5),
  },

  dropdownModal: {
    marginTop: verticalScale(5),
    backgroundColor: Colors.WhiteColor,
    borderRadius: horizontalScale(6),
    borderWidth: horizontalScale(1),
    borderColor: Colors.border,

    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,

    zIndex: 999,
    elevation: ms(4),
  },

  dropdownItem: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownSelected: {
    backgroundColor: Colors.InputBackgroundColor,
  },

  textValue: {
    fontSize: textScale(15),
    color: Colors.DarkTextColor,
  },
});

export default Dropdown;
