import * as React from 'react';
import { Animated, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCollapsibleBigHeader } from 'react-navigation-collapsible';

import { StackParamList } from '../App';
import { createRow } from './Row';

const data: number[] = [];
for (let i = 0; i < 100; i++) {
  data.push(i);
}

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const BigHeaderScreen = ({ navigation }: ScreenProps) => {
  const {
    onScroll,
    containerPaddingTop,
    scrollIndicatorInsetTop,
  } = useCollapsibleBigHeader({
    headerStyle: {
      height: 250,
    },
    headerBackground: (
      <TouchableOpacity style={{ flex: 1 }}>
        <Image
          source={{
            uri:
              'https://artwork.wallartprints.com/media/catalog/category/mountain-pictures.jpg',
          }}
          style={{ flex: 1 }}
        />
      </TouchableOpacity>
    ),
    collapsedColor: 'white',
  });

  return (
    <Animated.FlatList
      data={data}
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      renderItem={createRow(() => navigation.navigate('Detail'))}
      keyExtractor={(item: any) => item.toString()}
    />
  );
};

export { BigHeaderScreen };
