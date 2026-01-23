import React, { useState } from "react";
import { StyleProp, ImageStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface AnimatedImageProps {
  source: { uri: string } | number;
  style?: StyleProp<ImageStyle>;
  duration?: number;
  resizeMode?: "cover" | "contain" | "stretch" | "center";
}

export default function AnimatedImage({
  source,
  style,
  duration = 500,
  resizeMode = "cover",
}: AnimatedImageProps) {
  const opacity = useSharedValue(0);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    opacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Image
      source={source}
      style={[animatedStyle, style]}
      resizeMode={resizeMode}
      onLoad={handleLoad}
    />
  );
}