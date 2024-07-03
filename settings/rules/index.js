import { reactiveValueSuffix } from './reactive-value-suffix.js';
import { storeGettersNotSuffix } from './store-getters-not-suffix.js';
import { storeStateSuffix } from './store-state-suffix.js';

const plugin = {
  meta: {
    name: 'eslint-custom-rules-plugin',
    version: '1.0.0',
  },
  rules: {
    'reactive-value-suffix': reactiveValueSuffix,
    'store-getters-not-suffix': storeGettersNotSuffix,
    'store-state-suffix': storeStateSuffix,
  },
};
export default plugin;
