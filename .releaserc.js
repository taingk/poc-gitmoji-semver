const path = require('path');
const { promisify } = require('util');
const dateFormat = require('dateformat');
const readFileAsync = promisify(require('fs').readFile);
const { gitmojis } = require('./.semantic-release/gitmojis.json');

const TEMPLATE_DIR = '.semantic-release';
const template = readFileAsync(path.join(TEMPLATE_DIR, 'default-template.hbs'));
const commitTemplate = readFileAsync(
  path.join(TEMPLATE_DIR, 'commit-template.hbs')
);

// List of Gitmoji that we don't want to show in our changelogs
const hiddenGitmojisFromChangelogs = [':construction:', ':fix:'];
// List of Gitmoji that can trigger a Major release and that is shown in the changelogs
const majorGitmojis = gitmojis.filter((gitmoji) => gitmoji.semver === 'major');
// List of Gitmoji that can trigger a Minor release and that is shown in the changelogs
const minorGitmojis = gitmojis.filter((gitmoji) => gitmoji.semver === 'minor');
// List of Gitmoji that can trigger a Patch release and that is shown in the changelogs
const patchGitmojis = gitmojis.filter((gitmoji) => gitmoji.semver === 'patch');
// List of Gitmoji that is shown in the changelogs
const otherGitmojis = gitmojis.filter(
  (gitmoji) =>
    gitmoji.semver === null &&
    !hiddenGitmojisFromChangelogs.includes(gitmoji.code)
);

// Used as helper in handlebars template (.semantic-release/default-template.hbs)
// For a "each" statement that takes a list of commit, return a commit by a given list of gitmojis
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

// Used as helper in handlebars template (.semantic-release/default-template.hbs)
// For a "if" statement that takes a list of commit, return a boolean to know if semver exists by a given list of gitmojis
const isSemverExist = function (context, gitmojis) {
  const commits = Object.values(context).flat();
  const listEmojis = gitmojis.map((gitmoji) => gitmoji.emoji.codePointAt(0));
  return commits.find((commit) =>
    listEmojis.includes(commit.gitmoji.codePointAt(0))
  );
};

module.exports = {
  branches: ['main', 'next'],
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
