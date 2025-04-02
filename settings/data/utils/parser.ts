import fs from 'fs';
import ts from 'typescript';

export const extractStateProperties = (filePath: string): string[] => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);
  const properties: string[] = [];

  findDefineStoreCalls(sourceFile, properties);

  return properties;
};

const findDefineStoreCalls = (sourceFile: ts.SourceFile, properties: string[]) => {
  const visit = (node: ts.Node) => {
    if (!isDefineStoreCall(node)) {
      ts.forEachChild(node, visit);
      return;
    }

    const callExpr = node as ts.CallExpression;
    const optionsArg = callExpr.arguments[1];

    if (!optionsArg || !ts.isObjectLiteralExpression(optionsArg)) {
      return;
    }

    processStateProperty(sourceFile, optionsArg, properties);

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
};

const isDefineStoreCall = (node: ts.Node): node is ts.CallExpression => {
  return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'defineStore';
};

const processStateProperty = (
  sourceFile: ts.SourceFile,
  optionsObj: ts.ObjectLiteralExpression,
  properties: string[],
) => {
  const stateProp = optionsObj.properties.find(
    (prop) => ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === 'state',
  );

  if (!stateProp || !ts.isPropertyAssignment(stateProp)) {
    return;
  }

  if (!ts.isArrowFunction(stateProp.initializer)) {
    return;
  }

  const returnExpr = extractReturnExpression(stateProp.initializer);

  if (!returnExpr) {
    return;
  }

  extractPropertiesFromReturnExpression(sourceFile, returnExpr, properties);
};

const extractReturnExpression = (arrowFunc: ts.ArrowFunction): ts.Expression | undefined => {
  if (ts.isParenthesizedExpression(arrowFunc.body) && ts.isObjectLiteralExpression(arrowFunc.body.expression)) {
    return arrowFunc.body.expression;
  }

  if (ts.isBlock(arrowFunc.body)) {
    const returnStatement = arrowFunc.body.statements.find(ts.isReturnStatement);
    if (returnStatement && returnStatement.expression) {
      return returnStatement.expression;
    }
  }

  return undefined;
};

const extractPropertiesFromReturnExpression = (
  sourceFile: ts.SourceFile,
  returnExpr: ts.Expression,
  properties: string[],
) => {
  if (!ts.isObjectLiteralExpression(returnExpr)) {
    return;
  }

  const spreadElement = returnExpr.properties.find((prop) => ts.isSpreadAssignment(prop));

  if (spreadElement && ts.isSpreadAssignment(spreadElement)) {
    if (ts.isIdentifier(spreadElement.expression)) {
      const variableName = spreadElement.expression.text;
      findVariableProperties(sourceFile, variableName, properties);
    }
  } else {
    extractPropertiesFromObjectLiteral(returnExpr, properties);
  }
};

const findVariableProperties = (sourceFile: ts.SourceFile, variableName: string, properties: string[]): void => {
  const findVariable = (node: ts.Node): boolean => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === variableName &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      extractPropertiesFromObjectLiteral(node.initializer, properties);
      return true;
    }

    return ts.forEachChild(node, findVariable) || false;
  };

  ts.forEachChild(sourceFile, findVariable);
};

const extractPropertiesFromObjectLiteral = (obj: ts.ObjectLiteralExpression, properties: string[]): void => {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      properties.push(prop.name.text);
    }
  }
};
