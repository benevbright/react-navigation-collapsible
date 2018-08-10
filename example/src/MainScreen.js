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
          <Text>Regular Header Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{margin: 20}} onPress={() => navigation.navigate('ImageScreen')}>
          <Text>Image Header Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{margin: 20}} onPress={() => navigation.navigate('TopTabScreen')}>
          <Text>Material Tab Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{margin: 20}} onPress={() => navigation.navigate('ExtraHeaderScreen')}>
          <Text>Extra Header Screen</Text>
        </TouchableOpacity>
      </View>
    )
  }
}