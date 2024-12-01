import { data } from "@/utils/data";
import { useRef, useState } from "react";
import { FlatList, View, Text, Image, ScrollView } from "react-native";
import { getColors } from "react-native-image-colors";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FULL_ITEM_WIDTH, ITEM_WIDTH, SPACING, width } from "../constants";
import { ParallaxItem } from "./parallax-item";

type Prop = {
  setDominantColor: (color: string) => void;
  onPeekChange: (isPeeked: boolean) => void; // Add this prop
};

export const CustomParallax = ({ setDominantColor, onPeekChange }: Prop) => {
  const scrollX = useSharedValue(0);
  const activeIndex = useSharedValue(-1);
  const flatListRef = useRef<FlatList | null>(null);
  const [dominantColor, setDominantColorState] = useState("white");
  const scrollRef = useAnimatedRef(); // Add this line
  const [activeItem, setActiveItem] = useState(data[0]); // Track the active item
  const [isPeeked, setIsPeeked] = useState(false); // Track the peek state

  const extendedData = [...data, ...data]; // Duplicate the data

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x / FULL_ITEM_WIDTH;
  });

  const onMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / FULL_ITEM_WIDTH);

    if (index >= data.length) {
      flatListRef.current?.scrollToOffset({
        offset: contentOffsetX - data.length * FULL_ITEM_WIDTH,
        animated: false,
      });
    } else if (index < 0) {
      flatListRef.current?.scrollToOffset({
        offset: contentOffsetX + data.length * FULL_ITEM_WIDTH,
        animated: false,
      });
    }
  };

  const getDominantColor = async (url: string) => {
    try {
      const res = await getColors(url);
      const color = res.platform === "ios" ? res.secondary : res.dominant;
      setDominantColor(color);
      setDominantColorState(color);
    } catch (error) {
      console.log(error);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item;
      getDominantColor(visibleItem.image);
      setActiveItem(visibleItem); // Update the active item
    }
  };

  const topPlacesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isPeeked ? 0 : 1, {
      mass: 0.5,
      damping: 12,
      stiffness: 100,
    }),
    transform: [{
      translateY: withSpring(isPeeked ? -50 : 0, {
        mass: 0.5,
        damping: 12,
        stiffness: 400,
      })
    }]
  }));

  // Add this helper function
  const isColorLight = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  // Get text color based on background
  const getTextColor = (bgColor: string) => {
    return isColorLight(bgColor) ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)";
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[topPlacesAnimatedStyle]}>
        {!isPeeked && (
          <View
            style={{
              marginTop: SPACING * 4,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              marginLeft: SPACING/2,
              paddingVertical: SPACING,
              paddingHorizontal: SPACING/4,
              borderTopLeftRadius: SPACING,
              borderBottomLeftRadius: SPACING,
              borderColor: getTextColor(dominantColor),
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: SPACING/2,
                marginBottom: SPACING / 2,
                color: getTextColor(dominantColor),
              }}
            >
              Top places in {activeItem.category.toLowerCase()}
            </Text>
            <Text
             style={{
              marginLeft: SPACING/2,
              marginBottom: SPACING / 2,
              color: getTextColor(dominantColor),
              opacity: 0.8,
            }}>
              {activeItem.peek.description}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingHorizontal: SPACING/2 }}
            >
              {activeItem.places.map((place, index) => (
                <View
                  key={index}
                  style={{
                    borderRadius: SPACING / 2,
                    marginRight: SPACING / 2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                    width: ITEM_WIDTH * 0.7, // Smaller width
                    height: 100, // Fixed height for landscape orientation
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image
                    source={{ uri: place.image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      padding: SPACING / 2,
                    }}
                  >
                    <Text
                      style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
                    >
                      {place.name}
                    </Text>
                    <Text style={{ color: "white", marginTop: 4 }}>
                      Rating: {place.rating}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </Animated.View>

      <Animated.FlatList
        ref={(ref) => {
          if (flatListRef.current !== ref) {
            flatListRef.current = ref;
          }
          scrollRef.current = ref;
        }}
        data={extendedData}
        keyExtractor={({ category }, index) => category + index}
        horizontal
        contentContainerStyle={{
          gap: SPACING,
          paddingHorizontal: (width - ITEM_WIDTH) / 2,
          paddingTop: SPACING,
        }}
        renderItem={({ item, index }) => {
          return (
            <ParallaxItem
              index={index}
              item={item}
              scrollX={scrollX}
              dominantColor={dominantColor}
              activeIndex={activeIndex}
              scrollRef={scrollRef} // Add this prop
              onPeekChange={(isPeeked) => {
                setIsPeeked(isPeeked);
                onPeekChange(isPeeked);
              }}
            />
          );
        }}
        snapToInterval={FULL_ITEM_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    </View>
  );
};
