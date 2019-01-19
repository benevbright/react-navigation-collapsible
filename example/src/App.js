import React, {Component} from 'react';
import { StatusBar } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import MainScreen from './MainScreen.js';
import FlatListScreen from './FlatListScreen';
import DetailScreen from './DetailScreen';
import ExtraHeaderScreen from './ExtraHeaderScreen';
import TopTabScreen1 from './MaterialTopTabScreen';
import TopTabScreen2 from './MaterialTopTabScreen2';

/* Support Expo */
// import { setExpoStatusBarHeight } from 'react-navigation-collapsible';
// import { Constants } from 'expo';
// setExpoStatusBarHeight(Constants.statusBarHeight);

const navigationBackgroundColor = '#061';

export default class App extends Component{
  render(){
    return (
      [
        <StackNavigator key='navigator'/>,
        <StatusBar key='statusbar' barStyle='light-content'/>
      ]
    )
  }
}

const routeConfig = {
  MainScreen: { screen: MainScreen },
  FlatListScreen: { screen: FlatListScreen },
  TopTabScreen1: { screen: TopTabScreen1 },
  TopTabScreen2: { screen: TopTabScreen2 },
  DetailScreen: { screen: DetailScreen },
  ExtraHeaderScreen: { screen: ExtraHeaderScreen },
};

const navigatorConfig = {
  // headerMode: 'screen',
  defaultNavigationOptions: {
    headerStyle: { backgroundColor: navigationBackgroundColor, borderBottomColor: 'transparent', borderBottomWidth: 0, elevation: 0 },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white',
    // headerTransparent: true, 
  }, 
};

const StackNavigator = createAppContainer(createStackNavigator(routeConfig, navigatorConfig));

