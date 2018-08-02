import React, {Component} from 'react';
import { Text, FlatList, View, SafeAreaView, Animated, StatusBar, Platform } from 'react-native';
import withOrientation from 'react-navigation/src/views/withOrientation';

import { headerHeight, bounceHeight } from './App';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


class SecondScreen extends Component{
  static navigationOptions = props => {
    return ({
      title: 'Second Screen', 
      headerStyle: {
        backgroundColor: '#080'
      },
    });
  }

  constructor(props){
    super(props);

    const data = [];
    for(let i = 0 ; i < 30 ; i++){
      data.push(i);
    }

    this.state = {
      data: data
    }

    this.scrollY = new Animated.Value(0);
    this.headerY = Animated.diffClamp(this.scrollY, 0, bounceHeight);
  }

  componentDidMount(){
    this.props.navigation.setParams({headerY: this.headerY});
  }

  renderItem = ({item, index}) => (
    <View style={{width: '100%', height: 50, borderBottomColor: '#0002', borderBottomWidth: 0.5, paddingHorizontal: 20, justifyContent: 'center'}}>
      <Text style={{fontSize: 22}}>{item}</Text>
    </View>
  )

  onScroll = (e) => {
    // this.scrollYNoNativeRender.setValue(e.nativeEvent.contentOffset.y);
  }

  render(){
    const { isLandscape } = this.props;
    const statusBarHeight = isLandscape ? 0 : 20;
    // const headerColor = this.scrollYNoNativeRender.interpolate({
    //   inputRange: [0, headerHeight],
    //   outputRange: ['#f00', '#000'],
    //   extrapolate: 'clamp',
    // });

    const headerTranslate = this.headerY.interpolate({
      inputRange: [bounceHeight - headerHeight, bounceHeight],
      outputRange: [0, -headerHeight],
      extrapolate: 'clamp'
    });

    return (
      [
        <SafeAreaView key={'screen'} style={{flex: 1}}>
          <AnimatedFlatList 
            style={{flex: 1}}
            contentContainerStyle={{paddingTop: headerHeight}}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => String(index)}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.scrollY}}}],
              {useNativeDriver: true, listener: this.onScroll})
            } 
            />
        </SafeAreaView>,
        <Animated.View 
          key={'headerBG'} 
          style={{transform: [{translateY: headerTranslate}], position: 'absolute', width: '100%', height: statusBarHeight + headerHeight}}>
          <Animated.View style={{backgroundColor: 'red', flex: 1}}>
            <StatusBar/>
          </Animated.View>
        </Animated.View>
      ]
    )
  }
}

export default withOrientation(SecondScreen);