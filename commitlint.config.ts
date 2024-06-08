const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'type-enum': [
      2,
      'always',
      [
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
    ],
  },
};

export default config;
