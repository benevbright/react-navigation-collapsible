import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export type Collapsible = {
  onScroll: Function;
  onScrollWithListener: (
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  ) => Function;
  containerPaddingTop: number;
  scrollIndicatorInsetTop: number;
  translateY: Animated.AnimatedInterpolation;
  progress: Animated.AnimatedInterpolation;
  opacity: Animated.AnimatedInterpolation;
};

export type CollapsibleStackConfig = {
  collapsedColor?: string;
};
