import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';

const routeConfig = [
  {navigateTo: 'S0_DefaultHeader', title: 'S0. Default Header'},
  {navigateTo: 'S1_ExtraHeader', title: 'S1. Extra Header (Search Bar)'},
  {navigateTo: 'S2_DefaultHeaderForTab', title: 'S2. Default Header With Tab'},
  {
    navigateTo: 'S3_ExtraHeaderForTab',
    title: 'S3. Extra Header With Tab (Facebook Group)',
  },
  {navigateTo: 'S4_CustomComponent', title: 'S4. Custom Component'},
];

export default class MenuScreen extends Component {
  static navigationOptions = {
    title: 'Collapsible',
  };

  render() {
    const {navigation} = this.props;

    return routeConfig.map(route => (
      <TouchableOpacity
        key={route.navigateTo}
        style={{margin: 20}}
        onPress={() => navigation.navigate(route.navigateTo)}>
        <Text>{route.title}</Text>
      </TouchableOpacity>
    ));
  }
}
