import * as React from 'react';
import { Animated, View, Alert } from 'react-native';
import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useCollapsibleStack = ({
  backgroundColor = 'transparent',
  collapsedColor = 'transparent',
  collapsibleStackListKey = 'collapsibleStackListKey',
  collapsibleStackOpacityDuration = 500,
  headerStyle = {},
  insets = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  height = '100%',
  minScroll = 0,
  position = 'absolute',
  useNativeDriver = true,
  width = '100%',
  headerTransparent = true,
  collapsibleSubStack = false,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
} = {}) => {
  let headerLoaded = false;
  let substackLoaded = false;

  const navigation = useNavigation();

  // Create a new reference for the vertical scroll position
  const positionY = useRef(new Animated.Value(0)).current;

  // Height of `headerBackground`
  const [headerHeight, setHeaderHeight] = React.useState(0);

  // Calculate the height of the sticky header children (if present)
  const [
    collapsibleSubStackHeight,
    setcollapsibleSubStackHeight,
  ] = React.useState(0);

  // Initialize variables
  // const [translateY, setTranslateY] = React.useState(new Animated.Value(0));
  const translateY = new Animated.Value(0);
  let opacity = 1;
  const containerPaddingTop = headerHeight;
  // const [translateYSticky, setTranslateYSticky] = React.useState(
  //   new Animated.Value(0)
  // );
  const translateYSticky = new Animated.Value(0);

  // Calculate scroll inset
  const scrollIndicatorInsetTop =
    containerPaddingTop - insets.top + collapsibleSubStackHeight;

  const handleLayoutCollapsedHeaderBackground = React.useCallback(event => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  }, []);

  const handleLayoutCollapsibleSubStack = React.useCallback(event => {
    const { height } = event.nativeEvent.layout;
    setcollapsibleSubStackHeight(height);
  }, []);

  // Create scroll event to measure when the vertical scroll position changes
  const onScroll = React.useCallback(
    Animated.event([{ nativeEvent: { contentOffset: { y: positionY } } }], {
      listener: () => {
        console.log('scrolling for debug');
      },
      useNativeDriver,
    }),
    []
  );

  const CollapsedHeaderBackground = ({
    backgroundColor,
    collapsedColor,
    opacity,
    translateY,
  }) => () => (
    <Animated.View
      onLayout={handleLayoutCollapsedHeaderBackground}
      style={{
        flex: 1,
        transform: [{ translateY }],
      }}>
      <View
        style={{
          backgroundColor: collapsedColor || backgroundColor,
          height,
          position,
          width,
        }}
      />
      <Animated.View
        style={{
          backgroundColor,
          flex: 1,
          opacity,
        }}
      />
    </Animated.View>
  );

  // Create a Component to wrap the sticky header content
  const CollapsibleSubStack = ({ children }) => (
    <Animated.View
      onLayout={handleLayoutCollapsibleSubStack}
      style={{
        backgroundColor: collapsedColor,
        left: 0,
        // paddingTop: insets.top,
        position: 'absolute',
        right: 0,
        top: headerHeight,
        transform: [{ translateY: translateYSticky }],
        zIndex: 1,
      }}>
      {children}
    </Animated.View>
  );

  const collapsibleStackOpacity = useRef(new Animated.Value(0)).current;

  // Create a Component to wrap the scrollable content
  const CollapsibleStack = ({ children }) => (
    <Animated.FlatList
      contentContainerStyle={{
        paddingTop: containerPaddingTop,
      }}
      data={[0]}
      keyExtractor={(_, index) => index.toString()}
      listKey={collapsibleStackListKey}
      nestedScrollEnabled
      onScroll={onScroll}
      renderItem={() => (
        <Animated.View
          style={{
            flex: 1,
            opacity: collapsibleStackOpacity,
          }}>
          {children}
        </Animated.View>
      )}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    />
  );

  // Run when the page has loaded and the onLayouts have finished
  React.useEffect(() => {
    const headerHasLoaded = !!headerHeight;

    if (headerHasLoaded && !headerLoaded) {
      headerLoaded = true;
      // Alert.alert('Loaded');

      // When reaching the end of a FlatList or ScrollView on iOS, the screen will bounce and scroll the other way which will trigger the header to show again
      const clampedScrollY = positionY.interpolate({
        extrapolateLeft: 'clamp',
        inputRange: [minScroll + 0, minScroll + 1],
        outputRange: [0, 1],
      });

      // Creates a new Animated value composed from two Animated values multiplied together.
      // By multiplying by -1, we make the clamped (limited by range) scroll value negative
      const minusScrollY = Animated.multiply(clampedScrollY, -1);

      // Calculate how much to move the header
      // Maximum update depth exceeded.
      // setTranslateY(
      translateY = Animated.diffClamp(
        minusScrollY,
        // Adding collapsibleSubStackHeight to prevent header scrolling over sticky content
        // -(headerHeight + collapsibleSubStackHeight),
        -headerHeight,
        0
      );
      // );
      console.log('translateY', translateY);

      // Update opacity with headerHeight from 0 to 1
      opacity = translateY.interpolate({
        extrapolate: 'clamp',
        inputRange: [-headerHeight, 0],
        outputRange: [0, 1],
      });
    }

    const subStackHasLoaded = !!headerHeight && !!collapsibleSubStackHeight;
    if (subStackHasLoaded && !substackLoaded) {
      substackLoaded = true;
      // Alert.alert('Substack Loaded');

      // Interpolate a range so that the translateY stops the sticky content from moving
      const clampedScrollYSticky = positionY.interpolate({
        extrapolate: 'clamp',
        // headerHeight is added to make sure content moves together
        inputRange: [0, headerHeight + collapsibleSubStackHeight],
        outputRange: [0, -(headerHeight + collapsibleSubStackHeight)],
      });

      // Calculate how much to move the CollapsibleSubStack
      // setTranslateYSticky(
      translateYSticky = Animated.diffClamp(
        clampedScrollYSticky,
        // Fold with CollapsibleSubStack with Header
        // -(collapsibleSubStackHeight - headerHeight),
        -collapsibleSubStackHeight,
        0
      );
      // );

      // ALSO works to stop, but needs to move down immediately with header
      // setTranslateYSticky(
      //   positionY.interpolate({
      //     extrapolate: 'clamp',
      //     inputRange: [0, collapsibleSubStackHeight],
      //     outputRange: [0, -collapsibleSubStackHeight],
      //   }),
      // );
    }

    // Fade in the content on the page to prevent jumping
    // If the `CollapsibleSubStack` option has been provided, check if it has loaded
    if (
      headerHasLoaded &&
      (!collapsibleSubStack || (collapsibleSubStack && subStackHasLoaded))
    ) {
      // Alert.alert('Fade in');
      Animated.timing(collapsibleStackOpacity, {
        duration: collapsibleStackOpacityDuration,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }

    // Load header, this will first load once to load the headerBackground
    // then, once the `headerHeight` has been calculated it will update with
    // computed values for `opacity` and `translateY`
    navigation.setOptions({
      headerBackground: CollapsedHeaderBackground({
        backgroundColor,
        collapsedColor,
        opacity,
        translateY,
      }),
      headerStyle: {
        ...headerStyle,
        opacity,
        transform: [{ translateY }],
      },
      headerTransparent,
    });
    // Run once headerHeight, collapsibleSubStackHeight have been calculated
  }, [headerHeight, collapsibleSubStackHeight]);

  return {
    CollapsibleStack,
    CollapsibleSubStack,
    collapsibleSubStackHeight,
    containerPaddingTop,
    onScroll,
    scrollIndicatorInsetTop,
    translateY,
    translateYSticky,
    headerHeight,
  };
};
