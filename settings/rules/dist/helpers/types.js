import { ESLintUtils } from '@typescript-eslint/utils';
export const getTypeString = (node, typeChecker, parserServices) => {
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const type = typeChecker.getTypeAtLocation(tsNode);
  const typeString = typeChecker.typeToString(type);
  return typeString;
};
export const getTypeCheckingServices = (context) => {
  const parserServices = ESLintUtils.getParserServices(context);
  const typeChecker = parserServices.program.getTypeChecker();
  return { parserServices, typeChecker };
};
export const createReportData = (node, messageId) => ({
  node,
  messageId,
  data: { name: node.name },
});
