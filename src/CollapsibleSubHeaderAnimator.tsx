import * as React from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CollapsibleSubHeaderAnimator = ({
  children,
  translateY,
}: {
  children: React.ReactNode;
  translateY: Animated.AnimatedInterpolation;
}) => {
  const navigation = useNavigation();

  const handleLayout = ({
    nativeEvent: {
      layout: { height = 0 },
    },
  }) => {
    navigation.setParams({
      // @ts-ignore
      collapsibleSubHeaderHeight: height,
    });
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: 'absolute',
        width: '100%',
      }}
      onLayout={handleLayout}>
      {children}
    </Animated.View>
  );
};

export { CollapsibleSubHeaderAnimator };
