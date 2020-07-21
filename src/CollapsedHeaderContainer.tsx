import React from 'react';
import { Animated, LayoutChangeEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackHeaderProps } from '@react-navigation/stack';

interface Props extends StackHeaderProps {
  header: (props: StackHeaderProps) => React.ReactNode;
}

export const CollapsedHeaderContainer = ({ header, ...headerProps }: Props) => {
  const navigation = useNavigation();

  return (
    <Animated.View
      style={headerProps?.scene?.descriptor?.options?.headerStyle}
      onLayout={(e: LayoutChangeEvent) => {
        navigation.setParams({
          collapsibleCustomHeaderHeight: e.nativeEvent.layout.height,
          isCollapsibleDirty: true,
        });
      }}>
      {header(headerProps)}
    </Animated.View>
  );
};
