import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, '..');
export const STORE_DIR = path.resolve(PROJECT_ROOT, '../src/store');
export const STORE_STATE_LIST_PATH = path.resolve(PROJECT_ROOT, '../settings/rules/data/store-state-list.json');
export const STORE_GETTERS_LIST_PATH = path.resolve(PROJECT_ROOT, '../settings/rules/data/store-getters-list.json');
export const STATE_REGEX =
  /state\s*:\s*\(\)\s*:\s*\w+\s*=>\s*\(\s*{([\s\S]*?)}\s*\)|state\s*:\s*\(\)\s*=>\s*\({([\s\S]*?)}\)/;
export const GETTERS_REGEX = /getters\s*:\s*{([\s\S]*?)}\s*(?=,\s*actions|,\s*state|$)/;
