import React, {Component} from 'react';
import { Text, FlatList, View, Animated, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { HeaderBackButton } from 'react-navigation';

import { withCollapsible } from 'react-navigation-collapsible';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const ImgSource = {uri:'https://ravishly-9ac9.kxcdn.com/cdn/farfuture/edYzCuowlJVcDos1RjXSa8_1o5tGDQBE4ebEFE6R1OE/mtime:1479930604/sites/default/files/maxresdefault_2.jpg'};
const ImgSource = require('./../asset/cat.jpg');

class AdvancedScreen extends Component{
  static navigationOptions = ({navigation}) => {
    const { width: WINDOW_WIDTH } = Dimensions.get('window');
    const { translateProgress } = navigation.state.param || {};
    const translateX = (translateProgress && Animated.multiply(Animated.subtract(new Animated.Value(1), translateProgress), WINDOW_WIDTH)) || 0;
    
    return {
      headerStyle: {height: 150},
      header: 
        <View style={{width: '100%', height:'100%'}}>
          <Image source={ImgSource} 
            resizeMode={'cover'}
            style={{width: '100%', height: '100%', opacity: 0.5}}/>
          <SafeAreaView style={{position: 'absolute'}}>
            <HeaderBackButton tintColor={'white'} onPress={() => navigation.goBack()}/>                
          </SafeAreaView> 
          <Animated.View style={{
            position: 'absolute', bottom: 0, width: 6, height: 6, borderRadius: 3, backgroundColor: 'white',
            transform: [{translateX}]
          }}/>
        </View>
    };
  }

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
    const { translateY, translateProgress } = (this.props.navigation && this.props.navigation.state.params) || {};
    const { width: WINDOW_WIDTH } = Dimensions.get('window');

    const translateX = (translateProgress && Animated.multiply(Animated.subtract(new Animated.Value(1), translateProgress), WINDOW_WIDTH)) || 0;
    const tabHeight = 50;
    const Tab = () => (
      <Animated.View style={{
        width: '100%', height: tabHeight, backgroundColor: '#252', position: 'absolute', marginTop: paddingHeight,
        transform: [{translateY: translateY || 0}]
      }}>
        <Animated.View style={{
          position: 'absolute', bottom: 0, width: 6, height: 6, borderRadius: 3, backgroundColor: 'white',
          transform: [{translateX}]
        }}/>

      </Animated.View>
    )

    return (
      <View style={{flex: 1}}>
        <AnimatedFlatList 
          key='list'
          style={{flex: 1}}
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => String(index)}

          contentContainerStyle={{paddingTop: paddingHeight + tabHeight}}
          scrollIndicatorInsets={{top: paddingHeight + tabHeight}}
          onScroll={onScroll} 
          _mustAddThis={scrollY}
          />
        <Tab key='tab'/>
      </View>
    );
  }
}

export default withCollapsible(AdvancedScreen, {iOSCollapsedColor: 'purple'});