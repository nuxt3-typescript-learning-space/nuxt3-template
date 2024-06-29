import { readFileSync } from 'fs';
import { resolve } from 'path';

const stateList = JSON.parse(
  readFileSync(resolve(new URL('.', import.meta.url).pathname, './data/store-state-list.json'), 'utf8'),
);

export const storeStateSuffix = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'stateの値を使用する時は "State" という接尾辞をつける',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      requireStateSuffix:
        'stateの "{{name}}" には "State" 接尾辞が必要です。"{{name}}: {{name}}State" に変更してください。',
    },
    schema: [], // ルールのオプションはなし
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        if (
          node.id.type === 'ObjectPattern' &&
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee.name === 'storeToRefs'
        ) {
          node.id.properties.forEach((property) => {
            const originalName = property.key.name;
            const aliasName = property.value.name;
            const nameToCheck = aliasName || originalName;
            if (stateList.includes(originalName) && !nameToCheck.endsWith('State')) {
              context.report({
                node: property,
                messageId: 'requireStateSuffix',
                data: {
                  name: nameToCheck,
                },
                fix: (fixer) => {
                  const newName = `${nameToCheck}State`;
                  const newPropertySource = aliasName ? `${originalName}: ${newName}` : newName;
                  return fixer.replaceText(property, newPropertySource);
                },
              });
            }
          });
        }
      },
    };
  },
};
