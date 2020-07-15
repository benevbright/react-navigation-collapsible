import { ReactNode } from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';

import { Params as CollapsedHeaderBackgroundParams } from './CollapsedHeaderBackground';

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
  useNativeDriver?: boolean;
  CollapsedHeaderBackground?: (
    params: CollapsedHeaderBackgroundParams
  ) => ReactNode;
  key?: string;
  elevation?: number;
  header?: ((props: StackHeaderProps) => React.ReactNode) | undefined;
};
