import * as React from 'react';
import {Text, TouchableOpacity, Animated, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useCollapsibleStack} from 'react-navigation-collapsible';
import {useSafeArea} from 'react-native-safe-area-context';

import {StackParamList} from '../App';

const data: number[] = [];
for (let i = 0; i < 100; i++) {
  data.push(i);
}

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const DefaultHeaderScreen = ({navigation}: ScreenProps) => {
  const {
    onScroll,
    containerPaddingTop,
    scrollIndicatorInsetTop,
  } = useCollapsibleStack({
    backgroundColor: 'blue',
    collapsedColor: 'red',
    insets: useSafeArea(),
  });

  return (
    <Animated.FlatList
      data={data}
      onScroll={onScroll}
      nestedScrollEnabled
      contentContainerStyle={{paddingTop: containerPaddingTop}}
      // Issue with the indicator appearing in the middle?
      // scrollIndicatorInsets={{
      //   top: scrollIndicatorInsetTop,
      // }}
      renderItem={({item}: any) => (
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
  );
};

export {DefaultHeaderScreen};
