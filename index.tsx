import * as React from 'react';
import { Animated, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { isIphoneX } from 'react-native-iphone-x-helper';

const defaultHeaderHeight = Platform.select({ ios: 44, android: 56 });
let safeBounceHeight = Platform.select({ ios: 300, android: 100 });
export const setSafeBounceHeight = (height: number) => {
  safeBounceHeight = height;
};

const Stack = createStackNavigator();

const androidStatusBarHeight = 0;

const getStatusBarHeight = (isLandscape: boolean) => {
  if (Platform.OS === 'ios') {
    if (isLandscape) return 0;
    return isIphoneX() ? 44 : 20;
  } else if (Platform.OS === 'android') return androidStatusBarHeight;
  else return 0;
};
const getNavigationHeight = (isLandscape: boolean, headerHeight: number) => {
  return headerHeight + getStatusBarHeight(isLandscape);
};

export type CollapsibleProps = {
  collapsible?: {
    onScroll: Function;
    containerPaddingTop: number;
    translateY: Animated.Value;
    progress: Animated.Value;
    opacity: Animated.Value;
  };
};

const CollapsibleStack = (ScreenElement: React.ReactElement) => {
  const [positionY] = React.useState(new Animated.Value(0));
  const headerHeight = defaultHeaderHeight;
  const [containerPaddingTop] = React.useState(
    getNavigationHeight(false, headerHeight)
  );

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

  const { options = {}, component: Comp } = ScreenElement.props || {};

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: positionY } } }],
    {
      useNativeDriver: true,
    }
  );
  const collapsible = {
    onScroll,
    containerPaddingTop,
    translateY,
    progress,
    opacity,
  };
  return (
    <Stack.Screen
      {...ScreenElement.props}
      options={{
        ...options,
        headerStyle: {
          ...options.headerStyle,
          transform: [{ translateY }],
          opacity,
        },
        headerBackground: () => (
          <Animated.View
            style={{
              backgroundColor: options.headerStyle?.backgroundColor,
              flex: 1,
              transform: [{ translateY }],
            }}
          />
        ),
        headerTransparent: true,
      }}
      component={props => <Comp {...props} collapsible={collapsible} />}
    />
  );
};

export { CollapsibleStack };
