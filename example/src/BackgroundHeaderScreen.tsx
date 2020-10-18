import * as React from 'react';
import { Animated, Image } from 'react-native';
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

const BackgroundHeaderScreen = ({ navigation }: ScreenProps) => {
  const {
    onScroll,
    containerPaddingTop,
    scrollIndicatorInsetTop,
  } = useCollapsibleHeader({
    navigationOptions: {
      headerStyle: {
        height: 250,
      },
      headerBackground: (
        <Image
          source={{
            uri:
              'https://artwork.wallartprints.com/media/catalog/category/mountain-pictures.jpg',
          }}
          style={{ flex: 1 }}
        />
      ),
    },
    config: { collapsedColor: 'red' },
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

export { BackgroundHeaderScreen };
