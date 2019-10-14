import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {createAppContainer, createStackNavigator} from 'react-navigation';

import MenuScreen from './MenuScreen.js';
import S0_DefaultHeader from './S0_DefaultHeader';
import S1_ExtraHeader from './S1_ExtraHeader';
import S2_DefaultHeaderForTab from './S2_DefaultHeaderForTab';
import S3_ExtraHeaderForTab from './S3_ExtraHeaderForTab';
import ContextScreen from './ContextScreen';

// import { setSafeBounceHeight } from 'react-navigation-collapsible';
// setSafeBounceHeight(0);

/* Support Expo */
// import { setExpoStatusBarHeight } from 'react-navigation-collapsible';
// import { Constants } from 'expo';
// setExpoStatusBarHeight(Constants.statusBarHeight);

const navigationBackgroundColor = '#061';

export default class App extends Component {
  render() {
    return [
      <StatusBar key="statusbar" barStyle="light-content" />,
      <StackNavigator key="navigator" />,
    ];
  }
}

const routeConfig = {
  MenuScreen: {screen: MenuScreen},
  S0_DefaultHeader: {screen: S0_DefaultHeader},
  S1_ExtraHeader: {screen: S1_ExtraHeader},
  S2_DefaultHeaderForTab: {screen: S2_DefaultHeaderForTab},
  S3_ExtraHeaderForTab: {screen: S3_ExtraHeaderForTab},
  DetailScreen: {screen: ContextScreen},
};

const navigatorConfig = {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: navigationBackgroundColor,
      borderBottomColor: 'transparent',
      borderBottomWidth: 0,
      elevation: 0,
    },
    headerTitleStyle: {color: 'white'},
    headerTintColor: 'white',
  },
};

const StackNavigator = createAppContainer(
  createStackNavigator(routeConfig, navigatorConfig),
);
