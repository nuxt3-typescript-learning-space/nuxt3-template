module.exports = {
  disableEmoji: false,
  format: '{type}: {emoji} {subject}',
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ['type', 'subject'],
  messages: {
    type: 'コミットの種類(型)を選択してください:',
    subject: 'コミットメッセージを入力してください:',
  },
  list: [
    'feat',
    'improve',
    'update',
    'fix',
    'hotfix',
    'refactor',
    'delete',
    'style',
    'docs',
    'move',
    'test',
    'chore',
    'package',
    'WIP',
  ],
  types: {
    feat: {
      emoji: '✨',
      description: '新機能の追加',
      value: 'feat',
    },
    improve: {
      emoji: '🎨',
      description: 'コードの構造/ロジックの改善',
      value: 'improve',
    },
    update: {
      emoji: '🩹',
      description: '軽微なバグ修正',
      value: 'update',
    },
    fix: {
      emoji: '🐛',
      description: 'バグ修正',
      value: 'fix',
    },
    hotfix: {
      emoji: '🚑',
      description: '緊急バグ修正',
      value: 'hotfix',
    },
    refactor: {
      emoji: '♻️',
      description: 'リファクタリング',
      value: 'refactor',
    },
    delete: {
      emoji: '🔥',
      description: 'ファイルやコードの削除',
      value: 'delete',
    },
    style: {
      emoji: '💄',
      description: 'UIやスタイルファイルの追加/更新',
      value: 'style',
    },
    docs: {
      emoji: '📝 ',
      description: 'ドキュメンテーションの追加/更新',
      value: 'docs',
    },
    move: {
      emoji: '🚚',
      description: 'ファイルやディレクトリの移動',
      value: 'move',
    },
    test: {
      emoji: '✅',
      description: 'テストの追加/更新/合格',
      value: 'test',
    },
    chore: {
      emoji: '🔧',
      description: '設定ファイルの追加/更新',
      value: 'chore',
    },
    package: {
      emoji: '📦',
      description: 'パッケージの追加/更新',
      value: 'package',
    },
    WIP: {
      emoji: '🚧',
      description: '作業途中',
      value: 'WIP',
    },
  },
};
