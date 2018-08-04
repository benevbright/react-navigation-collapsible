import React, {Component} from 'react';
import { Animated, Platform, Dimensions } from 'react-native';
import withOrientation from 'react-navigation/src/views/withOrientation';

export const defaultHeaderHeight = Platform.select({ios: 44, android: 56});
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (WINDOW_HEIGHT === 812 || WINDOW_WIDTH === 812);

const getBounceHeight = (headerHeight) => {
  if(Platform.OS === 'android') return headerHeight + 100;
  else return headerHeight + 300;
}

const getNavigationHeight = (isLandscape, headerHeight) => {
  if(isLandscape) return headerHeight;
  else return headerHeight + Platform.select({ios: IS_IPHONE_X ? 44 : 20, android: 0});
}

export const makeCollapsibleParams = (animated, headerHeight, iOSCollapsedColor) => {
  return {
    headerY: Animated.diffClamp(animated, 0, getBounceHeight(headerHeight)),
    headerHeight: headerHeight,
    iOSCollapsedColor: iOSCollapsedColor
  }
}

class _CollapsibleHeaderBackView extends Component {
  state = {
    showFloorHeader: true
  }

  componentDidMount(){
    const { navigation } = this.props;
    this.subscribe_willBlur = navigation.addListener('willBlur', () => {
      this.setState({showFloorHeader: false});
    });

  }
  componentWillUnmount(){
    if(this.subscribe_willBlur){
      this.subscribe_willBlur.remove();
      this.subscribe_willBlur = null;
    }
  }

  render(){
    if(Platform.OS === 'android')
      return null;

    const { isLandscape, navigation } = this.props;
    if(!navigation || !navigation.state.params || !this.state.showFloorHeader)
      return null;

    const { headerHeight, iOSCollapsedColor, headerY } = navigation.state.params;
    const navigationHeight = getNavigationHeight(isLandscape, headerHeight);
    const bounceHeight = getBounceHeight(headerHeight);

    const headerTranslate = headerY.interpolate({
      inputRange: [bounceHeight - headerHeight, bounceHeight],
      outputRange: [0, -headerHeight],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View 
        style={{
          transform: [{translateY: headerTranslate}], 
          backgroundColor: iOSCollapsedColor, 
          position: 'absolute', 
          width: '100%', 
          height: navigationHeight}}/>
    )
  }
}

const CollapsibleHeaderBackView = withOrientation(_CollapsibleHeaderBackView);
export { CollapsibleHeaderBackView };

export const withCollapsibleOptions = (props, navigationOptions) => {
  const { navigation } = props;
  if(!navigation || !navigation.state.params)
    return navigationOptions;

  const { headerHeight, headerY } = navigation.state.params;
  const bounceHeight = getBounceHeight(headerHeight);

  const headerOpacity = headerY.interpolate({
    inputRange: [bounceHeight - headerHeight, bounceHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  const headerTranslate = headerY.interpolate({
    inputRange: [bounceHeight - headerHeight, bounceHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp'
  });

  return ({
    ...props.navigationOptions,
    ...navigationOptions,
    headerStyle: {
      ...props.navigationOptions.headerStyle,
      ...navigationOptions.headerStyle,
      transform: [{translateY: headerTranslate}],
      overflow: 'hidden',
      opacity: Platform.select({ios: headerOpacity, android: 1}),
      height: headerHeight,
    },
    headerTransparent: true, 
  });
}