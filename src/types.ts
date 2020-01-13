import { Animated } from 'react-native';

export type Collapsible = {
  onScroll: Function;
  containerPaddingTop: number;
  scrollIndicatorInsetTop: number;
  translateY: Animated.AnimatedInterpolation;
  progress: Animated.AnimatedInterpolation;
  opacity: Animated.AnimatedInterpolation;
};

export type CollapsibleStackConfig = {
  collapsedColor?: string;
};
