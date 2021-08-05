import * as React from 'react';
import { Text, TouchableOpacity, Animated, View } from 'react-native';
import { StackNavigationProp, StackHeaderProps } from '@react-navigation/stack';
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

export const renderCustomHeader = ({
  navigation,
  options,
  route,
  progress,
}: StackHeaderProps) => {
  const title = options.headerTitle || options.title || route.name;

  return (
    <View
      style={{
        width: '100%',
        height: 200,
        backgroundColor: 'blue',
        padding: 20,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'gray',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 32,
            color: 'white',
            marginBottom: 10,
          }}>
          {title}
        </Text>

        {progress?.previous && (
          <TouchableOpacity onPress={navigation.goBack}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {'<< GO BACK'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const CustomHeaderScreen = ({ navigation }: ScreenProps) => {
  const { onScroll, containerPaddingTop, scrollIndicatorInsetTop } =
    useCollapsibleHeader({
      navigationOptions: {
        header: renderCustomHeader,
      },
    });

  return (
    <Animated.FlatList
      data={data}
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      renderItem={createRow(() => navigation.navigate('CustomHeaderDetail'))}
      keyExtractor={(item: any) => item.toString()}
    />
  );
};

export { CustomHeaderScreen };
