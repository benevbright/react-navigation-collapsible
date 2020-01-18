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
  getScrollIndicatorInsetTop,
} from './utils';
import { CollapsibleStackConfig, Collapsible } from './types';
import { CollapsedHeaderBackground } from './CollapsedHeaderBackground';

const Stack = createStackNavigator();

enum CollapsibleTarget {
  Default,
  SubHeader,
}

const createCollapsibleStack = (
  ScreenElement: React.ReactElement,
  config: CollapsibleStackConfig = {},
  collapsibleTarget: CollapsibleTarget = CollapsibleTarget.Default
) => {
  const { options = {}, component: UserComponent } = ScreenElement.props || {};
  let userOptions = options;

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
        if (typeof userOptions === 'function')
          userOptions = userOptions({ navigation, route });

        setNavigationSetParam(() => navigation.setParams);
        const headerHeight =
          collapsibleTarget === CollapsibleTarget.SubHeader
            ? route.params?.collapsibleSubHeaderHeight || 0
            : getDefaultHeaderHeight(isLandscape);
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

        const collapsible: Collapsible = {
          onScroll,
          containerPaddingTop:
            collapsibleTarget === CollapsibleTarget.SubHeader
              ? headerHeight
              : getNavigationHeight(isLandscape, headerHeight),
          scrollIndicatorInsetTop:
            collapsibleTarget === CollapsibleTarget.SubHeader
              ? headerHeight
              : getScrollIndicatorInsetTop(isLandscape, headerHeight),
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

        return collapsibleTarget === CollapsibleTarget.SubHeader
          ? userOptions
          : {
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
                  config.collapsedColor ||
                  userOptions.headerStyle?.backgroundColor,
              }),
              headerTransparent: true,
            };
      }}
      component={UserComponent}
    />
  );
};

const createCollapsibleStackSub = (
  ScreenElement: React.ReactElement,
  config: CollapsibleStackConfig = {}
) => createCollapsibleStack(ScreenElement, config, CollapsibleTarget.SubHeader);

export { createCollapsibleStack, createCollapsibleStackSub };
