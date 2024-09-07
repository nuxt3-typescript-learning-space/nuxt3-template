import { readFileSync } from 'fs';
import { resolve } from 'path';
import { isStoreToRefsCall, hasStateNameWithoutStateSuffix } from './helpers/astHelpers.js';
const stateListPath = resolve(new URL(import.meta.url).pathname, '../../../data/json/store-state-list.json');
const stateList = JSON.parse(readFileSync(stateListPath, 'utf8'));
export const storeStateSuffix = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'stateの値を使用する時は "State" という接尾辞をつける',
      recommended: 'recommended',
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
      if (node.type === 'Identifier') {
        return node.name;
      } else if (node.type === 'AssignmentPattern' && node.left.type === 'Identifier') {
        return node.left.name;
      }
      return '';
    }
    function isPropertyNode(prop) {
      return prop?.type === 'Property';
    }
    function checkVariableDeclaratorForStateSuffix(node) {
      if (isStoreToRefsCall(node) && node.id.type === 'ObjectPattern') {
        node.id.properties.forEach((prop) => {
          if (isPropertyNode(prop)) {
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
