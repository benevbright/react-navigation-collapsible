# react-navigation-collapsible

[![npm](https://img.shields.io/npm/v/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![npm](https://img.shields.io/npm/dm/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible)


React Navigation Extension for Collapsible Header.
Make your header of `react-navigation` collapsible.

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/demo.gif?raw=true">


Try [Expo Snack](https://snack.expo.io/@benevbright/react-navigation-collapsible)

Try [Example](https://github.com/benevbright/react-navigation-collapsible/tree/master/example).


```
$ cd example
$ npm install
$ react-native run-ios
$ react-native run-android
```

## Usage

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
        onScroll={onScroll} 
        _mustAddThis={scrollY}
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
See [Example/src/ImageScreen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/ImageScreen.js)


### Extra Header(eg. SearchBar) with StackNavigator
See [Example/src/ExtraHeaderScreen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/ExtraHeaderScreen.js)


## Limitation

Because `react-navigation-capable` combines your screen's navigationOptions with `{headerTransparent: true}`, there is some layout issue on a transition to other screens which is using `{headerTransparent: false}`.

## Tasks

- [x] Regular Header
- [x] Image Header
- [x] Nested Stack+Tab
- [x] Extra Header
- [x] HOC
- [ ] Flow
- [ ] Split code

## Contribution

This module is just published.
Please help and let's make it better so that this module can capable more use cases.

- create issue or PR with a sample react-navigation code or Expo Snack that are not working with this module.
- If you improved module, please set `/example`'s `react-navigation-collapsible` package url to be linked to your forked repo and PR.

## Compatible Versions with Example

- React Native 0.56
- React Navigation 2.11.2
