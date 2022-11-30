const { gitmojis } = require('./.semantic-release/gitmojis.json');

const allowedGitmojis = gitmojis.map((gitmoji) => gitmoji.code);

module.exports = {
  rules: {
    'type-enum': [1, 'always', allowedGitmojis],
    'header-max-length': [1, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
    'scope-case': [1, 'always', 'lower-case'],
    'subject-case': [1, 'always', ['sentence-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', ['.']],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(:\w+:)(?:\s*(.*):)? ([^:]*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
};
