import { useRoute } from '@react-navigation/native';

import { Collapsible } from './types';

const useCollapsibleStack = (): Collapsible => {
  const route = useRoute();
  // @ts-ignore
  return route.params?.collapsible || {};
};

export { useCollapsibleStack };
