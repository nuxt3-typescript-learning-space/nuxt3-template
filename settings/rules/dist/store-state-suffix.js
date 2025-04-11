import { ESLintUtils } from '@typescript-eslint/utils';
import { isObjectPattern } from './helpers/ast-helper.js';
import { isIdentifierPropertyPair, isStoreToRefsDeclaration } from './helpers/function-checks.js';
import { createReportData, getTypeCheckingServices, getTypeString } from './helpers/types.js';
const MESSAGE_ID = 'requireStateSuffix';
const needsStateSuffix = (property, typeChecker, parserServices) => {
  const typeString = getTypeString(property.value, typeChecker, parserServices);
  const hasStateSuffix = property.value.name.endsWith('State');
  const isNonComputedRef = typeString.includes('Ref') && !typeString.includes('ComputedRef');
  return !hasStateSuffix && isNonComputedRef;
};
const processVariableDeclarator = (node, context) => {
  if (!isStoreToRefsDeclaration(node) || !isObjectPattern(node.id)) return;
  const { typeChecker, parserServices } = getTypeCheckingServices(context);
  node.id.properties
    .filter(isIdentifierPropertyPair)
    .filter((property) => needsStateSuffix(property, typeChecker, parserServices))
    .forEach((property) => {
      context.report(createReportData(property.value, MESSAGE_ID));
    });
};
const createRule = ESLintUtils.RuleCreator((name) => name);
export const storeStateSuffix = createRule({
  name: 'store-state-suffix',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require "State" suffix for state values destructured from storeToRefs',
    },
    messages: {
      [MESSAGE_ID]:
        'State variables should have "State" suffix when used with storeToRefs. Please rename "{{name}}" to "{{name}}: {{name}}State"',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      VariableDeclarator: (node) => processVariableDeclarator(node, context),
    };
  },
});
