import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { SPACING } from '../constants';

type GestureHelperProps = {
  onDismiss: () => void;
};

export const GestureHelper = ({ onDismiss }: GestureHelperProps) => {
  const swipeUpStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: withRepeat(
        withSequence(
          withTiming(-15, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        true
      ),
    }],
    opacity: withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.4, { duration: 800 })
      ),
      -1,
      true
    )
  }));

  const swipeLeftStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: withRepeat(
        withSequence(
          withTiming(-15, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        true
      ),
    }],
    opacity: withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.4, { duration: 800 })
      ),
      -1,
      true
    )
  }));


  return (
      <Animated.View 
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          gap: SPACING * 4,
        }}
      >
        <View style={{ alignItems: 'center', gap: SPACING }}>
          <View style={{ 
        
            borderRadius: SPACING * 2,
          }}>
            <Animated.View style={swipeUpStyle}>
              <Ionicons name="chevron-up" size={32} color="white" />
            </Animated.View>
          </View>
          <Text style={{ 
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}>
            Swipe up to peek details
          </Text>
          <Text style={{ 
            color: 'rgba(255,255,255,0.6)',
            fontSize: 14,
            textAlign: 'center',
            maxWidth: '80%',
          }}>
            Get insights and top rated activities
          </Text>
        </View>

        <View style={{ alignItems: 'center', gap: SPACING }}>
          <View style={{ 
       
            borderRadius: SPACING * 2,
          }}>
            <Animated.View style={swipeLeftStyle}>
              <Ionicons name="chevron-back" size={32} color="white" />
            </Animated.View>
          </View>
          <Text style={{ 
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}>
            Swipe to explore
          </Text>
          <Text style={{ 
            color: 'rgba(255,255,255,0.6)',
            fontSize: 14,
            textAlign: 'center',
            maxWidth: '80%',
          }}>
            Discover more amazing destinations
          </Text>
        </View>

        <Pressable
          onPress={onDismiss}
          style={{
            position: 'absolute',
            bottom: SPACING * 4,
            backgroundColor: 'white',
            paddingHorizontal: SPACING * 3,
            paddingVertical: SPACING/1.5,
            borderRadius: SPACING * 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text style={{ 
            fontWeight: 'bold',
            color: 'black',
            fontSize: 16,
          }}>
            Got It
          </Text>
        </Pressable>
      </Animated.View>
  );
};