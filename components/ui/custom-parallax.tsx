import { data } from "@/utils/data";
import { getColors } from 'react-native-image-colors';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue
} from "react-native-reanimated";
import { FULL_ITEM_WIDTH, ITEM_WIDTH, SPACING, width } from "../constants";
import { ParallaxItem } from "./parallax-item";
import { useRef } from "react";
import { FlatList } from "react-native";


type Prop = {
  setDominantColor: (color: string) => void;
}



export const CustomParallax = ({
  setDominantColor,
}: Prop) => {
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

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
      if(res.platform === 'android') {
        setDominantColor(res.dominant);
      } else if(res.platform === 'ios') {
        setDominantColor(res.detail);
      }
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
      getDominantColor(visibleItem.url);
    }
  };

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={extendedData}
      keyExtractor={({ department }, index) => department + index}
      horizontal
      contentContainerStyle={{
        gap: SPACING,
        alignItems: "center",
        paddingHorizontal: (width - ITEM_WIDTH) / 2,
      }}
   
      renderItem={({ item, index }) => {
        return (
          <ParallaxItem
            index={index}
            item={item}
            scrollX={scrollX}
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
  );
};
