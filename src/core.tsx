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
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollWithListener: (
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  ) => (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  containerPaddingTop: number;
  scrollIndicatorInsetTop: number;
  translateY: Animated.AnimatedInterpolation;
  progress: Animated.AnimatedInterpolation;
  opacity: Animated.AnimatedInterpolation;
  showHeader: () => void;
};

export type UseCollapsibleOptions = {
  navigationOptions?: { [key: string]: any };
  config?: {
    useNativeDriver?: boolean;
    elevation?: number;
    collapsedColor?: string;
    createHeaderBackground?: (
      params: createHeaderBackgroundParams
    ) => React.ReactNode;
  };
};

const useCollapsibleHeader = (
  options?: UseCollapsibleOptions,
  collapsibleHeaderType: CollapsibleHeaderType = CollapsibleHeaderType.Default
): Collapsible => {
  const { navigationOptions = {}, config = {} } = options || {};
  const {
    useNativeDriver = true,
    elevation,
    collapsedColor,
    createHeaderBackground = createDefaultHeaderBackground,
  } = config;

  const { headerStyle: userHeaderStyle = {} } = navigationOptions;
  const [headerStyle, setHeaderStyle] = React.useState(userHeaderStyle);
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

  const showHeader = () => {
      positionY.setValue(0);
      // Forces to show the header again
      setHeaderStyle({...headerStyle});
  }

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
        ...navigationOptions,
        headerStyle: {
          ...headerStyle,
          transform: [{ translateY }],
          opacity,
        },
        headerBackground: createHeaderBackground({
          translateY,
          opacity,
          backgroundColor: headerStyle?.backgroundColor,
          collapsedColor: collapsedColor || headerStyle?.backgroundColor,
          elevation,
          headerBackground: navigationOptions.headerBackground,
        }),
        headerTransparent: true,
      };
      if (navigationOptions.header) {
        Object.assign(options, {
          header: createCollapsibleCustomHeaderAnimator(
            navigationOptions.header
          ),
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
      scrollIndicatorInsetTop: headerHeight,
      translateY,
      progress,
      opacity,
      showHeader
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
      showHeader
    }
  );
};

const useCollapsibleSubHeader = (options?: UseCollapsibleOptions) =>
  useCollapsibleHeader(options, CollapsibleHeaderType.SubHeader);

export { useCollapsibleHeader, useCollapsibleSubHeader };
