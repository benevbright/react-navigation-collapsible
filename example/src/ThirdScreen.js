import React, {Component} from 'react';
import { Text, FlatList, View, SafeAreaView, Animated, StatusBar, Platform } from 'react-native';
import withOrientation from 'react-navigation/src/views/withOrientation';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const headerHeight = 44;
const bounceHeight = Platform.select({ios: 250, android: headerHeight});

class ThirdScreen extends Component{
  static navigationOptions = props => {
    const { headerY } = props.navigation.state.params ? props.navigation.state.params : { headerY: null };
    const headerOpacity = !headerY ? 1 : headerY.interpolate({
      inputRange: [bounceHeight - headerHeight, bounceHeight],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });
    const headerTranslate = !headerY ? 0 : headerY.interpolate({
      inputRange: [bounceHeight - headerHeight, bounceHeight],
      outputRange: [0, -headerHeight],
      extrapolate: 'clamp'
    });

    return ({
      title: 'Third Screen', 
      headerStyle: {
        transform: headerY ? [{translateY: headerTranslate}] : [],
        overflow: 'hidden',
        opacity: headerOpacity,
        height: headerHeight,
        backgroundColor: '#0f05'
      },
      // style: { backgroundColor: '#f00' },
      // headerTransparent: true,
      // headerTitleStyle: {color: 'black'},
      // headerTintColor: 'black', 
    });
  }

  
  // scrollYNoNativeRender = new Animated.Value(0);

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
      <Animated.View style={{flex: 1, transform:[{translateY: headerTranslate}]}}>
        <AnimatedFlatList 
          style={{flex: 1, marginBottom: -headerHeight, overflow: 'hidden'}}
          // contentContainerStyle={{paddingTop: headerHeight}}
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => String(index)}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.scrollY}}}],
            {useNativeDriver: true, listener: this.onScroll})
          } 
          />
      </Animated.View>
    )
  }
}

export default withOrientation(ThirdScreen);