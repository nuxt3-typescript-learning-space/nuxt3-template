const config = {
  extends: ['gitmoji'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'type-case': [0, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'perf',
        'improve',
        'a11y',
        'update',
        'assets',
        'fix',
        'hotfix',
        'typo',
        'refactor',
        'delete',
        'style',
        'type',
        'docs',
        'move',
        'test',
        'chore',
        'ci',
        'package',
        'WIP',
      ],
    ],
  },
};

module.exports = config;
