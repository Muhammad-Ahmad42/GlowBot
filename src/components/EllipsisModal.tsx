import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ms, textScale, verticalScale, horizontalScale } from '../utils/SizeScalingUtility';
import Colors from '../utils/Colors';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

interface EllipsisModalProps {
  visible: boolean;
  onClose: () => void;
  options: Option[];
}

const EllipsisModal: React.FC<EllipsisModalProps> = ({ visible, onClose, options }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.menuContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => {
                  option.onPress();
                  onClose();
                }}
              >
                <Ionicons 
                  name={option.icon} 
                  size={20} 
                  color={option.color || Colors.textPrimary} 
                  style={styles.icon}
                />
                <Text style={[styles.optionText, option.color ? { color: option.color } : {}]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle overlay
  },
  menuContainer: {
    position: 'absolute',
    top: verticalScale(60), // Adjust based on header height
    right: horizontalScale(20),
    backgroundColor: Colors.WhiteColor,
    borderRadius: ms(12),
    padding: ms(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minWidth: ms(160),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(15),
  },
  icon: {
    marginRight: horizontalScale(10),
  },
  optionText: {
    fontSize: textScale(14),
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});

export default EllipsisModal;
