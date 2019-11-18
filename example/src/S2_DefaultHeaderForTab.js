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
      title: 'My Group 1',
    },
  },
);

export default withCollapsibleForTab(TopTabNavigator, {
  iOSCollapsedColor: '#032',
});
