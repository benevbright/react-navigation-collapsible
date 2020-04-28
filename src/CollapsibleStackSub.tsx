// import * as React from 'react';
// import { Animated } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// import { useCollapsibleStack } from './hooks';

// const CollapsibleStackSub = ({ children }: { children: React.ReactNode }) => {
//   const navigation = useNavigation();
//   const { translateY } = useCollapsibleStack();

//   const handleLayout = ({
//     nativeEvent: {
//       layout: { height = 0 },
//     },
//   }) => {
//     navigation.setParams({
//       collapsibleSubHeaderHeight: height,
//       isCollapsibleDirty: true,
//     });
//   };

//   return (
//     <Animated.View
//       style={{
//         transform: [{ translateY }],
//         position: 'absolute',
//         width: '100%',
//       }}
//       onLayout={handleLayout}>
//       {children}
//     </Animated.View>
//   );
// };

// export { CollapsibleStackSub };
