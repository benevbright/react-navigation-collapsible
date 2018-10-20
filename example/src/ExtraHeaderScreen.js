import React, {Component} from 'react';
import { Text, FlatList, View, Animated, TouchableOpacity, TextInput } from 'react-native';

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
      data.push(i.toString());
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
    const { searchText } = this.props.navigation.state.params ? this.props.navigation.state.params : {};
    const data = searchText ? this.state.data.filter(item => item.includes(searchText)) : this.state.data;

    return (
      <AnimatedFlatList 
        style={{flex: 1}}
        data={data}
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

const ExtraHeader = ({navigation}) => {  
  const { searchText } = navigation.state.params ? navigation.state.params : {};
  return (
    <View style={{width: '100%', height: '100%', paddingHorizontal: 15, justifyContent: 'center'}}>
      <View style={{backgroundColor: 'white', flex: 1, borderRadius: 10, margin: 10, justifyContent: 'center'}}>
        <TextInput style={{paddingHorizontal: 20}}
          placeholder='Search'
          value={searchText}
          onChangeText={text => navigation.setParams({searchText: text})}/>
      </View>
    </View>
  );
}

const collapsibleParams = {
  extraHeader: ExtraHeader,
  extraHeaderStyle: {
    height: 60, 
    backgroundColor: '#061'
  }
}

export default withCollapsible(ExtraHeaderScreen, collapsibleParams);