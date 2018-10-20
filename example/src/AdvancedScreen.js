import React, {Component} from 'react';
import { Text, FlatList, View, Animated, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { HeaderBackButton } from 'react-navigation';

import { withCollapsible } from 'react-navigation-collapsible';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const imgSource = {uri:'https://ravishly-9ac9.kxcdn.com/cdn/farfuture/edYzCuowlJVcDos1RjXSa8_1o5tGDQBE4ebEFE6R1OE/mtime:1479930604/sites/default/files/maxresdefault_2.jpg'};
const imgSource = require('./../asset/cat.jpg');
const profileSource = [
  {uri: 'https://www.mein-haustier.de/wp-content/uploads/2016/04/Baby-Katze-Wiese-780x356.jpg'},
  {uri: 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'}
];

class AdvancedScreen extends Component{
  static navigationOptions = ({navigation}) => {
    const { translateProgress, selectedCatIndex } = navigation && navigation.state.params || {};
    const profileScale = (translateProgress && Animated.subtract(new Animated.Value(1), translateProgress)) || 0;
    const _selectedCatIndex = selectedCatIndex || 0;
    
    return {
      headerStyle: {height: 200},
      header: 
        <View style={{width: '100%', height:'100%', justifyContent: 'center'}}>
          <Image source={imgSource} 
            resizeMode={'cover'}
            style={{width: '100%', height: '100%', opacity: 0.5}}/>
          <SafeAreaView style={{position: 'absolute', top: 0}}>
            <HeaderBackButton tintColor={'white'} onPress={() => navigation.goBack()}/>                
          </SafeAreaView> 
          <Animated.Image 
            source={profileSource[_selectedCatIndex]} 
            style={{position: 'absolute', alignSelf: 'center', width: 100, height: 100, borderWidth: 4, borderColor: 'white', borderRadius: 50, transform:[{scale: profileScale}]}}/>
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
    const { translateY, translateProgress, selectedCatIndex } = (this.props.navigation && this.props.navigation.state.params) || {};
    const { width: WINDOW_WIDTH } = Dimensions.get('window');
    const _selectedCatIndex = selectedCatIndex || 0;

    const translateX = (translateProgress && Animated.multiply(translateProgress, WINDOW_WIDTH)) || 0;
    const tabHeight = 50;
    const Tab = () => (
      <Animated.View style={{
        width: '100%', height: tabHeight, backgroundColor: '#252', position: 'absolute', marginTop: paddingHeight, alignItems: 'center', flexDirection: 'row',
        transform: [{translateY: translateY || 0}]
      }}>
        <Animated.View style={{
          position: 'absolute', width: 5, left: -2.5, height: '100%', backgroundColor: '#fff8',
          transform: [{translateX}]
        }}/>
        <TouchableOpacity style={{paddingHorizontal: 10, left: 5}} onPress={() => this.props.navigation.setParams({selectedCatIndex: 0})}>
          <Text style={{color: _selectedCatIndex === 0 ? 'white' : 'gray'}}>Cat 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{paddingHorizontal: 10}} onPress={() => this.props.navigation.setParams({selectedCatIndex: 1})}>
          <Text style={{color: _selectedCatIndex === 1 ? 'white' : 'gray'}}>Cat 2</Text>
        </TouchableOpacity>
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