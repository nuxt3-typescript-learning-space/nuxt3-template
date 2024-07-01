import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.join(__dirname, '../../');
export const STORE_DIR = path.join(PROJECT_ROOT, 'src/store');

export const STORE_DATA_DIR = path.join(PROJECT_ROOT, 'settings/data');
export const STORE_FILE_LIST_PATH = path.join(STORE_DATA_DIR, 'store-file-list.json');
export const STORE_STATE_LIST_PATH = path.join(STORE_DATA_DIR, 'store-state-list.json');
export const STORE_GETTERS_LIST_PATH = path.join(STORE_DATA_DIR, 'store-getters-list.json');

export const STATE_PATTERNS = [/state\s*:\s*\(\)\s*=>\s*\(\{([\s\S]*?)\}\),?/];
export const GETTER_PATTERNS = [/getters\s*:\s*\{([\s\S]*?)\}\s*(?=,\s*actions|,\s*state|$)/];
