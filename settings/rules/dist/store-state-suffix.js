import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  isStoreToRefsCall,
  hasStateNameWithoutStateSuffix,
  isIdentifier,
  isProperty,
  isAssignmentPattern,
  isObjectPattern,
} from './helpers/astHelpers.js';
const stateListPath = resolve(new URL(import.meta.url).pathname, '../../../data/json/store-state-list.json');
const stateList = JSON.parse(readFileSync(stateListPath, 'utf8'));
export const storeStateSuffix = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'stateの値を使用する時は "State" という接尾辞をつける',
    },
    fixable: 'code',
    messages: {
      requireStateSuffix: 'stateの "{{name}}" には "State" というSuffix(接尾辞)が必要です。',
    },
    schema: [],
  },
  create(context) {
    function needsStateSuffix(originalName, nameToCheck) {
      return hasStateNameWithoutStateSuffix(originalName, nameToCheck, stateList);
    }
    function reportStateSuffixError(property, name) {
      context.report({
        node: property,
        messageId: 'requireStateSuffix',
        data: {
          name,
        },
      });
    }
    function checkPropertyWithStateSuffix(property) {
      const originalName = getPropertyName(property.key);
      const aliasName = getPropertyName(property.value);
      const nameToCheck = aliasName || originalName;
      if (needsStateSuffix(originalName, nameToCheck)) {
        reportStateSuffixError(property, nameToCheck);
      }
    }
    function getPropertyName(node) {
      if (isIdentifier(node)) {
        return node.name;
      } else if (isAssignmentPattern(node) && isIdentifier(node.left)) {
        return node.left.name;
      }
      return '';
    }
    function checkVariableDeclaratorForStateSuffix(node) {
      if (isStoreToRefsCall(node) && isObjectPattern(node.id)) {
        node.id.properties.forEach((prop) => {
          if (isProperty(prop)) {
            checkPropertyWithStateSuffix(prop);
          }
        });
      }
    }
    return {
      VariableDeclarator: checkVariableDeclaratorForStateSuffix,
    };
  },
  defaultOptions: [],
};
