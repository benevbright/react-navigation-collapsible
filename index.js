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

const getSafeBounceHeight = (headerHeight) => {
  if(Platform.OS === 'android') return headerHeight + 100;
  else return headerHeight + 300;
}

const getStatusBarHeight = (isLandscape) => {
  if(Platform.OS === 'android') return 0;
  if(isLandscape) return 0;
  return IS_IPHONE_X ? 44 : 20;
}
const getNavigationHeight = (isLandscape, headerHeight) => {
  return headerHeight + getStatusBarHeight(isLandscape);
}

export const makeCollapsibleParams = (animated, headerHeight, iOSCollapsedColor) => {
  return {
    headerY: Animated.diffClamp(animated, 0, getSafeBounceHeight(headerHeight)),
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
    this.subscribe_willFocus = navigation.addListener('willFocus', () => {
      this.setState({showFloorHeader: true});
    });
    this.subscribe_willBlur = navigation.addListener('willBlur', () => {
      this.setState({showFloorHeader: false});
    });
  }
  componentWillUnmount(){
    if(this.subscribe_willFocus){
      this.subscribe_willFocus.remove();
      this.subscribe_willFocus = null;
    }
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
    const bounceHeight = getSafeBounceHeight(headerHeight);

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

export const withCollapsibleOptions = (srcNavigationOptions, newNavigationOptions, navigationParams) => {
  if(!navigationParams){
    // console.log('navigationParams is null');
    return {
      ...srcNavigationOptions,
      ...newNavigationOptions,
      headerStyle:{
        ...srcNavigationOptions.headerStyle,
        ...newNavigationOptions.headerStyle
      }
    }
  }

  const { headerHeight, headerY } = navigationParams;
  const bounceHeight = getSafeBounceHeight(headerHeight);

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

  const newOptions = {
    ...srcNavigationOptions,
    ...newNavigationOptions,
    headerStyle: {
      ...srcNavigationOptions.headerStyle,
      ...newNavigationOptions.headerStyle,
      transform: [{translateY: headerTranslate}],
      overflow: 'hidden',
      opacity: Platform.select({ios: headerOpacity, android: 1}),
      height: headerHeight,
    },
    headerTransparent: true, 
  };
  if(newOptions.header){
    newOptions.header = 
      <Animated.View style={[newOptions.headerStyle, 
        {position: 'absolute', top: 0, width: '100%', height: newOptions.headerStyle.height + getStatusBarHeight(false)}]}> 
        {/* todo: support landscape */}
        {newOptions.header}
      </Animated.View>
  }

  // console.log('newOptions', newOptions);
  return newOptions;
}