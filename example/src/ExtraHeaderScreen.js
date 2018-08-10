import React, {Component} from 'react';
import { Text, FlatList, View, Animated, TouchableOpacity } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import { 
  CollapsibleExtraHeader,
  createCollapsibleAnimated
} from 'react-navigation-collapsible';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class ExtraHeaderScreen extends Component{
  static navigationOptions = {
    title: 'Extra Header'
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

    this.scrollY = new Animated.Value(0);
    //enable Collapsible Extra Header
    this.extraHeaderY = createCollapsibleAnimated(this.scrollY);
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
    const extraHeaderHeight = 50;

    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'never'}}>
          <CollapsibleExtraHeader style={{height: extraHeaderHeight, backgroundColor: '#061'}} extraHeaderY={this.extraHeaderY}>
            <View style={{width: '100%', height: '100%', paddingHorizontal: 20, paddingVertical: 10}}>
              <View style={{backgroundColor: 'white', flex: 1, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'gray'}}>Search Here</Text>
              </View>
            </View>
          </CollapsibleExtraHeader>
          <AnimatedFlatList 
            style={{flex: 1}}
            contentContainerStyle={{paddingTop: extraHeaderHeight}}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => String(index)}

            collapsibleTrigger_mustAddThis={this.scrollY}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.scrollY}}}],
              {useNativeDriver: true})
            } 
            />
        </SafeAreaView>
      </View>
    )
  }
}