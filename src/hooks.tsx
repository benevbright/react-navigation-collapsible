import * as React from 'react';
import { Animated, View } from 'react-native';
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
  minScroll = 0,
  useNativeDriver = true,
  headerTransparent = true,
  collapsibleSubStack = false,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
} = {}) => {
  // let headerLoaded = false;
  // let substackLoaded = false;

  const navigation = useNavigation();

  // Create a new reference for the vertical scroll position
  const positionY = useRef(new Animated.Value(0)).current;

  // Height of `headerBackground`
  const [headerHeight, setHeaderHeight] = React.useState(0);

  // Calculate the height of the sticky header children (if present)
  const [
    collapsibleSubStackHeight,
    setCollapsibleSubStackHeight,
  ] = React.useState(0);

  // Initialize variables
  const [translateY, setTranslateY] = React.useState(new Animated.Value(0));

  // Set default opacity
  let opacity = 1;

  // Where the content should start from (inclusive of optional collapsibleSubStackHeight)
  const containerPaddingTop = headerHeight + collapsibleSubStackHeight;

  // Calculate where the scrollindicator should start from (inclusive of optional collapsibleSubStackHeight)
  const scrollIndicatorInsetTop =
    containerPaddingTop - insets.top > 0 ? containerPaddingTop - insets.top : 0;

  const handleLayoutCollapsedHeaderBackground = React.useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  }, []);

  const handleLayoutCollapsibleSubStack = React.useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    setCollapsibleSubStackHeight(height);
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
          height: '100%',
          position: 'absolute',
          width: '100%',
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
  // eslint-disable-next-line react/prop-types
  const CollapsibleSubStack = ({ children }) => (
    <Animated.View
      onLayout={handleLayoutCollapsibleSubStack}
      style={{
        backgroundColor: collapsedColor,
        left: 0,
        position: 'absolute',
        right: 0,
        top: headerHeight,
        transform: [{ translateY }],
        zIndex: 1,
        opacity,
      }}>
      {children}
    </Animated.View>
  );

  const collapsibleStackOpacity = useRef(new Animated.Value(0)).current;

  // Create a Component to wrap the scrollable content
  // Fade in the content when loaded
  // eslint-disable-next-line react/prop-types
  const CollapsibleStack = ({ children }) => (
    <Animated.FlatList
      contentContainerStyle={{
        paddingTop: containerPaddingTop,
      }}
      data={[0]}
      keyExtractor={(_, index) => index.toString()}
      listKey={collapsibleStackListKey}
      // nestedScrollEnabled
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
      // Issue with the indicator appearing in the middle?
      scrollIndicatorInsets={{
        top: scrollIndicatorInsetTop,
        // Fixing the weird issue with scrollbar showing up in a strange place?!
        // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
        right: 1,
      }}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    />
  );

  // Run when the page has loaded and the onLayouts have finished
  React.useEffect(() => {
    const headerHasLoaded = !!headerHeight;

    // if (headerHasLoaded && !headerLoaded) {
    //   headerLoaded = true;
    //   Alert.alert('Loaded');

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
    // Needs to update state in order to allow CollapsibleSubStack to move
    setTranslateY(
      // @ts-ignore
      Animated.diffClamp(minusScrollY, -headerHeight + insets.top, 0)
    );

    // Update opacity with headerHeight from 0 to 1
    // @ts-ignore
    opacity = translateY.interpolate({
      extrapolate: 'clamp',
      inputRange: [-headerHeight, 0],
      outputRange: [0, 1],
    });

    const subStackHasLoaded = !!headerHeight && !!collapsibleSubStackHeight;

    // if (subStackHasLoaded && !substackLoaded) {
    // substackLoaded = true;
    // Alert.alert('Substack Loaded');

    // Fade in the content on the page to prevent jumping
    // If the `CollapsibleSubStack` option has been provided, check if it has loaded
    if (
      headerHasLoaded &&
      (!collapsibleSubStack || (collapsibleSubStack && subStackHasLoaded))
    ) {
      Animated.timing(collapsibleStackOpacity, {
        duration: collapsibleStackOpacityDuration,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }

    // Load header, this will first load once to load the headerBackground
    // then, once the `headerHeight` has been calculated it will update with
    // computed values for `opacity` and `translateY`
    // This causes an issue with the scroll indicator on Flatlist
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
    headerHeight,
  };
};
