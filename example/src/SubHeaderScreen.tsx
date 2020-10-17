import * as React from 'react';
import { Animated, View, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useCollapsibleSubHeader,
  CollapsibleSubHeaderAnimator,
} from 'react-navigation-collapsible';

import { StackParamList } from '../App';
import { createRow } from './Row';

const data: number[] = [];
for (let i = 0; i < 100; i++) {
  data.push(i);
}

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const MySearchBar = () => (
  <View
    style={{
      padding: 13,
      width: '100%',
      height: 60,
      backgroundColor: 'green',
    }}>
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <TextInput placeholder="search here" />
    </View>
  </View>
);

const SubHeaderScreen = ({ navigation }: ScreenProps) => {
  const {
    onScroll,
    containerPaddingTop,
    scrollIndicatorInsetTop,
    translateY,
  } = useCollapsibleSubHeader();

  return (
    <>
      <Animated.FlatList
        data={data}
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: containerPaddingTop }}
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
        renderItem={createRow(() => navigation.navigate('Detail'))}
        keyExtractor={(item: any) => item.toString()}
      />
      <CollapsibleSubHeaderAnimator translateY={translateY}>
        <MySearchBar />
      </CollapsibleSubHeaderAnimator>
    </>
  );
};

export { SubHeaderScreen };
