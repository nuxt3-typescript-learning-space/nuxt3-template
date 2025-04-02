import type { Node, ObjectLiteralExpression } from 'typescript';

/**
 * 変数名から変数宣言ノードを判定する純粋関数（型ガード）
 * オブジェクトリテラルで初期化された変数宣言を表す型
 */
export type VariableDeclarationWithObjectInitializer = Node & {
  name: { text: string };
  initializer: ObjectLiteralExpression;
};
