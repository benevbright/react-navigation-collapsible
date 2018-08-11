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

export default withCollapsible(FlatListScreen, {iOSCollapsedColor: '#031'});
```

## Contribution

I need your help to make this module better and capables more use cases.
