import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const createRow = (onPress: any) => ({ item }: any) => (
  <TouchableOpacity
    onPress={onPress}
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
);
