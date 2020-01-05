import * as React from 'react';
import {Text, FlatList, TouchableOpacity, Animated} from 'react-native';

import {ScreenProps} from '../App';
import {CollapsibleProps} from './Collapsible';

const data: number[] = [];
for (let i = 0; i < 100; i++) {
  data.push(i);
}

type Props = ScreenProps & CollapsibleProps;

const DetailScreen = ({navigation, collapsible}: Props) => {
  const {onScroll, containerPaddingTop} = collapsible || {};
  return (
    <Animated.FlatList
      data={data}
      onScroll={onScroll}
      contentContainerStyle={{paddingTop: containerPaddingTop}}
      // scrollIndicatorInsets={{top: containerPaddingTop}}
      renderItem={({item}: any) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
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
              fontSize: 25,
            }}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item: any) => item.toString()}
    />
  );
};

export {DetailScreen};
