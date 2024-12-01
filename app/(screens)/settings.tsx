import { View, Text, ScrollView, StyleSheet, Pressable, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { Switch, TextInput } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Layout,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SPACING } from "@/components/constants";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function Settings() {
  const [preferences, setPreferences] = useState({
    travelStyle: "Luxury",
    preferredTime: "Winter",
    pace: "moderate",
    accommodation: "hotels",
    transportation: "car",
    dietaryRestrictions: "",
    accessibility: "none",
    childFriendly: false,
  });

  const travelStyles = [
    { key: "Luxury", value: "Luxury" },
    { key: "Budget", value: "Budget" },
    { key: "Backpacker", value: "Backpacker" },
    { key: "Family-Friendly", value: "Family-Friendly" },
  ];

  const travelTimes = [
    { key: "Winter", value: "Winter" },
    { key: "Summer", value: "Summer" },
    { key: "Spring", value: "Spring" },
    { key: "Fall", value: "Fall" },
  ];

  const renderPreferenceItem = (
    label: string,
    icon: any,
    children: React.ReactNode,
    index: number
  ) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(scale.value, { damping: 20, stiffness: 300 }) }],
    }));

    useEffect(() => {
      scale.value = 1.05;
      setTimeout(() => {
        scale.value = 1;
      }, 100);
    }, []);

    return (
      <Animated.View
        entering={ZoomIn.stiffness(400)}
        exiting={ZoomOut.stiffness(400)}
        layout={Layout.duration(100)}
      >
        <Animated.View style={[styles.preferenceItem, animatedStyle]}>
          <View style={styles.preferenceHeader}>
            <Ionicons name={icon} size={24} color="#666" />
            <Text style={styles.label}>{label}</Text>
          </View>
          {children}
        </Animated.View>
      </Animated.View>
    );
  };

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const onPressIn = () => {
    buttonScale.value = withSpring(.1, { mass: 0.5, stiffness: 400, damping: 12 });
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(.1, { mass: 0.5, stiffness: 400, damping: 12 });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          },
          headerShadowVisible: false,
        }}
      />
      <LinearGradient
        colors={["#f8f9fa", "#e9ecef", "#dee2e6"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <BlurView intensity={80} style={styles.blurContainer}>
            {renderPreferenceItem(
              "Travel Style",
              "airplane-outline",
              <SelectList
                setSelected={(value: string) =>
                  setPreferences((prev) => ({ ...prev, travelStyle: value }))
                }
                data={travelStyles}
                defaultOption={{
                  key: preferences.travelStyle,
                  value: preferences.travelStyle,
                }}
                save="value"
                boxStyles={styles.selectBox}
                inputStyles={styles.selectText}
                dropdownStyles={styles.dropdown}
                dropdownTextStyles={styles.dropdownText}
                search={false}
              />,
              0
            )}

            {renderPreferenceItem(
              "Preferred Time of Travel",
              "calendar-outline",
              <SelectList
                setSelected={(value: string) =>
                  setPreferences((prev) => ({
                    ...prev,
                    preferredTime: value,
                  }))
                }
                data={travelTimes}
                defaultOption={{
                  key: preferences.preferredTime,
                  value: preferences.preferredTime,
                }}
                save="value"
                boxStyles={styles.selectBox}
                inputStyles={styles.selectText}
                dropdownStyles={styles.dropdown}
                dropdownTextStyles={styles.dropdownText}
                search={false}
              />,
              1
            )}

            {renderPreferenceItem(
              "Child Friendly",
              "happy-outline",
              <Switch
                value={preferences.childFriendly}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, childFriendly: value }))
                }
              />,
              3
            )}
          </BlurView>

          <Animated.View style={[buttonStyle]}>
            <Pressable
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                /* save logic */
              }}
            >
              <LinearGradient
                colors={["#4361ee", "#3a0ca3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.saveButtonText}>Apply Changes</Text>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <View style={styles.metadataContainer}>
            <Text style={styles.metadataText}>Version {Platform.select({ ios: '1.0.0', android: '1.0.0' })}</Text>
            <Text style={styles.metadataText}>Build {Platform.select({ ios: '100', android: '100' })}</Text>
            <Text style={styles.metadataText}>Developer Contact:</Text>
            <Text style={styles.metadataEmail}>gwiliez@gmail.com</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING/2,
    paddingVertical: SPACING,
  },
  contentContainer: {
    padding: SPACING / 2,
    gap: SPACING / 2,
    paddingTop: 100, // Account for transparent header
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: SPACING * 2,
    color: "#1a1a1a",
  },
  blurContainer: {
    borderRadius: SPACING / 2,
    overflow: "hidden",
    marginBottom: SPACING / 2,
  },
  preferenceItem: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: SPACING,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  preferenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING / 2,
    gap: SPACING / 2,
  },
  preferenceContent: {
    marginLeft: SPACING,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  selectBox: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: SPACING / 3,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: SPACING / 3,
  },
  selectText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "500",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: SPACING / 3,
    backgroundColor: "white",
    padding: SPACING / 3,
  },
  dropdownText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: SPACING / 3,
    padding: SPACING / 3,
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#1a1a1a",
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING / 2,
    borderRadius: SPACING,
    gap: SPACING / 3,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  metadataContainer: {
    marginTop: SPACING * 2,
    padding: SPACING,
    alignItems: 'center',
    opacity: 0.7,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  metadataEmail: {
    fontSize: 12,
    color: '#4361ee',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
