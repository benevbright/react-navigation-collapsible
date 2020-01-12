import * as React from 'react';
import { Animated, Dimensions, ScaledSize } from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {
  getSafeBounceHeight,
  getDefaultHeaderHeight,
  getNavigationHeight,
} from './utils';
import { CollapsibleStackConfig } from './types';
import { CollapsedHeaderBackground } from './CollapsedHeaderBackground';

const Stack = createStackNavigator();

const CollapsibleStack = (
  ScreenElement: React.ReactElement,
  config: CollapsibleStackConfig = {}
) => {
  const { options: userOptions = {}, component: UserComponent } =
    ScreenElement.props || {};

  const [positionY] = React.useState(new Animated.Value(0));
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: positionY } } }],
    {
      useNativeDriver: true,
    }
  );

  const window = Dimensions.get('window');
  const [isLandscape, setIsLandscape] = React.useState(
    window.height < window.width
  );

  const [navigationSetParam, setNavigationSetParam] = React.useState(null);

  React.useEffect(() => {
    const handleOrientationChange = ({ window }: { window: ScaledSize }) => {
      setIsLandscape(window.height < window.width);
      if (navigationSetParam) navigationSetParam({ isCollapsibleDirty: true });
    };
    Dimensions.addEventListener('change', handleOrientationChange);
    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);
    };
  }, [navigationSetParam]);

  return (
    <Stack.Screen
      {...ScreenElement.props}
      options={({
        navigation,
        route,
      }: {
        navigation: StackNavigationProp<any>;
        route: any;
      }) => {
        setNavigationSetParam(() => navigation.setParams);
        const headerHeight = getDefaultHeaderHeight(isLandscape);
        const safeBounceHeight = getSafeBounceHeight();

        const animatedDiffClampY = Animated.diffClamp(
          positionY,
          0,
          safeBounceHeight + headerHeight
        );

        const progress = animatedDiffClampY.interpolate({
          inputRange: [safeBounceHeight, safeBounceHeight + headerHeight],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        });
        const translateY = Animated.multiply(progress, -headerHeight);
        const opacity = Animated.subtract(1, progress);

        const collapsible = {
          onScroll,
          containerPaddingTop: getNavigationHeight(isLandscape, headerHeight),
          translateY,
          progress,
          opacity,
        };
        if (
          route.params?.isCollapsibleDirty ||
          route.params?.collapsible == null
        ) {
          navigation.setParams({ collapsible, isCollapsibleDirty: false });
        }

        return {
          ...userOptions,
          headerStyle: {
            ...userOptions.headerStyle,
            transform: [{ translateY }],
            opacity,
          },
          headerBackground: CollapsedHeaderBackground({
            translateY,
            opacity,
            backgroundColor: userOptions.headerStyle?.backgroundColor,
            collapsedColor:
              config.collapsedColor || userOptions.headerStyle?.backgroundColor,
          }),
          headerTransparent: true,
        };
      }}
      component={UserComponent}
    />
  );
};

export { CollapsibleStack };
