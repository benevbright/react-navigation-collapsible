import React, {Component} from 'react';
import { Text, FlatList, View, TouchableOpacity } from 'react-native';

import { headerHeight, bounceHeight, navigationHeight } from './App';

export default class FirstScreen extends Component{
  static navigationOptions = {
    title: 'Collapsible',
    headerStyle: {
      backgroundColor: 'red'
    }
  }

  render(){
    const { navigation } = this.props;

    return (
      <View style={{marginTop: navigationHeight}}>
        <TouchableOpacity style={{margin: 20}} onPress={() => navigation.navigate('SecondScreen')}>
          <Text>Second Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{margin: 20}} onPress={() => navigation.navigate('ThirdScreen')}>
          <Text>Third Page</Text>
        </TouchableOpacity>
      </View>
    )
  }
}