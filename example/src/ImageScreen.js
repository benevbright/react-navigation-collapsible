import React, {Component} from 'react';
import { Text, FlatList, View, Animated, TouchableOpacity, Image, Platform } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { HeaderBackButton } from 'react-navigation';

import { CollapsibleHeaderBackView, makeCollapsibleParams, withCollapsibleOptions } from 'react-navigation-collapsible';

const headerHeight = 200;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class ImageScreen extends Component{
  static navigationOptions = ({navigationOptions, navigation}) => {
    return withCollapsibleOptions(
      navigationOptions,
      {
        collapsibleCustomHeader: 
          <View style={{width: '100%', height:'100%'}}>
            <Image source={require('./../asset/cat.jpg')} 
              resizeMode={'cover'}
              style={{width: '100%', height: '100%'}}/>
            <View style={{position: 'absolute', top: Platform.select({ios: 20, android: 0}), left: 0}}>
              <HeaderBackButton tintColor={'white'} onPress={() => navigation.goBack()}/>                
            </View> 
          </View>
      },
      navigation.state.params
    );
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

    this.scrollY = new Animated.Value(0);
    this.props.navigation.setParams(makeCollapsibleParams(
      this.scrollY, headerHeight, 'purple'));
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
    const { navigation } = this.props;

    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'never'}}>
          <AnimatedFlatList 
            trigger={this.scrollY}
            style={{flex: 1}}
            contentContainerStyle={{paddingTop: headerHeight}}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => String(index)}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.scrollY}}}],
              {useNativeDriver: true})
            } 
            />
        </SafeAreaView>
        <CollapsibleHeaderBackView navigation={navigation} />
      </View>
    )
  }
}