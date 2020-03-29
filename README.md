# react-navigation-collapsible

[![npm](https://img.shields.io/npm/v/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![npm](https://img.shields.io/npm/dm/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![ci: github](https://github.com/benevbright/react-navigation-collapsible/workflows/CI/badge.svg)](https://github.com/benevbright/react-navigation-collapsible/actions?query=workflow%3ACI) [![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

An extension of react-navigation that makes your header collapsible.

Try out on [Expo Snack](https://snack.expo.io/@benevbright/react-navigation-collapsible-v5)

## Compatibility 🚧

| `react-navigation` | `react-navigation-collapsible` | Documentation                                                                        |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------------ |
| ≥ v5 (`latest`)     | v5 (`latest`)                   | current                                                                              |
| ≥ v3                | v3                              | [v3-4 branch](https://github.com/benevbright/react-navigation-collapsible/tree/v3-4) |
| v2                  | v2                              | [v2 branch](https://github.com/benevbright/react-navigation-collapsible/tree/v2)     |

🏗 **The Callapsible Tab-navigator** is no longer supported due to the [Android bug from react-native](https://github.com/facebook/react-native/issues/21801).

## Usage

### 1. Default Header

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/docs/demo-sample1.gif?raw=true">

```js
import { createCollapsibleStack } from 'react-navigation-collapsible';

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        /* Wrap your Stack.Screen */
        {createCollapsibleStack(
          <Stack.Screen
            name="HomeScreen"
            component={MyScreen}
            options={{
              headerStyle: { backgroundColor: 'green' },
              title: 'Home',
            }}
          />,
          {
            collapsedColor: 'red' /* Optional */,
          }
        )}
      </Stack.Navigator>
    </NavigationContainer>
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
    scrollIndicatorInsetTop /* number */,
    /* Animated.AnimatedInterpolation by scrolling */
    translateY /* 0.0 ~ -headerHeight */,
    progress /* 0.0 ~ 1.0 */,
    opacity /* 1.0 ~ 0.0 */,
  } = useCollapsibleStack();

  return (
    <Animated.FlatList
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      /* rest of your stuff */
    />
  );
};
```

See [/example/App.tsx](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/App.tsx) and [/example/src/DefaultHeaderScreen.tsx](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/DefaultHeaderScreen.tsx)

### 2. Sub Header (e.g Search Bar)

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/docs/demo-sample2.gif?raw=true">

```js
import { createCollapsibleStackSub } from 'react-navigation-collapsible';
/* use 'createCollapsibleStackSub' instead of 'createCollapsibleStack' */

/* The rest are the same with the default header. */
```

```js
import { Animated } from 'react-native';
import {
  useCollapsibleStack,
  CollapsibleStackSub,
} from 'react-navigation-collapsible';

const MySearchBar = () => (
  <View style={{ padding: 15, width: '100%', height: 60 }}>
    <TextInput placeholder="search here" />
  </View>
);

const MyScreen = ({ navigation, route }) => {
  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
  } = useCollapsibleStack();

  return (
    <>
      <Animated.FlatList
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: containerPaddingTop }}
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
        /* rest of your stuff */
      />
      /* Wrap your component with `CollapsibleStackSub` */
      <CollapsibleStackSub>
        <MySearchBar />
      </CollapsibleStackSub>
    </>
  );
};
```

See [/example/App.tsx](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/App.tsx) and [/example/src/SubHeaderScreen.tsx](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/SubHeaderScreen.tsx)

## Install

```bash
# install module
yarn add react-navigation-collapsible
```

## Contribution

PR is welcome!

### Testing your library code with the example

[/example](https://github.com/benevbright/react-navigation-collapsible/tree/master/example) imports the library directly from the root folder, configured with [babel-plugin-module-resolver](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/babel.config.js#L10).
So, just turn the `watch` option on at the root folder while you're making changes on the library, and check them on the example.

```bash
yarn tsc -w
```
