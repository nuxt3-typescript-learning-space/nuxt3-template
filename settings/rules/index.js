import { reactiveValueSuffix } from './reactive-value-suffix.js';
import { storeStateSuffix } from './store-state-suffix.js';

const plugin = {
  meta: {
    name: 'eslint-custom-rules-plugin',
    version: '1.0.0',
  },
  rules: {
    'store-state-suffix': storeStateSuffix,
    'reactive-value-suffix': reactiveValueSuffix,
  },
};
export default plugin;
