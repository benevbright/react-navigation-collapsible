/* global global */

import React, {Component} from 'react';
import { Animated, Platform, Dimensions, View } from 'react-native';
import { withOrientation } from '@react-navigation/native';
import hoistNonReactStatic from 'hoist-non-react-statics';

const CollapsibleType = {
  defaultHeader: 0,
  extraHeader: 1,
}

export const isOrientationLandscape = ({ width, height }) => width > height;

let androidStatusBarHeight = 0;
export const setExpoStatusBarHeight = height => {
  if(Platform.OS === 'android' && global.Expo)
    androidStatusBarHeight = height;
}

const IPHONE_XS_HEIGHT = 812; // iPhone X and XS
const IPHONE_XR_HEIGHT = 896; // iPhone XR and XS Max
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
export const IS_IPHONE_X =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (WINDOW_HEIGHT === IPHONE_XS_HEIGHT ||
    WINDOW_WIDTH === IPHONE_XS_HEIGHT ||
    WINDOW_HEIGHT === IPHONE_XR_HEIGHT ||
    WINDOW_WIDTH === IPHONE_XR_HEIGHT);


const defaultHeaderHeight = Platform.select({ios: 44, android: 56, web: 50});
let _safeBounceHeight;
const getSafeBounceHeight = () => _safeBounceHeight != null ? _safeBounceHeight : Platform.select({ios: 300, android: 100, web: 200});
export const setSafeBounceHeight = (height) => { _safeBounceHeight = height };


const getStatusBarHeight = (isLandscape) => {
  if (Platform.OS === 'ios') {
    if(isLandscape) return 0;
    return IS_IPHONE_X ? 44 : 20;
  } else if (Platform.OS === 'android') return androidStatusBarHeight;
  else return 0;
}
const getNavigationHeight = (isLandscape, headerHeight) => {
  return headerHeight + getStatusBarHeight(isLandscape);
}

