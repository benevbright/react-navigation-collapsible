import * as React from 'react';
import { Dimensions } from 'react-native';
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
      containerPaddingTop: 0,
      scrollIndicatorInsetTop: 0,
      translateY: 0,
      progress: 0,
      opacity: 1,
    }
  );
};

export { useCollapsibleStack };
