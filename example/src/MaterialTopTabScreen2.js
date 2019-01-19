import React, {Component} from 'react';
import { View, Image, Animated } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import TabChild1Screen from './TabChild1Screen.js';
import DetailScreen from './DetailScreen';
import { withCollapsible, CollapsibleType } from 'react-navigation-collapsible';

const TopTabNavigator = createMaterialTopTabNavigator(
  {
    Screen1: { screen: TabChild1Screen },
    Screen2: { screen: TabChild1Screen },
    Screen3: { screen: DetailScreen },
  },
  {
    animationEnabled: true,
    defaultNavigationOptions:{
      tabBarOptions: {
        indicatorStyle: { backgroundColor: 'white' },
        style: { borderTopColor: 'transparent', borderTopWidth: 0, elevation: 0, backgroundColor: '#061' },
      },
    },
  }
);

class MaterialTopTabScreen extends Component{
  static router = TopTabNavigator.router;
  static navigationOptions = {
    title: 'Group Title',
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { paddingHeight, translateY, translateOpacity, translateProgress } = this.props.collapsible;
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
        <TopTabNavigator key='tab' screenProps={this.props} navigation={this.props.navigation}/>
      </Animated.View>
    );
  }
}

// eslint-disable-next-line no-unused-vars
const GroupImageHeader = ({navigation, collapsible}) => {
  // eslint-disable-next-line no-unused-vars
  const { translateY, translateOpacity, translateProgress } = collapsible;
  return (
    <View style={{width: '100%', height: '100%', justifyContent: 'center'}}>
      <Image source={require('./../asset/cat.jpg')} resizeMode="cover" style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }}/>
      <Image source={require('./../asset/cat.jpg')} resizeMode="cover" style={{ alignSelf: 'center', width: 100, height: 100, borderWidth: 4, borderColor: 'white', borderRadius: 50 }}/>
    </View>
  );
}

const collapsibleParams = {
  type: CollapsibleType.extraHeader,
  collapsibleComponent: GroupImageHeader,
  collapsibleBackgroundStyle: {
    height: 200, 
    backgroundColor: '#061'
  }
}

export default withCollapsible(MaterialTopTabScreen, collapsibleParams);