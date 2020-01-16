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
import {S2SubHeaderScreen} from './src/S2-SubHeaderScreen';
import {DetailScreen} from './src/DetailScreen';

export type StackParamList = {
  Home: undefined;
  Detail: undefined;
  'S1-Regular': undefined;
  'S2-SubHeader': undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const samples: {title: string; routeName: keyof StackParamList}[] = [
  {title: 'Sample1: Regular Header', routeName: 'S1-Regular'},
  {title: 'Sample2: Sub Header', routeName: 'S2-SubHeader'},
];

function HomeScreen({navigation}: ScreenProps) {
  return (
    <View style={{flex: 1, paddingTop: 50, alignItems: 'center'}}>
      {samples.map(sample => (
        <Text
          key={sample.title}
          style={{margin: 15}}
          onPress={() => {
            navigation.navigate(sample.routeName);
          }}>
          {sample.title}
        </Text>
      ))}
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f002',
          },
        }}>
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
          {
            collapsedColor: 'red',
          },
        )}
        {CollapsibleStack(
          <Stack.Screen
            name="S2-SubHeader"
            component={S2SubHeaderScreen}
            options={{
              headerStyle: {backgroundColor: 'green'},
              headerTintColor: 'white',
              title: 'Collapsible Sub Header',
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
