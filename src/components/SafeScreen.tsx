import React, { ReactNode } from "react";
import { StatusBar, Platform, StatusBarStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../utils/Colors";

interface SafeScreenProps {
  children: ReactNode;
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
}

const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  backgroundColor = Colors.screenBackground,
  barStyle = "dark-content",
}) => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor }}
      edges={["top", "left", "right"]}
      pointerEvents="box-none"
    >
      <StatusBar
        barStyle={barStyle}
        backgroundColor={
          Platform.OS === "android" ? backgroundColor : "transparent"
        }
        translucent={Platform.OS === "android"}
        animated
      />
      {children}
    </SafeAreaView>
  );
};

export default SafeScreen;
