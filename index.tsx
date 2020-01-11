/* global global */
import * as React from 'react';
import {
  Animated,
  Platform,
  Dimensions,
  ScaledSize,
  View,
  StatusBar,
} from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import { isIphoneX } from 'react-native-iphone-x-helper';

let safeBounceHeight = Platform.select({ ios: 300, android: 100 });
const setSafeBounceHeight = (height: number) => {
  safeBounceHeight = height;
};

const Stack = createStackNavigator();

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
  } else if (Platform.OS === 'android') {
    // @ts-ignore
    return global.Expo ? StatusBar.currentHeight : 0;
  } else return 0;
};
const getNavigationHeight = (isLandscape: boolean, headerHeight: number) => {
  return headerHeight + getStatusBarHeight(isLandscape);
};

type Collapsible = {
  onScroll: Function;
  containerPaddingTop: number;
  translateY: Animated.Value;
  progress: Animated.Value;
  opacity: Animated.Value;
};

export type CollapsibleStackConfig = {
  iOSCollapsedColor?: string;
};

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
          headerBackground: () => (
            <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor:
                    config.iOSCollapsedColor ||
                    userOptions.headerStyle?.backgroundColor,
                }}
              />
              <Animated.View
                style={{
                  backgroundColor: userOptions.headerStyle?.backgroundColor,
                  flex: 1,
                  opacity,
                }}
              />
            </Animated.View>
          ),
          headerTransparent: true,
        };
      }}
      component={UserComponent}
    />
  );
};

const useCollapsibleStack = (): Collapsible => {
  const route = useRoute();
  // @ts-ignore
  return route.params?.collapsible || {};
};

export { CollapsibleStack, useCollapsibleStack, setSafeBounceHeight };
