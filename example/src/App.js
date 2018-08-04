import React, {Component} from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import MainScreen from './MainScreen.js'
import FlatListScreen from './FlatListScreen.js'
import { withCollapsibleOptions } from 'react-navigation-collapsible';

const backgroundColor = '#060';

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
    Screen2: { screen: MainScreen },
  },
  {
    animationEnabled: true,
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: 'white',
      },
      style: {
        // height: 40,
        borderTopColor: 'transparent', borderTopWidth: 0, elevation: 0,
        backgroundColor: backgroundColor
      },
    },
  }
);

const tabNavigationOptions = props => {
  const { routes, index } = props.navigation.state;
  const newOptions = withCollapsibleOptions(props.navigationOptions, {} , routes[index].params);
  console.log('TN', newOptions);
  // console.log('TN children', props.navigation.getChildNavigation());
  return newOptions;
}

const routeConfig = {
  MainScreen: { screen: MainScreen },
  FlatListScreen: { screen: FlatListScreen },
  TopTabScreen: { screen: TopTabNavigator, navigationOptions: tabNavigationOptions },
  DetailScreen: { screen: MainScreen },
};

const navigatorConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: backgroundColor,
      borderBottomColor: 'transparent', 
      borderBottomWidth: 0, 
      elevation: 0,
    },
    headerTitleStyle: {color: 'white'},
    headerTintColor: 'white', 
  }
};

const StackNavigator = createStackNavigator(routeConfig, navigatorConfig);

