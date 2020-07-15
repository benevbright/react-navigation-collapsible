import * as React from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';
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

const CustomHeaderScreen = ({ navigation }: ScreenProps) => {
  const {
    onScroll,
    containerPaddingTop,
    scrollIndicatorInsetTop,
  } = useCollapsibleStack();

  return (
    <Animated.FlatList
      data={data}
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      renderItem={({ item }: any) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomHeaderDetail')}
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

export { CustomHeaderScreen };
