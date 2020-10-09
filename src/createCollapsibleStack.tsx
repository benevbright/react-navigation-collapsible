import * as React from 'react';
import {
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackHeaderProps,
} from '@react-navigation/stack';

import {
  getSafeBounceHeight,
  getDefaultHeaderHeight,
  getNavigationHeight,
  getScrollIndicatorInsetTop,
  getStatusBarHeight,
} from './utils';
import { CollapsibleStackConfig, Collapsible } from './types';
import { createHeaderBackground as defaultCreateHeaderBackground } from './createHeaderBackground';
import { CollapsedHeaderContainer } from './CollapsedHeaderContainer';

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
      useNativeDriver:
        config.useNativeDriver === undefined ? true : config.useNativeDriver,
    }
  );
  const onScrollWithListener = (
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  ) =>
    Animated.event([{ nativeEvent: { contentOffset: { y: positionY } } }], {
      useNativeDriver:
        config.useNativeDriver === undefined ? true : config.useNativeDriver,
      listener,
    });

  const createHeaderBackground =
    config.createHeaderBackground || defaultCreateHeaderBackground;

  return (
    <Stack.Screen
      {...ScreenElement.props}
      key={config.key}
      options={({
        navigation,
        route,
      }: {
        navigation: StackNavigationProp<any>;
        route: any;
      }) => {
        if (typeof userOptions === 'function')
          userOptions = userOptions({ navigation, route });

        if (config.header) {
          const animatedHeader = (props: StackHeaderProps) => (
            <CollapsedHeaderContainer header={config.header} {...props} />
          );
          userOptions.header = animatedHeader;
        }

        const window = Dimensions.get('window');
        const isLandscape = window.height < window.width;

        let headerHeight = 0;
        if (route.params?.collapsibleCustomHeaderHeight) {
          headerHeight =
            route.params.collapsibleCustomHeaderHeight -
            getStatusBarHeight(isLandscape);
        } else {
          if (collapsibleTarget === CollapsibleTarget.SubHeader) {
            headerHeight = route.params?.collapsibleSubHeaderHeight || 0;
          } else {
            if (userOptions.headerStyle?.height != null) {
              headerHeight =
                userOptions.headerStyle.height -
                getStatusBarHeight(isLandscape);
            } else {
              headerHeight = getDefaultHeaderHeight(isLandscape);
            }
          }
        }
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
          onScrollWithListener,
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
              headerBackground: createHeaderBackground({
                translateY,
                opacity,
                backgroundColor: userOptions.headerStyle?.backgroundColor,
                collapsedColor:
                  config.collapsedColor ||
                  userOptions.headerStyle?.backgroundColor,
                elevation: config.elevation,
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
