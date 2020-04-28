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

const StickyHeaderScreen = ({navigation}: ScreenProps) => {
  const {
    CollapsibleStack,
    CollapsibleSubStack,
    scrollIndicatorInsetTop,
    containerPaddingTop,
  } = useCollapsibleStack({
    backgroundColor: 'blue',
    collapsedColor: 'red',
    showsHorizontalScrollIndicator: true,
    showsVerticalScrollIndicator: true,
    collapsibleSubStack: true,
    insets: useSafeArea(),
  });

  return (
    <>
      <CollapsibleSubStack>
        <Text style={{fontSize: 20, color: 'white'}}>Sticky UI</Text>
      </CollapsibleSubStack>
      <CollapsibleStack>
        <Animated.FlatList
          data={data}
          // onScroll={onScroll}
          contentContainerStyle={{
            paddingTop: containerPaddingTop,
          }}
          scrollIndicatorInsets={{
            top: scrollIndicatorInsetTop,
          }}
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
      </CollapsibleStack>
    </>
  );
};

export {StickyHeaderScreen};
