import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.join(__dirname, '../../../');
export const STORE_DIR = path.join(PROJECT_ROOT, 'src/store');

export const STORE_DATA_DIR = path.join(PROJECT_ROOT, 'settings/data/json');
export const STORE_STATE_LIST_PATH = path.join(STORE_DATA_DIR, 'store-state-list.json');
export const STORE_GETTERS_LIST_PATH = path.join(STORE_DATA_DIR, 'store-getters-list.json');

export const STATE_REGEX_PATTERN = [
  /state\s*:\s*\(\)\s*:\s*\w+\s*=>\s*\(\s*{([\s\S]*?)}\s*\),/,
  /state\s*:\s*\(\)\s*:\s*\w+\s*=>\s*\(\s*{([\s\S]*?)}\s*\)|state\s*:\s*\(\)\s*=>\s*\(\s*{([\s\S]*?)}\s*\)/,
];
export const GETTERS_REGEX_PATTERN = [/getters\s*:\s*{([\s\S]*?)}\s*(?=,\s*actions|$)/];
