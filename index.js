import React, {Component} from 'react';
import { Animated, Platform, Dimensions, View } from 'react-native';
import withOrientation from 'react-navigation/src/views/withOrientation';
import hoistNonReactStatic from 'hoist-non-react-statics';
import SafeAreaView from 'react-native-safe-area-view';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (WINDOW_HEIGHT === 812 || WINDOW_WIDTH === 812);


const defaultHeaderHeight = Platform.select({ios: 44, android: 56});
const defaultTabHeight = 50;
const safeBounceHeight = Platform.select({ios: 300, android: 100});

const isOrientationLandscape = ({ width, height }) => width > height;

const getStatusBarHeight = (isLandscape) => {
  if(Platform.OS === 'android') return 0;
  if(isLandscape) return 0;
  return IS_IPHONE_X ? 44 : 20;
}
const getNavigationHeight = (isLandscape, headerHeight) => {
  return headerHeight + getStatusBarHeight(isLandscape);
}

const createCollapsibleParams = (animated) => {
  return {
    scrollY: animated,
    headerY: Animated.diffClamp(animated, 0, safeBounceHeight)
  }
}

const CollapsibleExtraHeader = props => {
  const { headerY, children, style } = props;
  if(!headerY)
    return null;

  const height = style.height || 0;
  const headerTranslate = headerY.interpolate({
    inputRange: [safeBounceHeight - height, safeBounceHeight],
    outputRange: [0, -height],
    extrapolate: 'clamp'
  });
  const headerOpacity = headerY.interpolate({
    inputRange: [safeBounceHeight - height, safeBounceHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  return (
    <Animated.View style={[style, {
      width: '100%', 
      zIndex: 100,
      position: 'absolute',
      transform: [{translateY: headerTranslate}]}]}>
      <Animated.View style={{width: '100%', height: '100%', opacity: headerOpacity}}>
        {children}
      </Animated.View>
    </Animated.View>
  )
}

class _CollapsibleHeaderBackView extends Component {
  state = {
    isShow: true
  }

  componentDidMount(){
    const { navigation } = this.props;
    this.subscribe_willFocus = navigation.addListener('willFocus', () => {
      this.setState({isShow: true});
    });
    this.subscribe_willBlur = navigation.addListener('willBlur', () => {
      this.setState({isShow: false});
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

    const { isLandscape, navigation, iOSCollapsedColor } = this.props;
    if(!this.state.isShow || !navigation || !navigation.state.params || !navigation.state.params.headerY || !navigation.state.params.headerHeight)
      return null;

    const { headerHeight, headerY } = navigation.state.params;
    const navigationHeight = getNavigationHeight(isLandscape, headerHeight);

    const headerTranslate = headerY.interpolate({
      inputRange: [safeBounceHeight, safeBounceHeight + headerHeight],
      outputRange: [0, -headerHeight],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View 
        style={{
          zIndex: 100,
          transform: [{translateY: headerTranslate}], 
          backgroundColor: iOSCollapsedColor, 
          position: 'absolute', 
          width: '100%', 
          height: navigationHeight}}/>
    )
  }
}

const CollapsibleHeaderBackView = withOrientation(_CollapsibleHeaderBackView);







const collapsibleOptions = (configOptions, userOptions, navigation) => {

  userOptions = {
    ...configOptions,
    ...userOptions,
    headerStyle:{
      ...configOptions.headerStyle,
      ...userOptions.headerStyle
    }
  };

  const navigationParams = navigation.state.params;

  if(!navigationParams || !navigationParams.headerY){
    // console.log('navigationParams is null');
    return userOptions;
  }


  const { headerY } = navigationParams;
  const headerHeight = userOptions.headerStyle && userOptions.headerStyle.height 
    ? userOptions.headerStyle.height
    : defaultHeaderHeight;
  if(navigation){
    if(navigationParams.headerHeight !== headerHeight) 
      navigation.setParams({
        headerHeight,
        headerY: Animated.diffClamp(navigationParams.scrollY, 0, safeBounceHeight + headerHeight)
      });
  }

  const headerOpacity = headerY.interpolate({
    inputRange: [safeBounceHeight, safeBounceHeight + headerHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  const headerTranslate = headerY.interpolate({
    inputRange: [safeBounceHeight, safeBounceHeight + headerHeight],
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
      if(navigationParams.tabHeight !== tabHeight) 
        navigation.setParams({tabHeight});
    }
    const isLandscape = navigation.state.params && navigation.state.params.isLandscape
      ? navigation.state.params.isLandscape
      : isOrientationLandscape(Dimensions.get('window'));
    const tabStyle = collapsibleOptions.tabBarOptions ? collapsibleOptions.tabBarOptions.style : {};
    collapsibleOptions.tabBarOptions = {
      ...collapsibleOptions.tabBarOptions,
      style:{
        ...tabStyle,
        zIndex: 100,
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
  const dummyNavigation = {
    setParams: () => {},
    addListener: () => {},
    state: {
      params: routes[index].params
    }
  }
  return collapsibleOptions(navigationOptions, userOptions, dummyNavigation);
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

const getCollapsibleHeaderHeight = (navigation) => {
  return (navigation.state.params && navigation.state.params.headerHeight
  ? navigation.state.params.headerHeight
  : 0);
}
const getCollapsibleTabHeight = (navigation) => {
  return (navigation.state.params && navigation.state.params.tabHeight
  ? navigation.state.params.tabHeight
  : 0);
}



export const withCollapsible = (WrappedScreen, collapsibleParams = {}) => {
  class _withCollapsible extends Component{
    constructor(props){
      super(props);

      this.scrollY = new Animated.Value(0);
      if(!collapsibleParams.extraHeader){
        this.props.navigation.setParams(createCollapsibleParams(this.scrollY));
      }else{
        this.headerY = createCollapsibleParams(this.scrollY).headerY;
      }
    }

    render(){
      const { navigation } = this.props;
      const props = {
        ...this.props,
        paddingHeight: !collapsibleParams.extraHeader 
          ? getCollapsibleHeaderHeight(navigation) + getCollapsibleTabHeight(navigation)
          : collapsibleParams.extraHeaderStyle.height,
        scrollY: this.scrollY,
        onScroll: Animated.event(
          [{nativeEvent: {contentOffset: {y: this.scrollY}}}],
          {useNativeDriver: true})
      }
      return (
        <View style={{flex: 1}}>
          {!collapsibleParams.extraHeader 
            ? <CollapsibleHeaderBackView iOSCollapsedColor={collapsibleParams.iOSCollapsedColor} navigation={navigation} />
            : (<CollapsibleExtraHeader headerY={this.headerY} style={collapsibleParams.extraHeaderStyle}>
              {collapsibleParams.extraHeader(navigation)}
              </CollapsibleExtraHeader>)
          }
          <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'never'}}>
            <WrappedScreen {...props}/>
          </SafeAreaView>
        </View>
      );
    }
  }

  const hoist = hoistNonReactStatic(_withCollapsible, WrappedScreen);

  hoist.navigationOptions = props => {
    const userOptions = typeof WrappedScreen.navigationOptions === 'function'
      ? WrappedScreen.navigationOptions(props) 
      : (WrappedScreen.navigationOptions ? WrappedScreen.navigationOptions : {});
    userOptions.collapsibleCustomHeader = userOptions.header;
    
    const {navigationOptions, navigation} = props;
    return collapsibleOptions(navigationOptions, userOptions, navigation);
  }

  return hoist;
}