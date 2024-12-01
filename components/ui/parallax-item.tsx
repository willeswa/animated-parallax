import { ItemDataType } from "@/utils/data";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
};

export const ParallaxItem = ({ item, index, scrollX, dominantColor }: ParallaxItemProp) => {
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
                rotate: "-90deg"
            },
            {
                translateY: `${interpolate(
                    scrollX.value,
                    [index - 1, index, index + 1],
                    [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
                    Extrapolation.CLAMP
                )}%`
            }
        ]
    }
  })

  const PEEK_HEIGHT = ITEM_HEIGHT * 0.45; // 40% of item height
  const PEEK_WIDTH_FACTOR = 1.14; // Expand width by a factor of 1.3
  const detailsTranslateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = detailsTranslateY.value;
    })
    .onUpdate((event) => {
      detailsTranslateY.value = Math.max(-PEEK_HEIGHT, Math.min(0, startY.value + event.translationY));
    })
    .onEnd(() => {
      if (detailsTranslateY.value < -PEEK_HEIGHT / 2) {
        detailsTranslateY.value = withSpring(-PEEK_HEIGHT);
      } else {
        detailsTranslateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: detailsTranslateY.value }],
    zIndex: 1,
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
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT, // Adjust height 
        position: 'relative',
      }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: ITEM_HEIGHT,
              backgroundColor: dominantColor, // Use dominant color
              borderRadius: SPACING,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            },
            peekContainerStyle
          ]}
        >
          <Text style={{ color: 'white', padding: SPACING }}>
            Details for {category}
          </Text>
        </Animated.View>

        <Animated.View style={[
          {
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
            backgroundColor: "black",
            borderRadius: SPACING,
            overflow: "hidden",
            position: 'absolute',
            top: 0,
            zIndex: 1,
          },
          cardStyle
        ]}>
          <View style={{
            height: ITEM_HEIGHT,
            position: 'relative',
          }}>
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
              style={[{
                position: "absolute",
                transformOrigin: "0, 0",
                left: 0,
                width: ITEM_HEIGHT,
                top: ITEM_HEIGHT,
                alignItems: "flex-start",
                paddingHorizontal: SPACING,
              }, textStyle]}
            >
              <Text style={{
                fontSize: 58,
                color: "white",
              }}>
                {category}
              </Text>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
