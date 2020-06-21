import * as React from 'react';
import { Text, TouchableOpacity, Animated, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCollapsibleStack } from 'react-navigation-collapsible';

import { StackParamList } from '../App';

const data: number[] = [];
for (let i = 0; i < 100; i++) {
  data.push(i);
}

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const StickyHeaderScreen = ({ navigation }: ScreenProps) => {
  const {
    onScroll,
    containerPaddingTop,
    scrollIndicatorInsetTop,
    translateY,
  } = useCollapsibleStack();

  const searchHeaderHeight = 80;

  return (
    <>
      <Animated.FlatList
        data={data}
        onScroll={onScroll}
        contentContainerStyle={{
          paddingTop: containerPaddingTop + searchHeaderHeight,
        }}
        scrollIndicatorInsets={{
          top: scrollIndicatorInsetTop + searchHeaderHeight,
        }}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Detail')}
            style={{
              width: '100%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
            }}>
            <Text
              style={{
                fontSize: 22,
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item: any) => item.toString()}
      />

      {/* Sticky UI */}
      <Animated.View
        style={{
          transform: [{ translateY }],
          position: 'absolute',
          backgroundColor: 'skyblue',
          top: containerPaddingTop,
          height: searchHeaderHeight,
          width: '100%',
        }}>
        <View
          style={{
            flex: 1,
            margin: 10,
            backgroundColor: 'blue',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 20, color: 'white' }}>Sticky UI</Text>
        </View>
      </Animated.View>
    </>
  );
};

export { StickyHeaderScreen };
