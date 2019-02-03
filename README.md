# react-navigation-collapsible

[![npm](https://img.shields.io/npm/v/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![npm](https://img.shields.io/npm/dm/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![Greenkeeper badge](https://badges.greenkeeper.io/benevbright/react-navigation-collapsible.svg)](https://greenkeeper.io/)


React Navigation Extension for Collapsible Header.
Make your header of `react-navigation` collapsible.

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/docs/demo.gif?raw=true">

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/docs/demo2.gif?raw=true" width="300">


Try [Expo Snack](https://snack.expo.io/@benevbright/react-navigation-collapsible)

Try [Example](https://github.com/benevbright/react-navigation-collapsible/tree/master/example).


```
$ cd example
$ npm install
$ react-native run-ios
$ react-native run-android
```

## Usage

### react-navigation v2

If you're using `react-navigation` v2, please use `react-navigation-collapsible@2.0.0` and [2.0.0 README](https://github.com/benevbright/react-navigation-collapsible/tree/v2).

### Expo

If you use Expo, add this lines to your App.js. (It only affects Android)

```
/* Support Expo */
import { setExpoStatusBarHeight } from 'react-navigation-collapsible';
import { Constants } from 'expo';
setExpoStatusBarHeight(Constants.statusBarHeight);
```

### Default Header

(MyScreen.js)
```
import { withCollapsible } from 'react-navigation-collapsible';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyScreen extends Component{
  static navigationOptions = {
    title: 'My Screen'
  };

  render(){
    const { paddingHeight, animatedY, onScroll } = this.props.collapsible;

    return (
      <AnimatedFlatList 
        ...
        contentContainerStyle={{paddingTop: paddingHeight}}
        scrollIndicatorInsets={{top: paddingHeight}}
        _mustAddThis={animatedY}
        onScroll={onScroll} 

        // if you want to use 'onScroll' callback.
        // onScroll={Animated.event(
        //   [{nativeEvent: {contentOffset: {y: animatedY}}}],
        //   {useNativeDriver:true, listener:this.onScroll})} 
        />
    )
  }
}

export default withCollapsible(MyScreen, {iOSCollapsedColor: '#031'});
```
See [example/src/S0_DefaultHeader.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/S0_DefaultHeader.js)

### Extra Header (Search Bar)

See [example/src/S1_ExtraHeader.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/S1_ExtraHeader.js)

### Default Header With Tab

See [example/src/S2_DefaultHeaderForTab.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/S2_DefaultHeaderForTab.js)
and [example/src/TabChild1Screen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/TabChild1Screen.js)


### Extra Header With Tab (e.g Facebook Group)

See [example/src/S3_ExtraHeaderForTab.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/S3_ExtraHeaderForTab.js)
and [example/src/TabChild1Screen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/TabChild1Screen.js)


## API

#### HoC and config method

```
type CollapsibleParams = {
  iOSCollapsedColor: string, // iOS only
} | {
  collapsibleComponent: React.Component,
  collapsibleBackgroundStyle: {
    ...React.Style
  } & {
    disableFadeoutInnerComponent?: boolean,
    paddingBottom?: number,
  }
}

function withCollapsible (WrappedScreen, collapsibleParams: CollapsibleParams = {})
function withCollapsibleForTab (MaterialTapNavigator, collapsibleParams: CollapsibleParams = {})
function withCollapsibleForTabChild (WrappedScreen)

function setExpoStatusBarHeight (height) // expo only
function setSafeBounceHeight (height)
```

#### Given `props`

```
render () {
  const {
    paddingHeight,
    translateY, // 0 ~ collapsibleHeaderHeight
    translateOpacity, // 1.0 ~ 0.0
    translateProgress, // 0.0 ~ 1.0
    animatedY,
    onScroll, 
  } = this.props.collapsible;

  ...
}
```


## Limitation

#### When scroll slowly, the layout is flickering on Android. 

This is `react-native`'s regression bug on Android. Here is a workaround. [facebook/react-native#15445 (comment)](https://github.com/facebook/react-native/issues/15445#issuecomment-321721259)

#### With State persistence [#40](https://github.com/benevbright/react-navigation-collapsible/issues/40)

react-navigation provides [State persistence](https://reactnavigation.org/docs/en/state-persistence.html) as experimental feature. Unfortunately, collapsible header stops collapsible when you use it.

#### With SectionList [#37](https://github.com/benevbright/react-navigation-collapsible/issues/37)


## ToDo

- [ ] iOS 11 Style Header
- [ ] Hiding bottom tab


## Contribution

- PR is welcome. Please create issue or PR with a sample react-navigation code or Expo Snack.
- If you've got good example using this module, please update `/example`.


## Dependencies Version of Example

- `react-native`: 0.57.8, `latest`: [![npm](https://img.shields.io/npm/v/react-native.svg)](https://www.npmjs.com/package/react-native)
- `react-navigation`: 3.0.9, `latest`: [![npm](https://img.shields.io/npm/v/react-navigation.svg)](https://www.npmjs.com/package/react-navigation)

I've ensured this module is compatible with `react-native` >=0.56 and `react-navigation` >=2.11.2. But it does not mean it's not compatible with older versions.
