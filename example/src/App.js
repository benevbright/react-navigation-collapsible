import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation';

import FirstScreen from './FirstScreen.js'
import SecondScreen from './SecondScreen.js'
import ThirdScreen from './ThirdScreen.js'

const routeConfig = {
  FirstScreen: { screen: FirstScreen },
  SecondScreen: { screen: SecondScreen },
  ThirdScreen: { screen: ThirdScreen },
};

const navigatorConfig = {
  headerMode: 'screen'
};

const StackNavigator = createStackNavigator(routeConfig, navigatorConfig);

export default class App extends Component{
  render(){
    return (
      <StackNavigator/>
    )
  }
}