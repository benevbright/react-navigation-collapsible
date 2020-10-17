import * as React from 'react';
import { Animated, View } from 'react-native';
import { getElevationStyle } from './utils';

export type Params = {
  translateY: Animated.AnimatedInterpolation;
  opacity: Animated.AnimatedInterpolation;
  backgroundColor: string | null;
  collapsedColor: string | null;
  elevation?: number;
  headerBackground?: React.ReactNode;
};

const createHeaderBackground = ({
  translateY,
  opacity,
  backgroundColor,
  collapsedColor,
  elevation,
  headerBackground,
}: Params) => () => (
  <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
    <View
      style={[
        {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: collapsedColor || backgroundColor,
        },
        elevation != null ? getElevationStyle(elevation) : null,
      ]}
    />
    <Animated.View
      style={{
        backgroundColor,
        flex: 1,
        opacity,
        elevation,
      }}>
      {headerBackground}
    </Animated.View>
  </Animated.View>
);

export { createHeaderBackground };
