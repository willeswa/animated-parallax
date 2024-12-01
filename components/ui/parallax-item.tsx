import { ItemDataType } from "@/utils/data";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native"; // Import ScrollView and Image
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import {
    FULL_ITEM_WIDTH,
    ITEM_HEIGHT,
    ITEM_WIDTH,
    SPACING,
} from "../constants";
type ParallaxItemProp = {
  item: ItemDataType;
  index: number;
  scrollX: SharedValue<number>;
  dominantColor: string;
  activeIndex: SharedValue<number>;
  scrollRef: any;
  onPeekChange: (isPeeked: boolean) => void; // Add this prop
};

export const ParallaxItem = ({
  item,
  index,
  scrollX,
  dominantColor,
  activeIndex,
  scrollRef,
  onPeekChange,
}: ParallaxItemProp) => {
  const { category, image } = item;
  const scaleFactor = 0.25;

  const _translateX = FULL_ITEM_WIDTH * scaleFactor * 2;

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: 1 + scaleFactor,
        },
        {
          translateX: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [-_translateX, 0, _translateX],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: "-90deg",
        },
        {
          translateY: `${interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
            Extrapolation.CLAMP
          )}%`,
        },
      ],
    };
  });

  const PEEK_HEIGHT = ITEM_HEIGHT * 0.51; // 40% of item height
  const PEEK_WIDTH_FACTOR = 1.5; // Expand width by a factor of 1.3
  const detailsTranslateY = useSharedValue(0);
  const startY = useSharedValue(0);

  // Add spring configuration constants
  const SPRING_CONFIG = {
    damping: 20,
    stiffness: 400,
    mass: 0.5,
    overshootClamping: true,
  };

  const isPeeked = useSharedValue(false);

  const closePeek = useCallback(() => {
    "worklet";
    detailsTranslateY.value = withSpring(0, SPRING_CONFIG);
    activeIndex.value = -1;
    isPeeked.value = false;
    runOnJS(onPeekChange)(false); // Notify parent component using runOnJS
  }, []);

  // Modify the panGesture handler
  const panGesture = Gesture.Pan()
    .activeOffsetY([-5, 5]) // Only activate for vertical movements
    .failOffsetX([-5, 5]) // Fail gesture if horizontal movement detected first
    .onStart(() => {
      startY.value = detailsTranslateY.value;
    })
    .onUpdate((event) => {
      if (
        Math.abs(event.velocityX) > Math.abs(event.velocityY) &&
        isPeeked.value
      ) {
        closePeek();
        return;
      }
      const dragAmount = startY.value + event.translationY;
      // Add velocity factor for more responsive dragging
      const velocityFactor =
        Math.sign(event.velocityY) *
        Math.min(Math.abs(event.velocityY) * 0.1, 20);
      detailsTranslateY.value = Math.max(
        -PEEK_HEIGHT,
        Math.min(0, dragAmount + velocityFactor)
      );
    })
    .onEnd((event) => {
      // Make snap decision based on velocity and position
      const shouldSnap =
        event.velocityY < -500 ||
        (detailsTranslateY.value < -PEEK_HEIGHT * 0.2 && event.velocityY <= 0);

      if (shouldSnap) {
        detailsTranslateY.value = withSpring(-PEEK_HEIGHT, SPRING_CONFIG);
        activeIndex.value = index;
        isPeeked.value = true;
        runOnJS(onPeekChange)(true); // Notify parent component using runOnJS
      } else {
        closePeek();
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: detailsTranslateY.value }],
    zIndex: 1,
    width: interpolate(
      detailsTranslateY.value,
      [-ITEM_HEIGHT, 0],
      [ITEM_WIDTH * PEEK_WIDTH_FACTOR, ITEM_WIDTH],
      Extrapolation.CLAMP
    ),
    left: interpolate(
      detailsTranslateY.value,
      [-ITEM_HEIGHT, 0],
      [-(ITEM_WIDTH * (PEEK_WIDTH_FACTOR - 1)) / 2, 0],
      Extrapolation.CLAMP
    ),
    top: interpolate(
        detailsTranslateY.value,
        [-ITEM_HEIGHT, 0],
        [ITEM_HEIGHT*1.2, 0],
        Extrapolation.CLAMP
    )
  }));

  const peekContainerStyle = useAnimatedStyle(() => ({
    width: interpolate(
      detailsTranslateY.value,
      [-PEEK_HEIGHT, 0],
      [ITEM_WIDTH * PEEK_WIDTH_FACTOR, ITEM_WIDTH],
      Extrapolation.CLAMP
    ),
    left: interpolate(
      detailsTranslateY.value,
      [-PEEK_HEIGHT, 0],
      [-(ITEM_WIDTH * (PEEK_WIDTH_FACTOR - 1)) / 2, 0],
      Extrapolation.CLAMP
    ),
    bottom: interpolate(
      detailsTranslateY.value,
      [-PEEK_HEIGHT, 0],
      [-(ITEM_WIDTH * (PEEK_WIDTH_FACTOR - 1)) * 1.3, 0],
      Extrapolation.CLAMP
    ),
    opacity: interpolate(
      detailsTranslateY.value,
      [-PEEK_HEIGHT / 4, 0],
      [1, 0],
      Extrapolation.CLAMP
    ),
    display: detailsTranslateY.value === 0 ? "none" : "flex",
    paddingBottom: interpolate(
      detailsTranslateY.value,
      [-PEEK_HEIGHT, 0],
      [SPACING, 0],
      Extrapolation.CLAMP
    ),
    // height: interpolate(
    //     detailsTranslateY.value,
    //     [-PEEK_HEIGHT, 0],
    //     [PEEK_HEIGHT, 0],
    //     Extrapolation.CLAMP
    // )
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: withSpring(
      activeIndex.value === -1 || activeIndex.value === index ? 1 : 0,
      { damping: 15, stiffness: 300 }
    ),
    transform: [
      {
        scale: withSpring(
          activeIndex.value === -1 || activeIndex.value === index ? 1 : 0.95,
          { damping: 15, stiffness: 300 }
        ),
      },
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      detailsTranslateY.value,
      [-PEEK_HEIGHT, -PEEK_HEIGHT / 2],
      [1, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          detailsTranslateY.value,
          [-PEEK_HEIGHT, -PEEK_HEIGHT / 2],
          [0, 20],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
            position: "relative",
          },
          containerStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              top: ITEM_HEIGHT,
              left: 0,
              right: 0,
              height: ITEM_HEIGHT,
              backgroundColor: dominantColor,
              borderRadius: SPACING,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
              paddingTop: SPACING * 1.5,
              paddingHorizontal: 16,
              gap: SPACING / 4,
            },
            peekContainerStyle,
          ]}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: SPACING,
              borderRadius: SPACING,
              marginTop: SPACING / 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Fun Fact
            </Text>
            <Text numberOfLines={2}>{item.peek.key_stat}</Text>
          </View>

          <View
            style={{
              backgroundColor: "white",
              borderRadius: SPACING,
              padding: SPACING,
              gap: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Top Rated Activities
            </Text>
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                gap: 8,
                backgroundColor: "white",
              }}
            >
              {item.peek.top_choices.map((choice, index) => (
                <View
                  key={index}
                  style={{
                    padding: SPACING / 2,
                    backgroundColor: "white",
                    borderRadius: SPACING / 2,
                    flexGrow: 1,
                    borderWidth: 1,
                    borderColor: dominantColor,
                    maxWidth: "48%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                >
                  <Text numberOfLines={2}>{choice.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <Animated.View
            style={[
              buttonStyle,
              { alignItems: "center", marginTop: SPACING * 2 },
            ]}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingVertical: SPACING / 1.6,
                paddingHorizontal: SPACING * 2,
                borderRadius: SPACING,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: SPACING / 2,
              }}
            >
              <Text style={{ color: "orange", fontWeight: "bold", fontSize: 16 }}>
                Get Customized Itinerary
              </Text>
              <Text style={{ fontSize: 16, color: "orange",  }}>✨</Text>
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            {
              width: ITEM_WIDTH,
              height: ITEM_HEIGHT,
              backgroundColor: "black",
              borderRadius: SPACING,
              overflow: "hidden",
              position: "absolute",
              top: 0,
              zIndex: 1,
            },
            cardStyle,
          ]}
        >
          <View
            style={{
              height: ITEM_HEIGHT,
              position: "relative",
            }}
          >
            <Animated.Image
              loadingIndicatorSource={require("../../assets/images/react-logo.png")}
              source={{ uri: image }}
              style={[
                StyleSheet.absoluteFillObject,
                { opacity: 0.5 },
                imageStyle,
              ]}
              resizeMode="cover"
              progressiveRenderingEnabled
            />
            <Animated.View
              style={[
                {
                  position: "absolute",
                  transformOrigin: "0, 0",
                  left: 0,
                  width: ITEM_HEIGHT,
                  top: ITEM_HEIGHT,
                  alignItems: "flex-start",
                  paddingHorizontal: SPACING,
                },
                textStyle,
              ]}
            >
              <Text
                style={{
                  fontSize: 58,
                  color: "white",
                }}
              >
                {category}
              </Text>
            </Animated.View>
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
