# react-navigation-collapsible

[![npm](https://img.shields.io/npm/v/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![npm](https://img.shields.io/npm/dm/react-navigation-collapsible.svg)](https://www.npmjs.com/package/react-navigation-collapsible) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![ci: github](https://github.com/benevbright/react-navigation-collapsible/workflows/CI/badge.svg)](https://github.com/benevbright/react-navigation-collapsible/actions?query=workflow%3ACI) [![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

An extension of react-navigation that makes your header collapsible.

Try out on [Expo Snack](https://snack.expo.io/@benevbright/react-navigation-collapsible-v5)

## Compatibility 🚧

| `react-navigation` | `react-navigation-collapsible` | Documentation                                                                        |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------------ |
| ≥ v5 (`latest`)    | v5 (`latest`)                  | current                                                                              |
| ≥ v3               | v3                             | [v3-4 branch](https://github.com/benevbright/react-navigation-collapsible/tree/v3-4) |
| v2                 | v2                             | [v2 branch](https://github.com/benevbright/react-navigation-collapsible/tree/v2)     |

🏗 **The Collapsible Tab-navigator** is no longer supported due to the [Android bug from react-native](https://github.com/facebook/react-native/issues/21801).

## Usage

### 1-1. Default Header

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/docs/demo-sample1-1.gif?raw=true" width="200">

```js
import {
  createCollapsibleStack,
  // disableExpoTranslucentStatusBar,
} from 'react-navigation-collapsible';

/* Expo only: If you disabled Expo's default translucent statusBar, please call this function as well.
disableExpoTranslucentStatusBar();
*/

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
            useNativeDriver: true /* Optional, default: true */,
            key:
              'HomeScreen' /* Optional, a key for your Stack.Screen element */,
            elevation: 4 /* Optional */,
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
    onScrollWithListener /* Event handler creator */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
    /* Animated.AnimatedInterpolation by scrolling */
    translateY /* 0.0 ~ -headerHeight */,
    progress /* 0.0 ~ 1.0 */,
    opacity /* 1.0 ~ 0.0 */,
  } = useCollapsibleStack();

  /* in case you want to use your listener
  const listener = ({nativeEvent}) => {
    console.log(nativeEvent);
  };
  const onScroll = onScrollWithListener(listener);
  */

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

### 1-2. Sticky Header

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/docs/demo-sample1-2.gif?raw=true" width="200">

See [/example/src/StickyHeaderScreen.tsx](https://github.com/benevbright/react-navigation-collapsible/tree/master/example/src/StickyHeaderScreen.tsx)

---

### 2. Sub Header (e.g Search Bar)

<img src="https://github.com/benevbright/react-navigation-collapsible/blob/master/docs/demo-sample2.gif?raw=true" width="200">

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

### 3. Custom Header

![Custom Header implementation example](docs/demo-sample-3.gif)

```js
function App() {
  return (
    <NavigationContainer
      /* Add headerMode="screen" to prevent the custom header from clashing with subsequent headers.
         If you don't do this, you will have to make sure the header is applied consistently.
         You can check the Custom Header implementation example to see a possible configuration for this */
      headerMode="screen"
    >
      <Stack.Navigator>
        /* Wrap your Stack.Screen */
        {createCollapsibleStack(
          <Stack.Screen
            name="HomeScreen"
            component={MyScreen}
            options={{
              title: 'Home',
            }}
          />,
          {
            /* Add a custom header to the createCollapsibleStack options the same way
               you would add it to the Stack.Screen options */
            header: ({ scene, previous, navigation }) => {
              const { options } = scene.descriptor;
              const title =
                options.headerTitle !== undefined
                  ? options.headerTitle
                  : options.title !== undefined
                  ? options.title
                  : scene.route.name;

              return (
                <MyHeader
                  title={title}
                  leftButton={
                    previous ? <MyBackButton onPress={navigation.goBack} /> : undefined
                  }
                  style={options.headerStyle}
                />
              );
            };
          }
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

See [/example/App.tsx](example/App.tsx) and [/example/src/CustomHeaderScreen.tsx](example/src/CustomHeaderScreen.tsx)

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
