const path = require('path');
const { promisify } = require('util');
const dateFormat = require('dateformat');
const readFileAsync = promisify(require('fs').readFile);
const { gitmojis } = require('./gitmojis.json');

const TEMPLATE_DIR = '.semantic-release';
const template = readFileAsync(path.join(TEMPLATE_DIR, 'default-template.hbs'));
const commitTemplate = readFileAsync(
  path.join(TEMPLATE_DIR, 'commit-template.hbs')
);
const majorGitmojis = gitmojis.filter((gitmoji) => gitmoji.semver === 'major');
const minorGitmojis = gitmojis.filter((gitmoji) => gitmoji.semver === 'minor');
const patchGitmojis = gitmojis.filter((gitmoji) => gitmoji.semver === 'patch');
const otherGitmojis = gitmojis.filter((gitmoji) => gitmoji.semver === null);

const each = (context, options, gitmojis) => {
  const commits = Object.values(context).flat();
  const listEmojis = gitmojis.map((gitmoji) => gitmoji.emoji.codePointAt(0));
  let commit = '';

  for (let i = 0, j = commits.length; i < j; i++) {
    if (listEmojis.includes(commits[i].gitmoji.codePointAt(0))) {
      commit = commit + options.fn(commits[i]);
    }
  }

  return commit;
};

const isSemverExist = function (context, gitmojis) {
  const commits = Object.values(context).flat();
  const listEmojis = gitmojis.map((gitmoji) => gitmoji.emoji.codePointAt(0));
  return commits.find((commit) =>
    listEmojis.includes(commit.gitmoji.codePointAt(0))
  );
};

module.exports = {
  branches: ['main'],
  plugins: [
    [
      'semantic-release-gitmoji',
      {
        releaseRules: {
          major: majorGitmojis.map((gitmoji) => gitmoji.code),
          minor: minorGitmojis.map((gitmoji) => gitmoji.code),
          patch: patchGitmojis.map((gitmoji) => gitmoji.code),
        },
        releaseNotes: {
          template,
          partials: { commitTemplate },
          helpers: {
            datetime: function (format = 'UTC:yyyy-mm-dd') {
              return dateFormat(new Date(), format);
            },
            eachMajorSemver: (context, options) =>
              each(context, options, majorGitmojis),
            eachMinorSemver: (context, options) =>
              each(context, options, minorGitmojis),
            eachPatchSemver: (context, options) =>
              each(context, options, patchGitmojis),
            eachOtherSemver: (context, options) =>
              each(context, options, otherGitmojis),
            isMajorExist: (context) => isSemverExist(context, majorGitmojis),
            isMinorExist: (context) => isSemverExist(context, minorGitmojis),
            isPatchExist: (context) => isSemverExist(context, patchGitmojis),
            isOtherExist: (context) => isSemverExist(context, otherGitmojis),
          },
          issueResolution: {
            template: '{baseUrl}/{owner}/{repo}/issues/{ref}',
            baseUrl: 'https://github.com',
            source: 'github.com',
          },
        },
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      {
        prepareCmd: './scripts/bump-version.sh ${nextRelease.version}',
      },
    ],
    '@semantic-release/github',
  ],
};
