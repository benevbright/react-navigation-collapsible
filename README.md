# react-navigation-collapsible

[![npm](https://img.shields.io/npm/v/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![npm](https://img.shields.io/npm/dm/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible)


React Navigation Extension for Collapsible Header.
Make your header of `react-navigation` collapsible.

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/demo.gif?raw=true">


Try [Expo](https://snack.expo.io/@benevbright/react-navigation-collapsible)

Try [Example](https://github.com/benevbright/react-navigation-collapsible/tree/master/example).


## Getting started

```
$ cd example
$ npm install
$ react-native run-ios
$ react-native run-android
```

## Task

- [x] Regular Header
- [x] Image Header
- [x] Nested Stack+Tab
- [x] Extra Header
- [x] HOC
- [ ] Flow

## Usage

### Stack

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


### Stack + Material Tab

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

### Custom Header
See [ImageScreen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/ImageScreen.js)

### Extra Header
See [ExtraHeaderScreen.js](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/ExtraHeaderScreen.js)


## Contribution

I need your help to make this module better and capables more use cases.
