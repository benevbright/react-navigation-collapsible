import React, {Component} from 'react';
import { Animated, Platform, Dimensions } from 'react-native';
import withOrientation from 'react-navigation/src/views/withOrientation';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (WINDOW_HEIGHT === 812 || WINDOW_WIDTH === 812);


const defaultHeaderHeight = Platform.select({ios: 44, android: 56});
const defaultTabHeight = 50;
const getSafeBounceHeight = Platform.select({ios: 300, android: 100});

export const isOrientationLandscape = ({ width, height }) => width > height;

const getStatusBarHeight = (isLandscape) => {
  if(Platform.OS === 'android') return 0;
  if(isLandscape) return 0;
  return IS_IPHONE_X ? 44 : 20;
}
const getNavigationHeight = (isLandscape, headerHeight) => {
  return headerHeight + getStatusBarHeight(isLandscape);
}

export const createCollapsibleParams = (animated, iOSCollapsedColor = null) => {
  return {
    headerY: Animated.diffClamp(animated, 0, getSafeBounceHeight),
    iOSCollapsedColor
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
    if(!navigation || !navigation.state.params || !navigation.state.params.headerY || !navigation.state.params.headerHeight || !this.state.showFloorHeader)
      return null;

    const { headerHeight, iOSCollapsedColor, headerY } = navigation.state.params;
    const navigationHeight = getNavigationHeight(isLandscape, headerHeight);
    const bounceHeight = getSafeBounceHeight;

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







export const collapsibleOptions = (configOptions, userOptions, navigationParams, navigation) => {

  userOptions = {
    ...configOptions,
    ...userOptions,
    headerStyle:{
      ...configOptions.headerStyle,
      ...userOptions.headerStyle
    }
  };

  if(!navigationParams || !navigationParams.headerY){
    // console.log('navigationParams is null');
    return userOptions;
  }


  const { headerY } = navigationParams;
  const headerHeight = userOptions.headerStyle && userOptions.headerStyle.height 
    ? userOptions.headerStyle.height
    : defaultHeaderHeight;
  if(navigation){
    if(navigationParams.headerHeight !== headerHeight) navigation.setParams({headerHeight});
  }
  const bounceHeight = getSafeBounceHeight;

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

  const collapsibleOptions = {
    ...configOptions,
    ...userOptions,
    headerStyle: {
      ...configOptions.headerStyle,
      ...userOptions.headerStyle,
      transform: [{translateY: headerTranslate}],
      overflow: 'hidden',
      opacity: Platform.select({ios: headerOpacity, android: 1}),
      height: headerHeight,
    },
    headerTransparent: true, 
  };
  if(collapsibleOptions.collapsibleCustomHeader){
    collapsibleOptions.header = getCustomHeader(collapsibleOptions);
  }

  if(collapsibleOptions.hasTab){
    const tabHeight = collapsibleOptions.tabBarOptions && collapsibleOptions.tabBarOptions.style && collapsibleOptions.tabBarOptions.style.height
      ? collapsibleOptions.tabBarOptions.style.height
      : defaultTabHeight;
    if(navigation){
      if(navigationParams.tabHeight !== tabHeight) navigation.setParams({tabHeight});
    }
    const isLandscape = navigation.state.params && navigation.state.params.isLandscape
      ? navigation.state.params.isLandscape
      : isOrientationLandscape(Dimensions.get('window'));
    const tabStyle = collapsibleOptions.tabBarOptions ? collapsibleOptions.tabBarOptions.style : {};
    collapsibleOptions.tabBarOptions = {
      ...collapsibleOptions.tabBarOptions,
      style:{
        ...tabStyle,
        position: 'absolute',
        top: getStatusBarHeight(isLandscape) + collapsibleOptions.headerStyle.height,
        height: tabHeight,
        width: '100%',
        transform: [{translateY: headerTranslate}],
      }
    }  
  }

  if(navigationParams.isLandscape === undefined && navigation){
    const orientationListner = ({window}) => {
      navigation.setParams({isLandscape: isOrientationLandscape(window)})
    }

    navigation.addListener('willFocus', () => {
      Dimensions.addEventListener('change', orientationListner);
    });  
    navigation.addListener('willBlur', () => {
      Dimensions.removeEventListener('change', orientationListner);
    });  
  }

  return collapsibleOptions;
}


const getCustomHeader = options => {
  const CustomHeader = props => {
    const {position, layout, isLandscape, mode, index} = props;
    const headerTranslate = mode === 'float' ? position.interpolate({
      inputRange: [index - 1, index],
      outputRange: [layout.initWidth, 0]
    }) : 0;
    const statusBarHeight = getStatusBarHeight(isLandscape);
    return (
      <Animated.View style={[options.headerStyle, 
        {transform:[...options.headerStyle.transform, {translateX: headerTranslate}], position: 'absolute', top: 0, width: '100%', height: options.headerStyle.height + statusBarHeight}]}> 
        {options.collapsibleCustomHeader}
      </Animated.View>
    )
  }
  return CustomHeader;
}

export const collapsibleOptionsForTab = (props, userOptions) => {
  const {navigationOptions, navigation} = props;
  const { routes, index } = navigation.state;
  return collapsibleOptions(navigationOptions, userOptions, routes[index].params);
}

export const collapsibleTabConfig = (config) => {
  return {
    ...config,
    navigationOptions:{
      ...config.navigationOptions,
      hasTab: true
    }
  }
}

export const getCollapsibleHeaderHeight = (navigation) => {
  return (navigation.state.params && navigation.state.params.headerHeight
  ? navigation.state.params.headerHeight
  : 0);
}
export const getCollapsibleTabHeight = (navigation) => {
  return (navigation.state.params && navigation.state.params.tabHeight
  ? navigation.state.params.tabHeight
  : 0);
}