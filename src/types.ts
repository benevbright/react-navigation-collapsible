import { Animated } from 'react-native';

export type Collapsible = {
  onScroll: Function;
  containerPaddingTop: number;
  translateY: Animated.Value;
  progress: Animated.Value;
  opacity: Animated.Value;
};

export type CollapsibleStackConfig = {
  collapsedColor?: string;
};
