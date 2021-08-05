import React from 'react';
import { Animated, LayoutChangeEvent } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';

type CustomHeader = (props: StackHeaderProps) => React.ReactNode;

export const createCollapsibleCustomHeaderAnimator = (
  customHeader: CustomHeader
) => (headerProps: StackHeaderProps) => (
  <Animated.View
    style={headerProps?.options?.headerStyle}
    onLayout={(e: LayoutChangeEvent) => {
      headerProps.navigation.setParams({
        collapsibleCustomHeaderHeight: e.nativeEvent.layout.height,
      });
    }}>
    {customHeader(headerProps)}
  </Animated.View>
);
