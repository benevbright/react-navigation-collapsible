import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {
  createCollapsibleStack,
  createCollapsibleStackSub,
} from 'react-navigation-collapsible';

import {DefaultHeaderScreen} from './src/DefaultHeaderScreen';
import {SubHeaderScreen} from './src/SubHeaderScreen';
import {DetailScreen} from './src/DetailScreen';

export type StackParamList = {
  Home: undefined;
  Detail: undefined;
  WithDefaultHeader: undefined;
  WithSubHeader: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const samples: {title: string; routeName: keyof StackParamList}[] = [
  {title: 'Sample1: Default Header', routeName: 'WithDefaultHeader'},
  {title: 'Sample2: Sub Header', routeName: 'WithSubHeader'},
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
    <NavigationContainer>
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
        {createCollapsibleStack(
          <Stack.Screen
            name="WithDefaultHeader"
            component={DefaultHeaderScreen}
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
        {createCollapsibleStackSub(
          <Stack.Screen
            name="WithSubHeader"
            component={SubHeaderScreen}
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
    </NavigationContainer>
  );
}

export default App;
