import React, {Component} from 'react';
import { Text, FlatList, Animated, TouchableOpacity } from 'react-native';

import { withCollapsible } from 'react-navigation-collapsible';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class FlatListScreen extends Component{
  static navigationOptions = {
    title: 'Flatlist'
  };

  constructor(props){
    super(props);

    const data = [];
    for(let i = 0 ; i < 60 ; i++){
      data.push(i);
    }

    this.state = {
      data: data
    }
  }

  renderItem = ({item}) => (
    <TouchableOpacity 
      onPress={() => {
        this.props.navigation.navigate('DetailScreen');
      }}
      style={{width: '100%', height: 50, borderBottomColor: '#0002', borderBottomWidth: 0.5, paddingHorizontal: 20, justifyContent: 'center'}}>
      <Text style={{fontSize: 22}}>{item}</Text>
    </TouchableOpacity>
  )

  render(){
    return (
      <AnimatedFlatList 
        style={{flex: 1}}
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => String(index)}

        contentContainerStyle={{paddingTop: this.props.paddingHeight}}
        onScroll={this.props.onScroll} 
        _mustAddThis={this.props.scrollY}
        />
    )
  }
}

export default withCollapsible(FlatListScreen, {iOSCollapsedColor: '#031'});
