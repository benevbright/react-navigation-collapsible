import * as React from 'react';
import { Animated, View } from 'react-native';
import { getElevationStyle } from './utils';

export type Params = {
  translateY: Animated.AnimatedInterpolation;
  opacity: Animated.AnimatedInterpolation;
  backgroundColor: string | null;
  collapsedColor: string | null;
  elevation: number | 0;
};

const CollapsedHeaderBackground = ({
  translateY,
  opacity,
  backgroundColor,
  collapsedColor,
  elevation
}: Params) => () => (
  <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
    <View
      style={[{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: (collapsedColor || backgroundColor),
      }, getElevationStyle(elevation)]}
    />
    <Animated.View
      style={{
        backgroundColor,
        flex: 1,
        opacity,
        elevation,
      }}
    />
  </Animated.View>
);

export { CollapsedHeaderBackground };
