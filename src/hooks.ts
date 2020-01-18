import { useRoute } from '@react-navigation/native';

import { Collapsible } from './types';

const useCollapsibleStack = (): Collapsible => {
  const route = useRoute();
  return (
    // @ts-ignore
    route.params?.collapsible || {
      onScroll: null,
      containerPaddingTop: 0,
      scrollIndicatorInsetTop: 0,
      translateY: 0,
      progress: 0,
      opacity: 1,
    }
  );
};

export { useCollapsibleStack };
