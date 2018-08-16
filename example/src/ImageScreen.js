import React, {Component} from 'react';
import { Text, FlatList, View, Animated, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { HeaderBackButton } from 'react-navigation';

import { withCollapsible } from 'react-navigation-collapsible';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const ImgSource = {uri:'https://ravishly-9ac9.kxcdn.com/cdn/farfuture/edYzCuowlJVcDos1RjXSa8_1o5tGDQBE4ebEFE6R1OE/mtime:1479930604/sites/default/files/maxresdefault_2.jpg'};
const ImgSource = require('./../asset/cat.jpg');

class ImageScreen extends Component{
  static navigationOptions = ({navigation}) => ({
    headerStyle: {height: 200},
    header: 
      <View style={{width: '100%', height:'100%'}}>
        <Image source={ImgSource} 
          resizeMode={'cover'}
          style={{width: '100%', height: '100%'}}/>
        <SafeAreaView style={{position: 'absolute'}}>
          <HeaderBackButton tintColor={'white'} onPress={() => navigation.goBack()}/>                
        </SafeAreaView> 
      </View>
  })

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

export default withCollapsible(ImageScreen, {iOSCollapsedColor: 'purple'});