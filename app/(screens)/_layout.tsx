import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen 
      name="settings"
      options={{
        title: "Settings",
        headerShown: true,
      }}
      />
    </Stack>
  );
}
