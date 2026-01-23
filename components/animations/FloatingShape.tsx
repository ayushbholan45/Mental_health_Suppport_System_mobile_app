import React, { useEffect } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

type FloatType = "slow" | "medium" | "fast" | "pulse" | "spin";

interface FloatingShapeProps {
  children: React.ReactNode;
  type?: FloatType;
  style?: StyleProp<ViewStyle>;
}

export default function FloatingShape({
  children,
  type = "slow",
  style,
}: FloatingShapeProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    switch (type) {
      case "slow":
        // Float up/down with slight rotation (6s cycle)
        translateY.value = withRepeat(
          withSequence(
            withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        rotate.value = withRepeat(
          withSequence(
            withTiming(5, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        break;

      case "medium":
        // Float with horizontal movement (5s cycle)
        translateY.value = withRepeat(
          withSequence(
            withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        translateX.value = withRepeat(
          withSequence(
            withTiming(10, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        break;

      case "fast":
        // Float with scale (4s cycle)
        translateY.value = withRepeat(
          withSequence(
            withTiming(-25, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        scale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        break;

      case "pulse":
        // Pulse opacity and scale (4s cycle)
        opacity.value = withRepeat(
          withSequence(
            withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        scale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        break;

      case "spin":
        // Very slow spin (20s cycle)
        rotate.value = withRepeat(
          withTiming(360, { duration: 20000, easing: Easing.linear }),
          -1,
          false
        );
        break;
    }
  }, [type]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}