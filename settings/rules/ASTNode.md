# ASTNodeのプロパティの意味

抽象構文木（AST: Abstract Syntax Tree）は、ソースコードを解析し、コードの構造を木構造で表現したものです。ASTNodeは、ASTを構成する個々のノードであり、各ノードには特定のプロパティがあります。以下に、主要なASTNodeのプロパティとその意味について説明します。

## 一般的なプロパティ

- **type**: AST ノードの種類を示す文字列で、具体的なノードタイプを識別します。例えば、`VariableDeclarator`、`CallExpression`、`Literal` などが含まれます。
- **loc**: ソースコード内の位置情報を含むオブジェクトです。`loc.start` と `loc.end` にはそれぞれ行 `(line)` と列 `(column)` の情報が含まれています。
- **range**: ノードがカバーする範囲をバイト単位で示す 2 要素の配列で、ソースコード内の位置を指定します。`range[0]` が開始位置、`range[1]` が終了位置です。

## 特定のノードタイプのプロパティ

### VariableDeclarator

- **id**: 変数の名前を示すノードで、通常は `Identifier` ノードです。
- **init**: 変数の初期値を示すノードで、存在しない場合もあります。この場合、初期値は `null` になります。

例:

```json
{
  "type": "VariableDeclarator",
  "id": {
    "type": "Identifier",
    "name": "x"
  },
  "init": {
    "type": "Literal",
    "value": 10,
    "raw": "10"
  }
}
```

### CallExpression

- **callee**: 関数呼び出しの対象となるノードです。通常は `Identifier` または `MemberExpression` です。
- **arguments**: 関数に渡される引数のリストです。各引数は `ASTNode` です。

例:

```json
{
  "type": "CallExpression",
  "callee": {
    "type": "Identifier",
    "name": "myFunction"
  },
  "arguments": [
    {
      "type": "Literal",
      "value": 42,
      "raw": "42"
    }
  ]
}
```

### ObjectPattern

- **properties**: 分割代入されるプロパティのリストで、各プロパティは `Property` ノードです。

例:

```json
{
  "type": "ObjectPattern",
  "properties": [
    {
      "type": "Property",
      "key": {
        "type": "Identifier",
        "name": "a"
      },
      "value": {
        "type": "Identifier",
        "name": "a"
      },
      "kind": "init"
    },
    {
      "type": "Property",
      "key": {
        "type": "Identifier",
        "name": "b"
      },
      "value": {
        "type": "Identifier",
        "name": "b"
      },
      "kind": "init"
    }
  ]
}
```

### MemberExpression

- **object**: メンバーを含むオブジェクトのノードです。通常は `Identifier` または `MemberExpression` です。
- **property**: 参照されるプロパティのノードで、通常は `Identifier` です。
- **computed**: プロパティが計算されたものであるかどうかを示します。括弧記法が使用された場合は `true` になります。

例:

```json
{
  "type": "MemberExpression",
  "object": {
    "type": "Identifier",
    "name": "obj"
  },
  "property": {
    "type": "Identifier",
    "name": "prop"
  },
  "computed": false
}
```

### Identifier

- **name**: 識別子の名前を示します。

例:

```json
{
  "type": "Identifier",
  "name": "foo"
}
```

### Property

- **key**: プロパティのキーを示すノードで、通常は `Identifier` または `Literal` です。
- **value**: プロパティの値を示すノードです。
- **kind**: プロパティの種類を示す文字列で、`init`（初期化）、`get`（ゲッター）、`set`（セッター）のいずれかです。

例:

```json
{
  "type": "Property",
  "key": {
    "type": "Identifier",
    "name": "key"
  },
  "value": {
    "type": "Identifier",
    "name": "value"
  },
  "kind": "init"
}
```

### Literal

- **value**: リテラルの値を示します。例えば、文字列、数値、真偽値、null などです。
- **raw**: ソースコード上のリテラルの表現を示します。

例:

```json
{
  "type": "Literal",
  "value": 42,
  "raw": "42"
}
```

### FunctionDeclaration

- **id**: 関数の名前を示すノードで、通常は `Identifier` です。
- **params**: 関数の引数のリストで、各引数は `Identifier` ノードです。
- **body**: 関数の本体を示すノードで、`BlockStatement` ノードです。

例:

```json
{
  "type": "FunctionDeclaration",
  "id": {
    "type": "Identifier",
    "name": "myFunction"
  },
  "params": [
    {
      "type": "Identifier",
      "name": "x"
    }
  ],
  "body": {
    "type": "BlockStatement",
    "body": []
  }
}
```

### BlockStatement

- **body**: ブロック内の文のリストで、`Statement` ノードの配列です。

例:

```json
{
  "type": "BlockStatement",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "x"
          },
          "init": {
            "type": "Literal",
            "value": 10,
            "raw": "10"
          }
        }
      ],
      "kind": "var"
    }
  ]
}
```

### ExpressionStatement

- **expression**: 評価される式を示すノード。

例:

```json
{
  "type": "ExpressionStatement",
  "expression": {
    "type": "CallExpression",
    "callee": {
      "type": "Identifier",
      "name": "console.log"
    },
    "arguments": [
      {
        "type": "Literal",
        "value": "Hello, world!",
        "raw": "\"Hello, world!\""
      }
    ]
  }
}
```

### ReturnStatement

- **argument**: 返り値を示すノード。（存在しない場合もある）

例:

```json
{
  "type": "ReturnStatement",
  "argument": {
    "type": "Literal",
    "value": 42,
    "raw": "42"
  }
}
```

### IfStatement

- **test**: 条件式を示すノード。
- **consequent**: 条件が真の場合に実行される文を示すノード。(通常は `BlockStatement` )
- **alternate**: 条件が偽の場合に実行される文を示すノード。(存在しない場合もある)

例:

```json
{
  "type": "IfStatement",
  "test": {
    "type": "BinaryExpression",
    "operator": "===",
    "left": {
      "type": "Identifier",
      "name": "x"
    },
    "right": {
      "type": "Literal",
      "value": 10,
      "raw": "10"
    }
  },
  "consequent": {
    "type": "BlockStatement",
    "body": []
  },
  "alternate": null
}
```
