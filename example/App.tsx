import * as React from 'react';
import {View, Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {hello} from 'react-navigation-collapsible';

const HomeScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', top: 100}}>
      <Text>{hello()}</Text>
    </View>
  );
};

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'react-navigation-collapsible',
    },
  },
});

const AppContainer = createAppContainer(AppNavigator);

const App = () => <AppContainer />;

export default App;
