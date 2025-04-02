import { readFileSync } from 'fs';
import {
  createSourceFile,
  forEachChild,
  isArrowFunction,
  isBlock,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isParenthesizedExpression,
  isPropertyAssignment,
  isReturnStatement,
  isSpreadAssignment,
  isVariableDeclaration,
  ScriptTarget,
  type ArrowFunction,
  type CallExpression,
  type Expression,
  type Node,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'typescript';

export const extractStateProperties = (filePath: string): string[] => {
  const fileContent = readFileSync(filePath, 'utf-8');
  const sourceFile = createSourceFile(filePath, fileContent, ScriptTarget.Latest, true);
  const properties: string[] = [];

  findDefineStoreCalls(sourceFile, properties);

  return properties;
};

const findDefineStoreCalls = (sourceFile: SourceFile, properties: string[]) => {
  const visit = (node: Node) => {
    if (!isDefineStoreCall(node)) {
      forEachChild(node, visit);
      return;
    }

    const callExpr = node as CallExpression;
    const optionsArg = callExpr.arguments[1];

    if (!optionsArg || !isObjectLiteralExpression(optionsArg)) {
      return;
    }

    processStateProperty(sourceFile, optionsArg, properties);

    forEachChild(node, visit);
  };

  visit(sourceFile);
};

const isDefineStoreCall = (node: Node): node is CallExpression => {
  return isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === 'defineStore';
};

const processStateProperty = (sourceFile: SourceFile, optionsObj: ObjectLiteralExpression, properties: string[]) => {
  const stateProp = optionsObj.properties.find(
    (prop) => isPropertyAssignment(prop) && isIdentifier(prop.name) && prop.name.text === 'state',
  );

  if (!stateProp || !isPropertyAssignment(stateProp)) {
    return;
  }

  if (!isArrowFunction(stateProp.initializer)) {
    return;
  }

  const returnExpr = extractReturnExpression(stateProp.initializer);

  if (!returnExpr) {
    return;
  }

  extractPropertiesFromReturnExpression(sourceFile, returnExpr, properties);
};

const extractReturnExpression = (arrowFunc: ArrowFunction): Expression | undefined => {
  if (isParenthesizedExpression(arrowFunc.body) && isObjectLiteralExpression(arrowFunc.body.expression)) {
    return arrowFunc.body.expression;
  }

  if (isBlock(arrowFunc.body)) {
    const returnStatement = arrowFunc.body.statements.find(isReturnStatement);
    if (returnStatement && returnStatement.expression) {
      return returnStatement.expression;
    }
  }

  return undefined;
};

const extractPropertiesFromReturnExpression = (
  sourceFile: SourceFile,
  returnExpr: Expression,
  properties: string[],
) => {
  if (!isObjectLiteralExpression(returnExpr)) {
    return;
  }

  const spreadElement = returnExpr.properties.find((prop) => isSpreadAssignment(prop));

  if (spreadElement && isSpreadAssignment(spreadElement)) {
    if (isIdentifier(spreadElement.expression)) {
      const variableName = spreadElement.expression.text;
      findVariableProperties(sourceFile, variableName, properties);
    }
  } else {
    extractPropertiesFromObjectLiteral(returnExpr, properties);
  }
};

const findVariableProperties = (sourceFile: SourceFile, variableName: string, properties: string[]): void => {
  const findVariable = (node: Node): boolean => {
    if (
      isVariableDeclaration(node) &&
      isIdentifier(node.name) &&
      node.name.text === variableName &&
      node.initializer &&
      isObjectLiteralExpression(node.initializer)
    ) {
      extractPropertiesFromObjectLiteral(node.initializer, properties);
      return true;
    }

    return forEachChild(node, findVariable) || false;
  };

  forEachChild(sourceFile, findVariable);
};

const extractPropertiesFromObjectLiteral = (obj: ObjectLiteralExpression, properties: string[]): void => {
  for (const prop of obj.properties) {
    if (isPropertyAssignment(prop) && isIdentifier(prop.name)) {
      properties.push(prop.name.text);
    }
  }
};
