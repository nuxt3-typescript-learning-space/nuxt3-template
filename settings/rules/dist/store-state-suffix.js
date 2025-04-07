import { ESLintUtils } from '@typescript-eslint/utils';
import { isIdentifier, isObjectPattern, isProperty, isStoreToRefsCall } from './helpers/astHelpers.js';
const createRule = ESLintUtils.RuleCreator((name) => name);
export const storeStateSuffix = createRule({
  name: 'store-state-suffix',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require "State" suffix for state values destructured from storeToRefs',
    },
    messages: {
      requireStateSuffix:
        'State variables should have "State" suffix when used with storeToRefs. Please rename "{{name}}" to "{{name}}: {{name}}State"',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const typeChecker = parserServices.program.getTypeChecker();
    return {
      VariableDeclarator(node) {
        if (isStoreToRefsCall(node)) {
          if (isObjectPattern(node.id)) {
            node.id.properties.forEach((property) => {
              if (isProperty(property) && isIdentifier(property.key)) {
                let variableName = '';
                if (isIdentifier(property.value)) {
                  variableName = property.value.name;
                } else {
                  return;
                }
                if (variableName.endsWith('State')) {
                  return;
                }
                const tsNode = parserServices.esTreeNodeToTSNodeMap.get(property.value);
                const type = typeChecker.getTypeAtLocation(tsNode);
                const typeString = typeChecker.typeToString(type);
                if (typeString.includes('Ref') && !typeString.includes('ComputedRef')) {
                  context.report({
                    node: property.value,
                    messageId: 'requireStateSuffix',
                    data: {
                      name: variableName,
                    },
                  });
                }
              }
            });
          }
        }
      },
    };
  },
});
