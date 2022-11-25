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
            formattedChangelogs: function (context) {
              const commits = Object.values(context).flat();
              const majorCommits = commits.filter((commit) => {
                const listMajorGitmojis = majorGitmojis.map(
                  (gitmoji) => gitmoji.emoji
                );

                return listMajorGitmojis.includes(commit.gitmoji);
              });
              const minorCommits = commits.filter((commit) => {
                const listMinorGitmojis = minorGitmojis.map(
                  (gitmoji) => gitmoji.emoji
                );

                return listMinorGitmojis.includes(commit.gitmoji);
              });
              const patchCommits = commits.filter((commit) => {
                const listPatchGitmojis = patchGitmojis.map(
                  (gitmoji) => gitmoji.emoji
                );

                return listPatchGitmojis.includes(commit.gitmoji);
              });
              const otherCommits = commits.filter((commit) => {
                const listOtherGitmojis = otherGitmojis.map(
                  (gitmoji) => gitmoji.emoji
                );

                return listOtherGitmojis.includes(commit.gitmoji);
              });

              const formattedChangelogs = `
              ## 💥 Breaking changes
              ${majorCommits.map(
                (major) =>
                  `- [${major.commit.short}](https://github.com/${major.owner}/${major.repo}/commit/${major.commit.short}) ${major.gitmoji} ${major.subject}`
              )}
              ## ✨ New features
              ${minorCommits.map(
                (minor) =>
                  `- [${minor.commit.short}](https://github.com/${minor.owner}/${minor.repo}/commit/${minor.commit.short}) ${minor.gitmoji} ${minor.subject}`
              )}
              ## 🔧 Patch changes
              ${patchCommits.map(
                (patch) =>
                  `- [${patch.commit.short}](https://github.com/${patch.owner}/${patch.repo}/commit/${patch.commit.short}) ${patch.gitmoji} ${patch.subject}`
              )}
              ## 🚧 Others
              ${otherCommits.map(
                (other) =>
                  `- [${other.commit.short}](https://github.com/${other.owner}/${other.repo}/commit/${other.commit.short}) ${other.gitmoji} ${other.subject}`
              )}
              `;

              return formattedChangelogs;
            },
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
