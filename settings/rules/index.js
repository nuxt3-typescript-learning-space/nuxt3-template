import { storeStateSuffix } from './dist/store-state-suffix.js';

const plugin = {
  meta: {
    name: 'eslint-custom-rules-plugin',
    version: '1.0.0',
  },
  rules: {
    'store-state-suffix': storeStateSuffix,
  },
};
export default plugin;
