import * as React from 'react';
import {
  Text,
  TouchableOpacity,
  Animated,
  View,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useCollapsibleSubHeader,
  CollapsibleStackSub,
} from 'react-navigation-collapsible';

import { StackParamList } from '../App';

const data: number[] = [];
for (let i = 0; i < 100; i++) {
  data.push(i);
}

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const MySearchBar = () => (
  <View
    style={{
      padding: 13,
      width: '100%',
      height: 60,
      backgroundColor: 'green',
    }}>
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <TextInput placeholder="search here" />
    </View>
  </View>
);

const SubHeaderScreen = ({ navigation }: ScreenProps) => {
  const {
    onScroll,
    containerPaddingTop,
    scrollIndicatorInsetTop,
    translateY,
  } = useCollapsibleSubHeader();

  return (
    <>
      <Animated.FlatList
        data={data}
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: containerPaddingTop }}
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
        renderItem={({ item }: any) => (
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
      <CollapsibleStackSub translateY={translateY}>
        <MySearchBar />
      </CollapsibleStackSub>
    </>
  );
};

export { SubHeaderScreen };
