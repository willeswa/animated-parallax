import { CustomParallax } from "@/components/ui/custom-parallax";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, StatusBarStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomNavbar } from "@/components/ui/custom-navbar";
import { GestureHelper } from "@/components/ui/gesture-helper";

const isColorLight = (color: string) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

export default function MainScreen() {
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [barStyle, setBarStyle] = useState<StatusBarStyle>("dark-content");
  const animatedBackgroundColor = useSharedValue("white");
  const [isPeeked, setIsPeeked] = useState(false); // Add this state
  const [showHelper, setShowHelper] = useState(true); // Add this state

  useEffect(() => {
    animatedBackgroundColor.value = withTiming(backgroundColor, {
      duration: 500,
    });

    setBarStyle(
      isColorLight(backgroundColor) ? "dark-content" : "light-content"
    );
  }, [backgroundColor]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedBackgroundColor.value,
    };
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor },
          headerTintColor:isColorLight(backgroundColor)  ?  "black" : "white",
        }}
      />
      <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <CustomParallax 
          setDominantColor={setBackgroundColor}
          onPeekChange={(isPeeked) => {
            setIsPeeked(isPeeked);
            setShowHelper(false); // Hide helper when user interacts
          }}
        />
        <CustomNavbar isPeeked={isPeeked} />
        {showHelper && (
          <GestureHelper 
            onDismiss={() => setShowHelper(false)}
          />
        )}
      </Animated.View>
  </>
  );
}
