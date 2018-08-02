import React, {Component} from 'react';
import { Platform, Animated } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import FirstScreen from './FirstScreen.js'
import SecondScreen from './SecondScreen.js'
import ThirdScreen from './ThirdScreen.js'

export const headerHeight = 44;
export const navigationHeight = headerHeight + Platform.select({ios: 20, android: 0});
export const bounceHeight = Platform.select({ios: 250, android: headerHeight});

const routeConfig = {
  FirstScreen: { screen: FirstScreen },
  SecondScreen: { screen: SecondScreen },
  ThirdScreen: { screen: ThirdScreen },
};

const navigatorConfig = {
  headerMode: 'screen',
  navigationOptions: props => {
    console.log('AAA', props.navigation.state);
    const { headerY } = props.navigation.state.params ? props.navigation.state.params : { headerY: null };
    const headerOpacity = !headerY ? 1 : headerY.interpolate({
      inputRange: [bounceHeight - headerHeight, bounceHeight],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });
    const headerTranslate = !headerY ? 0 : headerY.interpolate({
      inputRange: [bounceHeight - headerHeight, bounceHeight],
      outputRange: [0, -headerHeight],
      extrapolate: 'clamp'
    });

    return ({
      headerStyle: {
        transform: headerY ? [{translateY: headerTranslate}] : [],
        overflow: 'hidden',
        opacity: headerOpacity,
        height: headerHeight,
      },
      headerTransparent: true,
      headerTitleStyle: {color: 'white'},
      headerTintColor: 'white', 
    });
  }
};

const StackNavigator = createStackNavigator(routeConfig, navigatorConfig);

export default class App extends Component{
  render(){
    return (
      <StackNavigator/>
    )
  }
}