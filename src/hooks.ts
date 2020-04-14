import * as React from 'react';
import { Dimensions, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Collapsible } from './types';

const useCollapsibleStack = (): Collapsible => {
  const route = useRoute();
  const navigation = useNavigation();

  const handleOrientationChange = () => {
    navigation.setParams({ isCollapsibleDirty: true });
  };
  React.useEffect(() => {
    Dimensions.addEventListener('change', handleOrientationChange);
    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return (
    // @ts-ignore
    route.params?.collapsible || {
      onScroll: null,
      onScrollWithListener: e => null,
      containerPaddingTop: 0,
      scrollIndicatorInsetTop: 0,
      translateY: new Animated.Value(0),
      progress: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }
  );
};

export { useCollapsibleStack };
