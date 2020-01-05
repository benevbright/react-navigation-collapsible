import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationNativeContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {hello} from 'react-navigation-collapsible';
import 'react-native-gesture-handler';

import {DetailScreen} from './src/DetailScreen';
import {CollapsibleStack} from './src/Collapsible';

type StackParamList = {
  Home: undefined;
  Detail: undefined;
};

export type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

function HomeScreen({navigation}: ScreenProps) {
  return (
    <View style={{flex: 1}}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>3</Text>
      <Text>4</Text>
      <Text>4</Text>
      <Text>4</Text>
      <Text>4</Text>
      <Text>5</Text>
      <Text>6</Text>
      <Text
        onPress={() => {
          navigation.navigate('Detail');
        }}>
        Go to Detail
      </Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        {CollapsibleStack(
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              headerStyle: {backgroundColor: 'green'},
              headerTintColor: 'white',
            }}
          />,
        )}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'react-navigation-collapsible',
          }}
        />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}

export default App;
