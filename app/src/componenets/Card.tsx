import React, { ReactNode } from "react";
import { 
  View, 
  StyleSheet,
  Dimensions 
} from "react-native";
import {
  ms,
  horizontalScale,
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
    borderRadius: horizontalScale(12),         
    padding: ms(15),              
    width: width - horizontalScale(25), 
    alignSelf: "center",
    elevation: ms(5),
  },
});

export default Card;