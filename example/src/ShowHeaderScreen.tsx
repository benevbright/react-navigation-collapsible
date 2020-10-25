import * as React from 'react';
import { Animated, Button, View } from 'react-native';
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

const ShowHeaderScreen = ({ navigation }: ScreenProps) => {
  const {
    onScroll,
    // onScrollWithListener,
    containerPaddingTop,
    scrollIndicatorInsetTop,
    showHeader
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
      renderItem={({ item, index }: any) => {
        if (index === 10 || index === 50 || index === 70) {
          return <View style={{
              width: '100%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomColor: 'gray',
              borderBottomWidth: 1,
          }}>
            <Button title="Show Header" onPress={showHeader}/>
          </View>
        }
        return createRow(() => navigation.navigate('Detail'))({item});
      }}
      keyExtractor={(item: any) => item.toString()}
    />
  );
};

export { ShowHeaderScreen };
