import * as React from 'react';
import { Animated } from 'react-native';
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

const DefaultHeaderScreen = ({ navigation }: ScreenProps) => {
  const {
    onScroll,
    // onScrollWithListener,
    containerPaddingTop,
    scrollIndicatorInsetTop,
  } = useCollapsibleHeader({
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'green',
        // height: 150,
      },
    },
    config: {
      collapsedColor: 'red',
    },
  });

  /* in case you want to use your listener
  const listener = ({nativeEvent}) => {
    console.log(nativeEvent);
  };
  const onScroll = onScrollWithListener(listener);
  */

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

export { DefaultHeaderScreen };
