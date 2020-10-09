import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackHeaderProps,
} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {
  createCollapsibleStack,
  createCollapsibleStackSub,
} from 'react-navigation-collapsible';

import { DefaultHeaderScreen } from './src/DefaultHeaderScreen';
import { StickyHeaderScreen } from './src/StickyHeaderScreen';
import { SubHeaderScreen } from './src/SubHeaderScreen';
import { CustomHeaderScreen } from './src/CustomHeaderScreen';
import { DetailScreen } from './src/DetailScreen';

export type StackParamList = {
  Home: undefined;
  Detail: undefined;
  DefaultHeader: undefined;
  StickyHeader: undefined;
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
  { title: 'Sample 2: Sub Header', routeName: 'SubHeader' },
  { title: 'Sample 3: Custom Header', routeName: 'WithCustomHeader' },
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

function renderCustomHeader(props: StackHeaderProps) {
  const { options } = props.scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : props.scene.route.name;

  return (
    <View
      style={{
        width: '100%',
        height: 200,
        backgroundColor: 'blue',
        padding: 20,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'gray',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 32,
            color: 'white',
            marginBottom: 10,
          }}>
          {title}
        </Text>

        {props.previous && (
          <TouchableOpacity onPress={props.navigation.goBack}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'white',
                }}>{`<< GO BACK`}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
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

        {/* Sample 2: Sub Header */}
        {createCollapsibleStackSub(
          <Stack.Screen
            name="SubHeader"
            component={SubHeaderScreen}
            options={{
              headerStyle: { backgroundColor: 'green' },
              headerTintColor: 'white',
              title: 'Collapsible Sub Header',
            }}
          />,
        )}

        {/* Sample 3: Custom Header */}
        {createCollapsibleStack(
          <Stack.Screen
            name="WithCustomHeader"
            component={CustomHeaderScreen}
            options={{
              headerTintColor: 'white',
              title: 'Custom Header',
            }}
          />,
          {
            header: renderCustomHeader,
          },
        )}

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
