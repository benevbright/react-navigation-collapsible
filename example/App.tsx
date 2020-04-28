import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import 'react-native-gesture-handler';

import {DefaultHeaderScreen} from './src/DefaultHeaderScreen';
import {DefaultHeaderScreenWithView} from './src/DefaultHeaderScreenWithView';
import {StickyHeaderScreen} from './src/StickyHeaderScreen';
import {SubHeaderScreen} from './src/SubHeaderScreen';
import {DetailScreen} from './src/DetailScreen';

import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {enableScreens} from 'react-native-screens';
// https://reactnavigation.org/docs/react-native-screens
// Before rendering any navigation stack
enableScreens();

export type StackParamList = {
  Home: undefined;
  Detail: undefined;
  DefaultHeader: undefined;
  DefaultHeaderScreenWithView: undefined;
  StickyHeader: undefined;
  SubHeader: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const samples: {title: string; routeName: keyof StackParamList}[] = [
  {title: 'Sample 1-1: Default Header', routeName: 'DefaultHeader'},
  {
    title: 'Sample 1-1: Default Header With View',
    routeName: 'DefaultHeaderScreenWithView',
  },
  {title: 'Sample 1-2: Sticky Header', routeName: 'StickyHeader'},
  {title: 'Sample 2: Sub Header', routeName: 'SubHeader'},
];

function HomeScreen({navigation}: ScreenProps) {
  return (
    <View style={{flex: 1, paddingTop: 50, alignItems: 'center'}}>
      {samples.map((sample) => (
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

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const CollapsibleStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        // backgroundColor: '#f002', // <------- Caused a weird issue?
        backgroundColor: '#fddbdb',
      },
    }}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerTintColor: 'white',
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

    {/* Sample 1-1: Default Header */}
    <Stack.Screen
      name="DefaultHeaderScreenWithView"
      component={DefaultHeaderScreenWithView}
      options={{
        headerTintColor: 'white',
        title: 'Default Header With View',
      }}
    />

    {/* Sample 1-2: Sticky Header */}
    <Stack.Screen
      name="StickyHeader"
      component={StickyHeaderScreen}
      options={{
        headerTintColor: 'white',
        title: 'Sticky Header',
      }}
    />

    {/* Sample 2: Sub Header */}
    <Stack.Screen
      name="SubHeader"
      component={SubHeaderScreen}
      options={{
        headerTintColor: 'white',
        title: 'Collapsible Sub Header',
      }}
    />

    <Stack.Screen
      name="Detail"
      component={DetailScreen}
      options={{
        headerTintColor: 'white',
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

  return (
    <SafeAreaProvider>
      <NavigationContainer
        initialState={initialState}
        onStateChange={_onStateChange}>
        <CollapsibleStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
