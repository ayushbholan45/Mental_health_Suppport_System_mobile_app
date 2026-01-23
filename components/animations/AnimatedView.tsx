import React, { useEffect, useState } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

type AnimationType = "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale";

interface AnimatedViewProps {
  children: React.ReactNode;
  animation?: AnimationType | AnimationType[];
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedView({
  children,
  animation = "fade",
  delay = 0,
  duration = 700,
  style,
}: AnimatedViewProps) {
  const [ready, setReady] = useState(false);
  const animations = Array.isArray(animation) ? animation : [animation];
  
  const getInitialY = () => {
    if (animations.includes("slideUp")) return 30;
    if (animations.includes("slideDown")) return -30;
    return 0;
  };
  
  const getInitialX = () => {
    if (animations.includes("slideLeft")) return 30;
    if (animations.includes("slideRight")) return -30;
    return 0;
  };

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(getInitialY());
  const translateX = useSharedValue(getInitialX());
  const scale = useSharedValue(animations.includes("scale") ? 0.95 : 1);

  useEffect(() => {
    // Small timeout to ensure component is mounted
    const timer = setTimeout(() => {
      setReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) {
      const timingConfig = {
        duration,
        easing: Easing.out(Easing.cubic),
      };

      opacity.value = withDelay(delay, withTiming(1, timingConfig));
      translateY.value = withDelay(delay, withTiming(0, timingConfig));
      translateX.value = withDelay(delay, withTiming(0, timingConfig));
      scale.value = withDelay(delay, withTiming(1, timingConfig));
    }
  }, [ready]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}