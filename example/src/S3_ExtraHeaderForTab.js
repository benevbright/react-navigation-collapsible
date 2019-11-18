import React from 'react';
import {View, Image, Animated} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import TabChild1Screen from './TabChild1Screen.js';
import ContextScreen from './ContextScreen';
import {withCollapsibleForTab} from 'react-navigation-collapsible';

const TopTabNavigator = createMaterialTopTabNavigator(
  {
    Screen1: {screen: TabChild1Screen},
    Screen2: {screen: TabChild1Screen},
    Screen3: {screen: ContextScreen},
  },
  {
    animationEnabled: true,
    defaultNavigationOptions: {
      tabBarOptions: {
        indicatorStyle: {backgroundColor: 'white'},
        style: {
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: '#061',
        },
      },
    },
    navigationOptions: {
      title: 'My Group 2',
    },
  },
);

// eslint-disable-next-line no-unused-vars
const GroupImageHeader = ({navigation, collapsible}) => {
  // eslint-disable-next-line no-unused-vars
  const {translateY, translateOpacity, translateProgress} = collapsible;
  return (
    <View style={{width: '100%', height: '100%', justifyContent: 'center'}}>
      <Image
        source={require('./../asset/cat.jpg')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.5,
        }}
      />
      <Animated.Image
        source={require('./../asset/cat.jpg')}
        resizeMode="cover"
        style={{
          transform: [{scale: translateOpacity}],
          alignSelf: 'center',
          width: 100,
          height: 100,
          borderWidth: 4,
          borderColor: 'white',
          borderRadius: 50,
        }}
      />
    </View>
  );
};

const collapsibleParams = {
  collapsibleComponent: GroupImageHeader,
  collapsibleBackgroundStyle: {
    height: 200,
    backgroundColor: '#061',
    disableFadeoutInnerComponent: true,
  },
};

export default withCollapsibleForTab(TopTabNavigator, collapsibleParams);
