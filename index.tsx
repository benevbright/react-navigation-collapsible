import * as React from 'react';
import {
  Animated,
  Platform,
  Dimensions,
  ScaledSize,
  StatusBar,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { isIphoneX } from 'react-native-iphone-x-helper';

let safeBounceHeight = Platform.select({ ios: 300, android: 100 });
const setSafeBounceHeight = (height: number) => {
  safeBounceHeight = height;
};

const Stack = createStackNavigator();

let androidStatusBarHeight = 0;
const setExpoStatusBarHeight = height => {
  if (Platform.OS === 'android') androidStatusBarHeight = height;
};

const getDefaultHeaderHeight = (isLandscape: boolean) => {
  if (Platform.OS === 'ios') {
    if (isLandscape && !Platform.isPad) {
      return 32;
    } else {
      return 44;
    }
  } else if (Platform.OS === 'android') {
    return 56;
  }
  return 0;
};
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
  const window = Dimensions.get('window');
  const [isLandscape, setIsLandscape] = React.useState(
    window.height < window.width
  );
  const headerHeight = getDefaultHeaderHeight(isLandscape);

  React.useEffect(() => {
    const handleOrientationChange = ({ window }: { window: ScaledSize }) => {
      setIsLandscape(window.height < window.width);
    };
    Dimensions.addEventListener('change', handleOrientationChange);
  }, []);

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

  const exportCollapsibleProps = {
    onScroll,
    containerPaddingTop: getNavigationHeight(isLandscape, headerHeight),
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
      component={props => (
        <Comp {...props} collapsible={exportCollapsibleProps} />
      )}
    />
  );
};

export { CollapsibleStack, setSafeBounceHeight, setExpoStatusBarHeight };
