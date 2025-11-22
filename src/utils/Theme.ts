import Colors from "./Colors";

export const lightTheme = {
  dark: false,
  colors: {
    background: Colors.DashboardBackground,
    text: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    card: Colors.WhiteColor,
    border: Colors.border,
    primary: Colors.ButtonPink,
    notification: Colors.TabActivePink,
    icon: Colors.textPrimary,
    sectionHeader: Colors.textPrimary,
    menuBackground: "#F8F9FA",
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    background: "#121212",
    text: "#FFFFFF",
    textSecondary: "#B0B0B0",
    card: "#1E1E1E",
    border: "#333333",
    primary: Colors.ButtonPink,
    notification: Colors.TabActivePink,
    icon: "#FFFFFF",
    sectionHeader: "#FFFFFF",
    menuBackground: "#2C2C2C",
  },
};

export type Theme = typeof lightTheme;
