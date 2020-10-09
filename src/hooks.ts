import * as React from 'react';
import {
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import shallowequal from 'shallowequal';

import { Collapsible } from './types';
import {
  getSafeBounceHeight,
  getDefaultHeaderHeight,
  getNavigationHeight,
  getScrollIndicatorInsetTop,
  getStatusBarHeight,
} from './utils';
import { CollapsedHeaderBackground } from './CollapsedHeaderBackground';

type Config = {
  useNativeDriver?: boolean;
  collapsibleCustomHeaderHeight?: number;
  elevation?: number;
  collapsedColor?: string;
  headerStyle?: { backgroundColor?: string; height?: number };
};

const useCollapsibleStack = (config?: Config): Collapsible => {
  const {
    useNativeDriver = true,
    collapsibleCustomHeaderHeight,
    elevation,
    collapsedColor,
    headerStyle: userHeaderStyle = {},
  } = config || {};
  const [headerStyle, setHeaderStyle] = React.useState<Config['headerStyle']>(
    userHeaderStyle
  );
  React.useEffect(() => {
    if (!shallowequal(headerStyle, userHeaderStyle))
      setHeaderStyle(userHeaderStyle);
  }, [userHeaderStyle]);

  const [collapsible, setCollapsible] = React.useState<Collapsible>();
  const { width, height } = useWindowDimensions();
  const isLandscape = height < width;

  const route = useRoute();
  const navigation = useNavigation();

  const positionY = React.useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: positionY } } }],
    { useNativeDriver }
  );
  const onScrollWithListener = (
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  ) =>
    Animated.event([{ nativeEvent: { contentOffset: { y: positionY } } }], {
      useNativeDriver,
      listener,
    });

  React.useLayoutEffect(() => {
    let headerHeight = 0;
    if (collapsibleCustomHeaderHeight) {
      headerHeight =
        collapsibleCustomHeaderHeight - getStatusBarHeight(isLandscape);
    } else {
      headerHeight =
        headerStyle.height != null
          ? headerStyle.height - getStatusBarHeight(isLandscape)
          : getDefaultHeaderHeight(isLandscape);
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

    const options = {
      headerStyle: {
        transform: [{ translateY }],
        opacity,
        ...headerStyle,
      },
      headerBackground: CollapsedHeaderBackground({
        translateY,
        opacity,
        backgroundColor: headerStyle?.backgroundColor,
        collapsedColor: collapsedColor || headerStyle?.backgroundColor,
        elevation,
      }),
      headerTransparent: true,
    };
    navigation.setOptions(options);

    const collapsible: Collapsible = {
      onScroll,
      onScrollWithListener,
      containerPaddingTop: getNavigationHeight(isLandscape, headerHeight),
      scrollIndicatorInsetTop: getScrollIndicatorInsetTop(
        isLandscape,
        headerHeight
      ),
      translateY,
      progress,
      opacity,
    };
    setCollapsible(collapsible);
  }, [isLandscape, headerStyle]);

  return (
    collapsible || {
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
