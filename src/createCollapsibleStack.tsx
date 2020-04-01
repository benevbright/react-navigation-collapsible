import * as React from 'react';
import { Animated, Dimensions } from 'react-native';
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

  const positionY = React.useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: positionY } } }],
    {
      useNativeDriver: true,
    }
  );

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

        const window = Dimensions.get('window');
        const isLandscape = window.height < window.width;

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
