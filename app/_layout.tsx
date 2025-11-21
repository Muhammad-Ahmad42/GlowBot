import { Stack } from "expo-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/config/firebase";
import { useAuthStore } from "../src/store/AuthStore";

export default function RootLayout() {
  const { setUser } = useAuthStore();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>

    </Stack>
  );
}
