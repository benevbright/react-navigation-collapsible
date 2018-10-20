import React, {Component} from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import { collapsibleOptionsForTab, collapsibleTabConfig } from 'react-navigation-collapsible';

import MainScreen from './MainScreen.js';
import FlatListScreen from './FlatListScreen';
import ImageScreen from './ImageScreen';
import DetailScreen from './DetailScreen';
import ExtraHeaderScreen from './ExtraHeaderScreen';
import AdvancedScreen from './AdvancedScreen';

/* Support Expo */
// import { setExpoStatusBarHeight } from 'react-navigation-collapsible';
// import { Constants } from 'expo';
// setExpoStatusBarHeight(Constants.statusBarHeight);

const backgroundColor = '#061';

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


const TopTabNavigator = createMaterialTopTabNavigator(
  {
    Screen1: { screen: FlatListScreen },
    Screen2: { screen: DetailScreen },
  },
  collapsibleTabConfig({
    animationEnabled: true,
    navigationOptions:{
      tabBarOptions: {
        indicatorStyle: { backgroundColor: 'white' },
        style: { borderTopColor: 'transparent', borderTopWidth: 0, elevation: 0, backgroundColor: backgroundColor },
      }
    }
  })
);


const routeConfig = {
  MainScreen: { screen: MainScreen },
  FlatListScreen: { screen: FlatListScreen },
  ImageScreen: { screen: ImageScreen },
  TopTabScreen: { screen: TopTabNavigator, navigationOptions: props => collapsibleOptionsForTab(props, {title: 'Material Tab'}) },
  DetailScreen: { screen: DetailScreen },
  ExtraHeaderScreen: { screen: ExtraHeaderScreen },
  AdvancedScreen: { screen: AdvancedScreen }
};

const navigatorConfig = {
  // headerMode: 'screen',
  navigationOptions: {
    headerStyle: { backgroundColor: backgroundColor, borderBottomColor: 'transparent', borderBottomWidth: 0, elevation: 0 },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white',
    // headerTransparent: true, 
  }, 
};

const StackNavigator = createStackNavigator(routeConfig, navigatorConfig);

