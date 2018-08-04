import React, {Component} from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

export default class MainScreen extends Component{
  static navigationOptions = {
    title: 'Collapsible',
  }

  render(){
    const { navigation } = this.props;

    return (
      <View>
        <TouchableOpacity style={{margin: 20}} onPress={() => navigation.navigate('FlatListScreen')}>
          <Text>Basic FlatList Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{margin: 20}} onPress={() => navigation.navigate('TopTabScreen')}>
          <Text>Top Tab Page</Text>
        </TouchableOpacity>
      </View>
    )
  }
}