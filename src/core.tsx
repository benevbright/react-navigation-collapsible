import * as React from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { useRoute, useNavigation } from '@react-navigation/native';
import shallowequal from 'shallowequal';

import {
  getSafeBounceHeight,
  getDefaultHeaderHeight,
  getNavigationHeight,
  getScrollIndicatorInsetTop,
  getStatusBarHeight,
} from './utils';
import { createHeaderBackground as createDefaultHeaderBackground } from './createHeaderBackground';
import { Params as createHeaderBackgroundParams } from './createHeaderBackground';
import { createCollapsibleCustomHeaderAnimator } from './createCollapsibleCustomHeaderAnimator';

enum CollapsibleHeaderType {
  Default,
  SubHeader,
}

export type Collapsible = {
  onScroll: Function;
  onScrollWithListener: (
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  ) => Function;
  containerPaddingTop: number;
  scrollIndicatorInsetTop: number;
  translateY: Animated.AnimatedInterpolation;
  progress: Animated.AnimatedInterpolation;
  opacity: Animated.AnimatedInterpolation;
};

export type UseCollapsibleOptions = {
  useNativeDriver?: boolean;
  elevation?: number;
  collapsedColor?: string;
  headerStyle?: { backgroundColor?: string; height?: number };
  createHeaderBackground?: (
    params: createHeaderBackgroundParams
  ) => React.ReactNode;
  customHeader?: (props: StackHeaderProps) => React.ReactNode;
  headerBackground?: React.ReactNode;
};

const useCollapsibleHeader = (
  options?: UseCollapsibleOptions,
  collapsibleHeaderType: CollapsibleHeaderType = CollapsibleHeaderType.Default
): Collapsible => {
  const {
    useNativeDriver = true,
    elevation,
    collapsedColor,
    headerStyle: userHeaderStyle = {},
    createHeaderBackground = createDefaultHeaderBackground,
    customHeader,
    headerBackground,
  } = options || {};

  const [headerStyle, setHeaderStyle] = React.useState<
    UseCollapsibleOptions['headerStyle']
  >(userHeaderStyle);
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

  const {
    // @ts-ignore
    collapsibleSubHeaderHeight: subHeaderHeight,
    // @ts-ignore
    collapsibleCustomHeaderHeight: customHeaderHeight,
  } = route.params || {};

  React.useLayoutEffect(() => {
    let headerHeight = 0;
    if (customHeaderHeight) {
      headerHeight = customHeaderHeight - getStatusBarHeight(isLandscape);
    } else {
      if (collapsibleHeaderType === CollapsibleHeaderType.SubHeader) {
        headerHeight = subHeaderHeight || 0;
      } else {
        headerHeight =
          headerStyle.height != null
            ? headerStyle.height - getStatusBarHeight(isLandscape)
            : getDefaultHeaderHeight(isLandscape);
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

    if (collapsibleHeaderType === CollapsibleHeaderType.Default) {
      const options = {
        headerStyle: {
          transform: [{ translateY }],
          opacity,
          ...headerStyle,
        },
        headerBackground: createHeaderBackground({
          translateY,
          opacity,
          backgroundColor: headerStyle?.backgroundColor,
          collapsedColor: collapsedColor || headerStyle?.backgroundColor,
          elevation,
          headerBackground,
        }),
        headerTransparent: true,
      };
      if (customHeader) {
        Object.assign(options, {
          header: createCollapsibleCustomHeaderAnimator(customHeader),
        });
      }
      navigation.setOptions(options);
    }

    const collapsible: Collapsible = {
      onScroll,
      onScrollWithListener,
      containerPaddingTop:
        collapsibleHeaderType === CollapsibleHeaderType.SubHeader
          ? headerHeight
          : getNavigationHeight(isLandscape, headerHeight),
      scrollIndicatorInsetTop:
        collapsibleHeaderType === CollapsibleHeaderType.SubHeader
          ? headerHeight
          : getScrollIndicatorInsetTop(isLandscape, headerHeight),
      translateY,
      progress,
      opacity,
    };
    setCollapsible(collapsible);
  }, [isLandscape, headerStyle, subHeaderHeight, customHeaderHeight]);

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

const useCollapsibleSubHeader = (options?: UseCollapsibleOptions) =>
  useCollapsibleHeader(options, CollapsibleHeaderType.SubHeader);

export { useCollapsibleHeader, useCollapsibleSubHeader };