const getTranslateY = (animatedDiffClampY, headerHeight, offset = 0) => (
  animatedDiffClampY && headerHeight && animatedDiffClampY.interpolate({
    inputRange: [getSafeBounceHeight(), getSafeBounceHeight() + headerHeight],
    outputRange: [offset, offset - headerHeight],
    extrapolate: 'clamp'
  }) 
) || 0;
const getTranslateProgress = (animatedDiffClampY, headerHeight) => (
  animatedDiffClampY && headerHeight && animatedDiffClampY.interpolate({
    inputRange: [getSafeBounceHeight(), getSafeBounceHeight() + headerHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }) 
) || 0;
const getOpacity = (animatedDiffClampY, headerHeight) => (
  animatedDiffClampY && headerHeight && animatedDiffClampY.interpolate({
    inputRange: [getSafeBounceHeight(), getSafeBounceHeight() + headerHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  }) 
) || 0;






const CollapsibleExtraHeader = props => {
  const { children, style : collapsibleBackgroundStyle, navigation } = props;
  
  if(!navigation) return null;
  const { animatedDiffClampY } = navigation.state.params || {};

  const height = collapsibleBackgroundStyle.height || 0;
  const translateY = animatedDiffClampY ? getTranslateY(animatedDiffClampY, height) : 0;
  const defaultOpacity = collapsibleBackgroundStyle.opacity != null ? collapsibleBackgroundStyle.opacity : 1;
  const opacity = collapsibleBackgroundStyle.disableFadeoutInnerComponent
    ? defaultOpacity
    : animatedDiffClampY ? getOpacity(animatedDiffClampY, height) : defaultOpacity;
  return (
    <Animated.View style={[collapsibleBackgroundStyle, {
      width: '100%', 
      position: 'absolute',
      transform: [{translateY}]}]}>
      <Animated.View style={{width: '100%', height: '100%', opacity}}>
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
    if(Platform.OS.match(/android|web/))
      return null;

    const { isLandscape, navigation, iOSCollapsedColor = 'black' } = this.props;
    if(!this.state.isShow || !navigation || !navigation.state.params || !navigation.state.params.animatedDiffClampY || !navigation.state.params.headerHeight)
      return null;

    const { headerHeight, animatedDiffClampY } = navigation.state.params || {};
    const navigationHeight = getNavigationHeight(isLandscape, headerHeight);
    const translateY = getTranslateY(animatedDiffClampY, headerHeight)

    return (
      <Animated.View 
        style={{
          zIndex: 100,
          transform: [{translateY: translateY}], 
          backgroundColor: iOSCollapsedColor, 
          position: 'absolute', 
          width: '100%', 
          height: navigationHeight}}/>
    )
  }
}

const CollapsibleHeaderBackView = withOrientation(_CollapsibleHeaderBackView);

const collapsibleNavigationOptions = (configOptions, userOptions, navigation) => {
  userOptions = {
    ...configOptions,
    ...userOptions,
    headerStyle:{
      ...configOptions.headerStyle,
      ...userOptions.headerStyle
    }
  };

  const navigationParams = navigation.state.params;

  if(!navigationParams || !navigationParams.animatedYSum ){
    // console.log('navigationParams is null');
    return userOptions;
  }

  const { collapsibleTranslateY, collapsibleTranslateOpacity } = navigationParams;
  const headerHeight = userOptions.headerStyle && userOptions.headerStyle.height 
    ? userOptions.headerStyle.height
    : defaultHeaderHeight;
  if(navigationParams.headerHeight !== headerHeight){
    const animatedDiffClampY = Animated.diffClamp(navigationParams.animatedYSum, 0, getSafeBounceHeight() + headerHeight);
    navigation.setParams({
      headerHeight,
      animatedDiffClampY,
      collapsibleTranslateY: getTranslateY(animatedDiffClampY, headerHeight),
      collapsibleTranslateOpacity: getOpacity(animatedDiffClampY, headerHeight),
      collapsibleTranslateProgress: getTranslateProgress(animatedDiffClampY, headerHeight),
    });
  }

  const collapsibleOptions = {
    ...configOptions,
    ...userOptions,
    headerStyle: {
      ...configOptions.headerStyle,
      ...userOptions.headerStyle,
      transform: [{translateY: collapsibleTranslateY || 0}],
      overflow: 'hidden',
      opacity: Platform.select({ios: collapsibleTranslateOpacity || 1, android: global.Expo ? (collapsibleTranslateOpacity || 1) : 1, web: 1}),
      height: headerHeight,
    },
    headerTransparent: true, 
  };

  return collapsibleOptions;
}

const getCollapsibleHeaderHeight = (navigationParams) => (navigationParams && navigationParams.headerHeight) || 0;

export const withCollapsible = (WrappedScreen, collapsibleParams = {}, tabNavigator = undefined) => {
  const isForTabNavigator = tabNavigator != null;
  const collapsibleType = collapsibleParams.collapsibleComponent ? CollapsibleType.extraHeader : CollapsibleType.defaultHeader;

  class _withCollapsible extends Component{
    constructor(props){
      super(props);

      this.animatedY = isForTabNavigator ? Object.keys(tabNavigator.router.childRouters).map(() => new Animated.Value(0)) : [ new Animated.Value(0) ];
      this.animatedYSum = this.animatedY.reduce((a, b) => new Animated.add(a, b), new Animated.Value(0));
      this.onScroll = this.animatedY.map(
        animatedY => Animated.event(
          [{nativeEvent: {contentOffset: {y: animatedY}}}],
          {useNativeDriver: Platform.select({ios: true, android: true, web: false})}
        )
      );

      switch (collapsibleType) {
        case CollapsibleType.defaultHeader:
          this.props.navigation.setParams({
            animatedYSum: this.animatedYSum,
          });
          break;
        case CollapsibleType.extraHeader: {
            const headerHeight = (collapsibleParams.collapsibleBackgroundStyle && collapsibleParams.collapsibleBackgroundStyle.height || 0)
              - (collapsibleParams.collapsibleBackgroundStyle && collapsibleParams.collapsibleBackgroundStyle.paddingBottom || 0);
            const animatedDiffClampY = Animated.diffClamp(this.animatedYSum, 0, getSafeBounceHeight() + headerHeight);
            this.props.navigation.setParams({
              animatedDiffClampY,
              collapsibleTranslateY: getTranslateY(animatedDiffClampY, headerHeight, headerHeight),
              collapsibleTranslateOpacity: getOpacity(animatedDiffClampY, headerHeight),
              collapsibleTranslateProgress: getTranslateProgress(animatedDiffClampY, headerHeight),
            });
          }
          break;
      }
    }

    componentDidMount(){
      Dimensions.addEventListener('change', this.orientationListner);
    }
    componentWillUnmount(){
      Dimensions.removeEventListener('change', this.orientationListner);
      this.props.navigation.state.params = undefined;
    }
    orientationListner = ({window}) => {
      this.props.navigation.setParams({isLandscape: isOrientationLandscape(window)})
    }

    render(){
      const { navigation } = this.props;
      const { params = {} } = navigation.state;

      let paddingHeight = 0;

      switch (collapsibleType) {
        case CollapsibleType.defaultHeader: {
            const collapsibleHeaderHeight = getCollapsibleHeaderHeight(params);
            if (collapsibleHeaderHeight) {
              const isLandscape = isLandscape != null ? isLandscape : isOrientationLandscape(Dimensions.get('window'));
              paddingHeight = collapsibleHeaderHeight + getStatusBarHeight(isLandscape);
            }
          }
          break;
        case CollapsibleType.extraHeader:
          paddingHeight = collapsibleParams.collapsibleBackgroundStyle.height;
          break;
      }

      const props = {
        ...this.props,
        collapsible:{
          paddingHeight,
          animatedY: isForTabNavigator ? this.animatedY : this.animatedY[0],
          onScroll: isForTabNavigator ? this.onScroll : this.onScroll[0],
          translateY: params.collapsibleTranslateY || new Animated.Value(paddingHeight),
          translateOpacity: params.collapsibleTranslateOpacity || new Animated.Value(1),
          translateProgress: params.collapsibleTranslateProgress || new Animated.Value(0),
        }
      }

      let collapsibleComponent = null;
      switch (collapsibleType) {
        case CollapsibleType.defaultHeader:
          collapsibleComponent = <CollapsibleHeaderBackView iOSCollapsedColor={collapsibleParams.iOSCollapsedColor} navigation={navigation} />;
          break;
        case CollapsibleType.extraHeader:
          collapsibleComponent = (
            <CollapsibleExtraHeader navigation={navigation} style={collapsibleParams.collapsibleBackgroundStyle}>
              <collapsibleParams.collapsibleComponent {...props}/>
            </CollapsibleExtraHeader>
          );
          break;
      }

      return (
        <View style={{flex: 1}}>
          <WrappedScreen {...props}/>
          {collapsibleComponent}
        </View>
      );
    }
  }

  const hoist = hoistNonReactStatic(_withCollapsible, WrappedScreen);

  switch (collapsibleType) {
    case CollapsibleType.defaultHeader: 
      hoist.navigationOptions = props => {
        const wrapScreenNavOptions = WrappedScreen.navigationOptions ? WrappedScreen.navigationOptions : {};
        const userOptions = typeof wrapScreenNavOptions === 'function' ? wrapScreenNavOptions(props) : wrapScreenNavOptions;
        
        const { navigationOptions, navigation } = props;
        return collapsibleNavigationOptions(navigationOptions, userOptions, navigation);
      }
      break;
    default:
      break;
  }

  return hoist;
}

export const withCollapsibleForTab = (MaterialTopTabNavigator, collapsibleParams = {}) => {
  const collapsibleType = collapsibleParams.collapsibleComponent ? CollapsibleType.extraHeader : CollapsibleType.defaultHeader;

  class _withCollapsibleForTab extends Component{
    render() {
      // eslint-disable-next-line no-unused-vars
      const { paddingHeight, translateY, translateOpacity, translateProgress } = this.props.collapsible;
      
      switch (collapsibleType) {
        case CollapsibleType.defaultHeader:
          return (
            <Animated.View style={{ flex: 1, marginTop: paddingHeight, marginBottom: -paddingHeight, transform: [{ translateY }] }}>
              <MaterialTopTabNavigator
                screenProps={this.props}
                navigation={this.props.navigation}
              />
            </Animated.View>
          );
        case CollapsibleType.extraHeader:
          return (
            <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
              <MaterialTopTabNavigator
                screenProps={this.props}
                navigation={this.props.navigation}
              />
            </Animated.View>
          );
        default: return null;
      }
    }
  }

  const hoist = hoistNonReactStatic(_withCollapsibleForTab, MaterialTopTabNavigator);

  return withCollapsible(hoist, collapsibleParams, MaterialTopTabNavigator);
}

export const withCollapsibleForTabChild = (WrappedScreen) => {
  class _withCollapsibleForTabChild extends Component{
    render() {
      const key = this.props.navigation.state.key;
      const index = this.props.screenProps.navigation.state.routes.findIndex(item => item.key === key);
      const collapsible = {
        ...this.props.screenProps,
        animatedY: this.props.screenProps.collapsible.animatedY[index],
        onScroll: this.props.screenProps.collapsible.onScroll[index],
      };
      return (
        <WrappedScreen {...this.props} collapsible={collapsible}/>
      );
    }
  }

  const hoist = hoistNonReactStatic(_withCollapsibleForTabChild, WrappedScreen);

  return hoist;
}