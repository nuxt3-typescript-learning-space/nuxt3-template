import { storeStateSuffix } from './store-state-suffix.js';
export const meta = {
  name: 'eslint-custom-rules-plugin',
  version: '1.0.0',
};
export const rules = {
  'store-state-suffix': storeStateSuffix,
};
export default {
  meta,
  rules,
};
