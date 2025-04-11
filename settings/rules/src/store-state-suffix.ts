import { ESLintUtils, type TSESLint, type TSESTree, type ParserServices } from '@typescript-eslint/utils';
import { isObjectPattern } from './helpers/ast-helper.js';
import { isIdentifierPropertyPair, isStoreToRefsDeclaration } from './helpers/function-checks.js';
import { createReportData, getTypeCheckingServices, getTypeString } from './helpers/types.js';
import type { PropertyWithIdentifier } from './types/eslint.js';
import type { TypeChecker } from 'typescript';

const MESSAGE_ID = 'requireStateSuffix' as const;

type RuleContext = Readonly<TSESLint.RuleContext<typeof MESSAGE_ID, []>>;

const needsStateSuffix = (
  property: PropertyWithIdentifier,
  typeChecker: TypeChecker,
  parserServices: ParserServices,
): boolean => {
  const typeString = getTypeString(property.value, typeChecker, parserServices);
  const hasStateSuffix = property.value.name.endsWith('State');
  const isNonComputedRef = typeString.includes('Ref') && !typeString.includes('ComputedRef');
  return !hasStateSuffix && isNonComputedRef;
};

const processVariableDeclarator = (node: TSESTree.VariableDeclarator, context: RuleContext): void => {
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
  create(context: RuleContext) {
    return {
      VariableDeclarator: (node) => processVariableDeclarator(node, context),
    };
  },
});
