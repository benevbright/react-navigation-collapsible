import React, {Component} from 'react';
import { Animated } from 'react-native';
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
      <Animated.View style={{ flex: 1, marginTop: paddingHeight, transform: [{ translateY }] }}>
        <TopTabNavigator key='tab' screenProps={this.props} navigation={this.props.navigation}/>
      </Animated.View>
    );
  }
}

export default withCollapsible(MaterialTopTabScreen, { type: CollapsibleType.regularHeader, iOSCollapsedColor: 'blue' });