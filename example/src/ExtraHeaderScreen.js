import React, {Component} from 'react';
import { Text, FlatList, View, Animated, TouchableOpacity } from 'react-native';

import { withCollapsible } from 'react-navigation-collapsible';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class ExtraHeaderScreen extends Component{
  static navigationOptions = {
    title: 'Extra Header',
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
    const { paddingHeight, scrollY, onScroll } = this.props.collapsible;

    return (
      <AnimatedFlatList 
        style={{flex: 1}}
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => String(index)}

        contentContainerStyle={{paddingTop: paddingHeight}}
        scrollIndicatorInsets={{top: paddingHeight}}        
        onScroll={onScroll} 
        _mustAddThis={scrollY}
        />
    )
  }
}

const ExtraHeader = (/*{navigation}*/) => (
  <View style={{width: '100%', height: '100%', paddingHorizontal: 20, paddingVertical: 10}}>
    <View style={{backgroundColor: 'white', flex: 1, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'gray'}}>Search Here</Text>
    </View>
  </View>
);

const collapsibleParams = {
  extraHeader: ExtraHeader,
  extraHeaderStyle: {
    height: 50, 
    backgroundColor: '#061'
  }
}

export default withCollapsible(ExtraHeaderScreen, collapsibleParams);