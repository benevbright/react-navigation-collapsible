import * as React from 'react';
import { Animated, View, Text, Image, TouchableOpacity } from 'react-native';
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
      <>
        <Image
          source={{
            uri:
              'https://artwork.wallartprints.com/media/catalog/category/mountain-pictures.jpg',
          }}
          style={{ flex: 1 }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            alignItems: 'center',
            top: 80,
          }}>
          <Image
            source={{
              uri:
                'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?b=1&k=6&m=1223671392&s=612x612&w=0&h=5VMcL3a_1Ni5rRHX0LkaA25lD_0vkhFsb1iVm1HKVSQ=',
            }}
            style={{
              width: 100,
              height: 100,
              borderColor: 'lightgray',
              borderWidth: 6,
              borderRadius: 50,
            }}
          />
          <TouchableOpacity>
            <Text style={{ fontSize: 20, color: 'white', marginTop: 16 }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </>
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
