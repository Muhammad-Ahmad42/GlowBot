import React, { ReactNode } from "react";
import { 
  View, 
  StyleSheet,
  Dimensions 
} from "react-native";
import {
  ms,
  horizontalScale,
  verticalScale,
} from "../utils/SizeScalingUtility";
import Colors from "../utils/Colors";

interface CardProps {
  children: ReactNode;
  style?: object;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return ( 
    <View style={[styles.card, style]}>
      {children}
    </View> 
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: ms(30),         
    padding: ms(20),              
    width: width - horizontalScale(25), 
    alignSelf: "center",
    elevation: ms(1),
    marginBottom: verticalScale(20),
    shadowColor: Colors.textSecondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
});

export default Card;