import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationNativeContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {CollapsibleStack} from 'react-navigation-collapsible';

import {S1RegularScreen} from './src/S1-RegularHeaderScreen';
import {DetailScreen} from './src/DetailScreen';

type StackParamList = {
  Home: undefined;
  Detail: undefined;
  'S1-Regular': undefined;
};

export type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

function HomeScreen({navigation}: ScreenProps) {
  return (
    <View style={{flex: 1, paddingTop: 50, alignItems: 'center'}}>
      <Text
        onPress={() => {
          navigation.navigate('S1-Regular');
        }}>
        Sample1: Regular Header
      </Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'react-navigation-collapsible',
          }}
        />
        {CollapsibleStack(
          <Stack.Screen
            name="S1-Regular"
            component={S1RegularScreen}
            options={{
              headerStyle: {backgroundColor: 'green'},
              headerTintColor: 'white',
              title: 'Regular Header',
            }}
          />,
        )}
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: 'Detail Screen',
          }}
        />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

export default App;
