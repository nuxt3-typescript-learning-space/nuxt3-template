import { reactiveValueSuffix } from './reactive-value-suffix.js';
import { storeGettersNotAlias } from './store-getters-not-alias.js';
import { storeStateSuffix } from './store-state-suffix.js';

const plugin = {
  meta: {
    name: 'eslint-custom-rules-plugin',
    version: '1.0.0',
  },
  rules: {
    'store-state-suffix': storeStateSuffix,
    'store-getters-not-alias': storeGettersNotAlias,
    'reactive-value-suffix': reactiveValueSuffix,
  },
};
export default plugin;
