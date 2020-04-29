import React, {useState} from 'react';
import {View, Button} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useCollapsibleStack} from 'react-navigation-collapsible';
import {useSafeArea} from 'react-native-safe-area-context';

import {StackParamList} from '../App';

type ScreenProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const DefaultHeaderScreenWithView = ({navigation}: ScreenProps) => {
  const {CollapsibleStack} = useCollapsibleStack({
    backgroundColor: 'blue',
    collapsedColor: 'red',
    showsHorizontalScrollIndicator: true,
    showsVerticalScrollIndicator: true,
    insets: useSafeArea(),
  });

  const [counter, setCounter] = useState(0);

  return (
    <CollapsibleStack>
      <View
        style={{
          height: 6000,
          backgroundColor: 'red',
        }}>
        <Button
          title={String(counter)}
          color={'white'}
          onPress={() => setCounter(counter + 1)}
        />
      </View>
    </CollapsibleStack>
  );
};

export {DefaultHeaderScreenWithView};
