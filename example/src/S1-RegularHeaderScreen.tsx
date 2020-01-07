import * as React from 'react';
import {Text, TouchableOpacity, Animated} from 'react-native';

import {ScreenProps} from '../App';
import {CollapsibleProps} from 'react-navigation-collapsible';

const data: number[] = [];
for (let i = 0; i < 100; i++) {
  data.push(i);
}

type Props = ScreenProps & CollapsibleProps;

const S1RegularScreen = ({navigation, collapsible}: Props) => {
  const {onScroll, containerPaddingTop} = collapsible || {};
  return (
    <Animated.FlatList
      data={data}
      onScroll={onScroll}
      contentContainerStyle={{paddingTop: containerPaddingTop}}
      // scrollIndicatorInsets={{top: containerPaddingTop}}
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

export {S1RegularScreen};
