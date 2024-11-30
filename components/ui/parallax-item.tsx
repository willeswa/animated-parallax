import { ItemDataType } from "@/utils/data";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
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
};

export const ParallaxItem = ({ item, index, scrollX }: ParallaxItemProp) => {
  const { department, url } = item;
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

  return (
    <View
      style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        backgroundColor: "black",
        borderRadius: SPACING,
        overflow: "hidden",
        padding: SPACING,
      }}
    >
      <Animated.View
        style={[{
          position: "absolute",
          transformOrigin: "0, 0",
          left: 0,
          width: ITEM_HEIGHT,
          top: ITEM_HEIGHT,
          alignItems: "flex-start",
         
        }, textStyle]}
      >
        <Text
          style={{
            fontSize: 80,
            color: "white",
          }}
        >
          {department}
        </Text>
      </Animated.View>
      <Animated.Image
        loadingIndicatorSource={require("../../assets/images/react-logo.png")}
        source={{
          uri: url,
            }}
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: 0.5
          },
          imageStyle,
        ]}
        resizeMode="cover"
        progressiveRenderingEnabled
      />
    </View>
  );
};
