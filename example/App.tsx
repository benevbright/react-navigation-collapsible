import React, {useRef, useState, useEffect, createRef} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {DefaultHeaderScreen} from './src/DefaultHeaderScreen';
import {StickyHeaderScreen} from './src/StickyHeaderScreen';
import {SubHeaderScreen} from './src/SubHeaderScreen';
import {DetailScreen} from './src/DetailScreen';

import AsyncStorage from '@react-native-community/async-storage';

export type StackParamList = {
  OtherHome: undefined;
  Home: undefined;
  Detail: undefined;
  DefaultHeader: undefined;
  StickyHeader: undefined;
  SubHeader: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const samples: {title: string; routeName: keyof StackParamList}[] = [
  {title: 'Sample 0: Other Home', routeName: 'OtherHome'},
  {title: 'Sample 1-1: Default Header', routeName: 'DefaultHeader'},
  {title: 'Sample 1-2: Sticky Header', routeName: 'StickyHeader'},
  {title: 'Sample 2: Sub Header', routeName: 'SubHeader'},
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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const CollapsibleStack = () => (
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
    <Stack.Screen
      name="OtherHome"
      component={View}
      options={{
        title: 'Other home',
      }}
    />

    {/* Sample 1-1: Default Header */}
    {createCollapsibleStack(
      <Stack.Screen
        name="DefaultHeader"
        component={DefaultHeaderScreen}
        options={{
          headerStyle: {backgroundColor: 'green'},
          headerTintColor: 'white',
          title: 'Default Header Updated',
        }}
      />,
      {
        collapsedColor: 'red',
      },
    )}

    {/* Sample 1-2: Sticky Header */}
    {createCollapsibleStack(
      <Stack.Screen
        name="StickyHeader"
        component={StickyHeaderScreen}
        options={{
          title: 'Sticky Header',
          headerStyle: {backgroundColor: 'white'},
        }}
      />,
    )}

    {/* Sample 2: Sub Header */}
    {createCollapsibleStackSub(
      <Stack.Screen
        name="SubHeader"
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
);

function App() {
  const [isReady, setIsReady] = useState(__DEV__ ? false : true);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString);
        console.log('Restore state', state);
        setInitialState(state);
      } catch (e) {
        console.log('Error restoring state', e);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      console.log('Restoring state');
      restoreState();
    }
  }, [isReady]);

  const _onStateChange = (state: any) => {
    console.log('state in _onStateChange', state);
    return AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  };

  if (!isReady) {
    return <ActivityIndicator />;
  }

  console.log('initialState', initialState);

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={_onStateChange}>
      <Tab.Navigator>
        <Tab.Screen name="OtherHome" component={View} />
        <Tab.Screen name="CollapsiblStack" component={CollapsibleStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
