import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import 'react-native-gesture-handler';

import { DefaultHeaderScreen } from './src/DefaultHeaderScreen';
import { StickyHeaderScreen } from './src/StickyHeaderScreen';
import { BackgroundHeaderScreen } from './src/BackgroundHeaderScreen';
import { BigHeaderScreen } from './src/BigHeaderScreen';
import { SubHeaderScreen } from './src/SubHeaderScreen';
import {
  CustomHeaderScreen,
  renderCustomHeader,
} from './src/CustomHeaderScreen';
import { DetailScreen } from './src/DetailScreen';

export type StackParamList = {
  Home: undefined;
  Detail: undefined;
  DefaultHeader: undefined;
  StickyHeader: undefined;
  BackgroundHeader: undefined;
  BigHeader: undefined;
  SubHeader: undefined;
  WithCustomHeader: undefined;
  CustomHeaderDetail: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const samples: { title: string; routeName: keyof StackParamList }[] = [
  { title: 'Sample 1-1: Default Header', routeName: 'DefaultHeader' },
  { title: 'Sample 1-2: Sticky Header', routeName: 'StickyHeader' },
  { title: 'Sample 1-3: Background Header', routeName: 'BackgroundHeader' },
  { title: 'Sample 2: Big Header', routeName: 'BigHeader' },
  { title: 'Sample 3: Sub Header', routeName: 'SubHeader' },
  { title: 'Sample 4: Custom Header', routeName: 'WithCustomHeader' },
];

function HomeScreen({ navigation }: ScreenProps) {
  return (
    <View style={{ flex: 1, paddingTop: 50, alignItems: 'center' }}>
      {samples.map((sample) => (
        <Text
          key={sample.title}
          style={{ margin: 15 }}
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

        {/* Sample 1-1: Default Header */}
        <Stack.Screen
          name="DefaultHeader"
          component={DefaultHeaderScreen}
          options={{
            headerTintColor: 'white',
            title: 'Default Header',
          }}
        />

        {/* Sample 1-2: Sticky Header */}
        <Stack.Screen
          name="StickyHeader"
          component={StickyHeaderScreen}
          options={{
            title: 'Sticky Header',
            headerStyle: { backgroundColor: 'white' },
          }}
        />

        {/* Sample 1-3: Background Header */}
        <Stack.Screen
          name="BackgroundHeader"
          component={BackgroundHeaderScreen}
          options={{
            title: 'Background Header',
            headerTintColor: 'white',
          }}
        />

        {/* Sample 2: Big Header */}
        <Stack.Screen
          name="BigHeader"
          component={BigHeaderScreen}
          options={{
            title: 'Big Header',
          }}
        />

        {/* Sample 3: Sub Header */}
        <Stack.Screen
          name="SubHeader"
          component={SubHeaderScreen}
          options={{
            headerStyle: { backgroundColor: 'green' },
            headerTintColor: 'white',
            title: 'Collapsible Sub Header',
          }}
        />

        {/* Sample 4: Custom Header */}
        <Stack.Screen
          name="WithCustomHeader"
          component={CustomHeaderScreen}
          options={{
            headerTintColor: 'white',
            title: 'Custom Header',
          }}
        />

        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: 'Detail Screen',
          }}
        />

        <Stack.Screen
          name="CustomHeaderDetail"
          component={DetailScreen}
          options={{
            title: 'Detail Screen',
            header: renderCustomHeader,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
