import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../constants';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CustomNavbarProps = {
  isPeeked: boolean;
};

export const CustomNavbar = ({ isPeeked }: CustomNavbarProps) => {
  const getAnimatedStyle = (pressed: boolean) => useAnimatedStyle(() => ({
    transform: [{
      scale: withSpring(pressed ? 0.9 : 1, {
        mass: 0.5,
        damping: 12,
        stiffness: 400,
      })
    }]
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isPeeked ? 0 : 1, {
      mass: 0.5,
      damping: 12,
      stiffness: 100,
    }),
    transform: [{
      translateY: withSpring(isPeeked ? 50 : 0, {
        mass: 0.5,
        damping: 12,
        stiffness: 400,
      })
    }]
  }));

  return (
    <Animated.View style={[{
      position: 'absolute',
      bottom: SPACING,
      left: SPACING,
      right: SPACING,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: SPACING * 2,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    }, containerStyle]}>
      {[
        { icon: 'map-outline', label: 'Itineraries' },
        { icon: 'settings-outline', label: 'Settings' },
        { icon: 'person-outline', label: 'Account' },
      ].map((item, index) => (
        <AnimatedPressable
          key={index}
          onPress={() => {}}
          style={({ pressed }) => [getAnimatedStyle(pressed)]}
        >
          <View style={{ alignItems: 'center', gap: SPACING/4 }}>
            <Ionicons name={item.icon as any} size={24} color="black" />
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>{item.label}</Text>
          </View>
        </AnimatedPressable>
      ))}
    </Animated.View>
  );
};