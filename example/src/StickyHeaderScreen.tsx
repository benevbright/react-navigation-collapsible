import * as React from 'react';
import { Text, Animated, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCollapsibleHeader } from 'react-navigation-collapsible';

import { StackParamList } from '../App';
import { createRow } from './Row';

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
  } = useCollapsibleHeader({
    headerStyle: {
      backgroundColor: 'white',
    },
  });

  const stickyHeaderHeight = 100;

  return (
    <>
      <Animated.FlatList
        data={data}
        onScroll={onScroll}
        contentContainerStyle={{
          paddingTop: containerPaddingTop + stickyHeaderHeight,
        }}
        scrollIndicatorInsets={{
          top: scrollIndicatorInsetTop + stickyHeaderHeight,
        }}
        renderItem={createRow(() => navigation.navigate('Detail'))}
        keyExtractor={(item: any) => item.toString()}
      />

      {/* Sticky UI */}
      <Animated.View
        style={{
          transform: [{ translateY }],
          position: 'absolute',
          backgroundColor: 'skyblue',
          top: containerPaddingTop,
          height: stickyHeaderHeight,
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
