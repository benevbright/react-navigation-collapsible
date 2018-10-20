import React, {Component} from 'react';
import { Text, TouchableOpacity } from 'react-native';

const routeConfig = [
  { navigateTo: 'FlatListScreen', title: 'Regular Header Screen' },
  { navigateTo: 'ImageScreen', title: 'Image Header Screen' },
  { navigateTo: 'TopTabScreen', title: 'Material Tab Screen' },
  { navigateTo: 'ExtraHeaderScreen', title: 'Extra Header Screen' },
  { navigateTo: 'AdvancedScreen', title: 'Advanced Header Screen' },
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