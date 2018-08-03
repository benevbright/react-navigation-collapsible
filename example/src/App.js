import React, {Component} from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import FirstScreen from './FirstScreen.js'
import SecondScreen from './SecondScreen.js'

const routeConfig = {
  FirstScreen: { screen: FirstScreen },
  SecondScreen: { screen: SecondScreen },
};

const navigatorConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#060'
    },
    headerTitleStyle: {color: 'white'},
    headerTintColor: 'white', 
  }
};

const StackNavigator = createStackNavigator(routeConfig, navigatorConfig);

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