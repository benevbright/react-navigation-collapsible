# react-navigation-collapsible

[![npm](https://img.shields.io/npm/v/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![npm](https://img.shields.io/npm/dm/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![Greenkeeper badge](https://badges.greenkeeper.io/benevbright/react-navigation-collapsible.svg)](https://greenkeeper.io/)


React Navigation Extension for Collapsible Header.
Make your header of `react-navigation` collapsible.

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/demo.gif?raw=true">

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/demo2.gif?raw=true" width="300">


Try [Expo Snack](https://snack.expo.io/@benevbright/react-navigation-collapsible)

Try [Example](https://github.com/benevbright/react-navigation-collapsible/tree/master/example).


```
$ cd example
$ npm install
$ react-native run-ios
$ react-native run-android
```

## Usage

### Expo

If you use Expo, add this lines to your App.js. (It only affects Android)

```
/* Support Expo */
import { setExpoStatusBarHeight } from 'react-navigation-collapsible';
import { Constants } from 'expo';
setExpoStatusBarHeight(Constants.statusBarHeight);
```

### StackNavigator

(MyScreen.js)
```
import { withCollapsible } from 'react-navigation-collapsible';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyScreen extends Component{
  static navigationOptions = {
    title: 'Awesome Screen'
  };

  render(){
    const { paddingHeight, scrollY, onScroll } = this.props.collapsible;

    return (
      <AnimatedFlatList 
        ...
        contentContainerStyle={{paddingTop: paddingHeight}}
        scrollIndicatorInsets={{top: paddingHeight}}
        _mustAddThis={scrollY}
        onScroll={onScroll} 
        
        // if you want to use 'onScroll' callback.
        // onScroll={Animated.event(
        //   [{nativeEvent: {contentOffset: {y: scrollY}}}],
        //   {useNativeDriver:true, listener:this.onScroll})} 
        />
    )
  }
}

export default withCollapsible(MyScreen, {iOSCollapsedColor: '#031'});
```


### StackNavigator + MaterialTopTabNavigator

(MyScreen.js)
```
...
export default withCollapsible(MyScreen, {iOSCollapsedColor: '#031'});
```

(Your Navigator.js)
```
import { collapsibleOptionsForTab, collapsibleTabConfig } from 'react-navigation-collapsible';

const TopTabNavigator = createMaterialTopTabNavigator(
  {
    Screen1: { screen: MyScreen },
    Screen2: { screen: OtherScreen },
  },
  collapsibleTabConfig({
    navigationOptions:{
      tabBarOptions: {
        indicatorStyle: { backgroundColor: 'white' },
        style: { backgroundColor: 'green' },
      }
    }
  })
);

const routeConfig = {
  MainScreen: { screen: MainScreen },
  TopTabScreen: { screen: TopTabNavigator, navigationOptions: props => collapsibleOptionsForTab(props, {title: 'Material Tab'}) },
};

const StackNavigator = createStackNavigator(routeConfig);
```

### Custom or Image Header with StackNavigator
See [example/src/ImageScreen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/ImageScreen.js)


### Extra Header(eg. SearchBar) with StackNavigator
See [example/src/ExtraHeaderScreen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/ExtraHeaderScreen.js)

## API

- [HOC] `withCollapsible (wrappedUserScreen: Component, collapsibleParams?: {iOSCollapsedColor?: string, extraHeader?: Component, extraHeaderStyle?: Object})`
- `collapsibleOptionsForTab (props: Object, userOptions: Object)`
- `collapsibleTabConfig (userConfig: Object)`
- `setExpoStatusBarHeight (height: number)`

`react-navigation-collapsible` set your `this.props.navigation` params with `{headerHeight: number, translateY: Animated, translateOpacity: Animated, translateProgress: Animated}`. You can create your desired screen with this params. For more infomation, see [example/src/AdvancedScreen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/AdvancedScreen.js).

## Limitation

#### Transition between non-collapsible and collapsible (iOS)

~~Because `react-navigation-collapsible` converts your screen's navigationOptions to `{headerTransparent: true}`, there is a layout issue on a transition with other screens not using `{headerTransparent: true}`.~~

~~If you want to make the transition between screens natural on iOS, you have two options. (See [example/src/App.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/App.js))~~

~~1. Set `headerTransparent: true` in `navigatorConfig` and set paddingTop on every screen in the same StackNavigator.~~

~~or~~

~~2. Set `headerMode: 'screen'` in `navigatorConfig`.~~

#### With State persistence [#40](https://github.com/benevbright/react-navigation-collapsible/issues/40)

react-navigation provides [State persistence](https://reactnavigation.org/docs/en/state-persistence.html) as experimental feature. Unfortunately, collapsible header stops collapsible when you use it.

#### With SectionList [#37](https://github.com/benevbright/react-navigation-collapsible/issues/37)


## Tasks

- [x] Regular Header
- [x] Image Header
- [x] Nested Stack+Tab
- [x] Extra Header
- [x] HOC
- [ ] Split code
- [ ] iOS 11 Style Header
- [ ] Big Header <-> Regular Header

## Contribution

This module is just published.
Please help and let's make it better so that this module can capable more use cases.

- create issue or PR with a sample react-navigation code or Expo Snack that are not working with this module.
- If you improved module, please set `/example`'s `react-navigation-collapsible` package URL to be linked to your forked repo and PR.

## Dependencies Version of Example

- `react-native`: 0.57.3, `latest`: [![npm](https://img.shields.io/npm/v/react-native.svg)](https://www.npmjs.com/package/react-native)
- `react-navigation`: 2.18.0, `latest`: [![npm](https://img.shields.io/npm/v/react-navigation.svg)](https://www.npmjs.com/package/react-navigation)

I've ensured this module is compatible with `react-native` >=0.56 and `react-navigation` >=2.11.2. But it does not mean it's not compatible with older versions.
