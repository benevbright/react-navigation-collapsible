# react-navigation-collapsible

[![npm](https://img.shields.io/npm/v/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![npm](https://img.shields.io/npm/dm/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

An extension of react-navigation that makes your header collapsible.

Try out on [Expo Snack](https://snack.expo.io/@benevbright/react-navigation-collapsible)

## Usage

```js
import { CollapsibleStack } from 'react-navigation-collapsible';

function App() {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator>
        /* Wrap your Stack.Screen */
        {CollapsibleStack(
          <Stack.Screen
            name="HomeScreen"
            component={MyScreen}
            options={{
              headerStyle: { backgroundColor: 'green' },
              title: 'Home',
            }}
          />,
          {
            iOSCollapsedColor: 'red',
          }
        )}
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
}
```

```js
import { Animated } from 'react-native';
import { useCollapsibleStack } from 'react-navigation-collapsible';

const MyScreen = ({ navigation, route }) => {
  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    translateY /* Animated.Value, 0.0 ~ -headerHeight */,
    progress /* Animated.Value, 0.0 ~ 1.0 */,
    opacity /* Animated.Value, 1.0 ~ 0.0 */,
  } = useCollapsibleStack();

  return (
    <Animated.FlatList
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: containerPaddingTop }}
      /* rest stuff */
    />
  );
};
```

See [/example/App.tsx](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/App.tsx) and [/example/src/S1-RegularHeaderScreen.tsx](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/S1-RegularHeaderScreen.tsx)

## Install

```bash
# install module
yarn add react-navigation-collapsible@next
```

## Contribution

PR is welcome!

### Testing your library code with the example

[/example](https://github.com/benevbright/react-navigation-collapsible/tree/master/example) imports the library directly from the root folder, configured with [babel-plugin-module-resolver](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/babel.config.js#L10).
So, just turn the `watch` option on at the root folder while you're making changes on the library, and check them on the example.

```bash
yarn tsc -w
```
