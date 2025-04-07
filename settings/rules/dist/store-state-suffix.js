import { ESLintUtils } from '@typescript-eslint/utils';
import { isIdentifier, isObjectPattern, isProperty, isStoreToRefsCall } from './helpers/astHelpers.js';
const MESSAGE_ID = 'requireStateSuffix';
const createRule = ESLintUtils.RuleCreator((name) => name);
const isEligibleProperty = (property) => {
  if (!isProperty(property)) {
    return false;
  }
  return isIdentifier(property.key) && isIdentifier(property.value);
};
const hasStateSuffix = (name) => name.endsWith('State');
const isNonComputedRef = (typeString) => typeString.includes('Ref') && !typeString.includes('ComputedRef');
const getTypeString = (node, typeChecker, parserServices) => {
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const type = typeChecker.getTypeAtLocation(tsNode);
  return typeChecker.typeToString(type);
};
const needsStateSuffix = (property, typeChecker, parserServices) =>
  !hasStateSuffix(property.value.name) && isNonComputedRef(getTypeString(property.value, typeChecker, parserServices));
const createReportData = (property) => ({
  node: property.value,
  messageId: MESSAGE_ID,
  data: { name: property.value.name },
});
const processStoreToRefsDestructuring = (node, context, typeChecker, parserServices) => {
  if (!isStoreToRefsCall(node) || !isObjectPattern(node.id)) {
    return;
  }
  node.id.properties
    .filter(isEligibleProperty)
    .filter((property) => needsStateSuffix(property, typeChecker, parserServices))
    .forEach((property) => context.report(createReportData(property)));
};
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
      VariableDeclarator: (node) => processStoreToRefsDestructuring(node, context, typeChecker, parserServices),
    };
  },
});
