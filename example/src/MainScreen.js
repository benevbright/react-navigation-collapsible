import React, {Component} from 'react';
import { Text, TouchableOpacity } from 'react-native';

const routeConfig = [
  { navigateTo: 'FlatListScreen', title: 'Regular Collapsible Header' },
  { navigateTo: 'TopTabScreen1', title: 'Material Tab + Regular Collapsible Header' },
  { navigateTo: 'TopTabScreen2', title: 'Material Tab + Extra Collapsible Header' },
  { navigateTo: 'ExtraHeaderScreen', title: 'Extra Collapsible Header (Search Bar)' },
];

export default class MainScreen extends Component{
  static navigationOptions = {
    title: 'Collapsible',
  }

  render(){
    const { navigation } = this.props;

    return routeConfig.map(route => (
      <TouchableOpacity key={route.navigateTo} style={{margin: 20}} onPress={() => navigation.navigate(route.navigateTo)}>
        <Text>{route.title}</Text>
      </TouchableOpacity>
    ));
  }
}