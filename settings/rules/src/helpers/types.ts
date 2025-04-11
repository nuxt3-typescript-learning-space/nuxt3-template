import { ESLintUtils, type ParserServices, type TSESLint, type TSESTree } from '@typescript-eslint/utils';
import type { TypeChecker } from 'typescript';

export const getTypeString = <T extends TSESTree.Node>(
  node: T,
  typeChecker: TypeChecker,
  parserServices: ParserServices,
): string => {
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const type = typeChecker.getTypeAtLocation(tsNode);
  const typeString = typeChecker.typeToString(type);
  return typeString;
};

export const getTypeCheckingServices = <T extends Readonly<TSESLint.RuleContext<string, unknown[]>>>(context: T) => {
  const parserServices = ESLintUtils.getParserServices(context);
  const typeChecker = parserServices.program.getTypeChecker();
  return { parserServices, typeChecker };
};

export const createReportData = <MessageId extends string>(
  node: TSESTree.Identifier,
  messageId: MessageId,
): { node: TSESTree.Identifier; messageId: MessageId; data: { name: TSESTree.Identifier['name'] } } => ({
  node,
  messageId,
  data: { name: node.name },
});
