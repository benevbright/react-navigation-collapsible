import * as React from 'react';
import { Animated, View } from 'react-native';

export type Params = {
  translateY: Animated.AnimatedInterpolation;
  opacity: Animated.AnimatedInterpolation;
  backgroundColor: string | null;
  collapsedColor: string | null;
};

const CollapsedHeaderBackground = ({
  translateY,
  opacity,
  backgroundColor,
  collapsedColor,
}: Params) => () => (
  <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: collapsedColor || backgroundColor,
      }}
    />
    <Animated.View
      style={{
        backgroundColor,
        flex: 1,
        opacity,
      }}
    />
  </Animated.View>
);

export { CollapsedHeaderBackground };
