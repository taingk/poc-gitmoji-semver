const path = require('path');
const { promisify } = require('util');
const dateFormat = require('dateformat');
const readFileAsync = promisify(require('fs').readFile);

const TEMPLATE_DIR = '.semantic-release';
const template = readFileAsync(path.join(TEMPLATE_DIR, 'default-template.hbs'));
const commitTemplate = readFileAsync(
  path.join(TEMPLATE_DIR, 'commit-template.hbs')
);

module.exports = {
  branches: ['main'],
  plugins: [
    [
      'semantic-release-gitmoji',
      {
        releaseRules: {
          major: [':boom:'],
          minor: [':sparkles:'],
          patch: [
            ':bug:',
            ':ambulance:',
            ':lock:',
            ':zap:',
            ':lipstick:',
            ':arrow_down:',
            ':arrow_up:',
            ':pushpin:',
            ':chart_with_upwards_trend:',
            ':heavy_plus_sign:',
            ':heavy_minus_sign:',
            ':wrench:',
            ':globe_with_meridians:',
            ':pencil2:',
            ':rewind:',
            ':package:',
            ':alien:',
            ':bento:',
            ':wheelchair:',
            ':speech_balloon:',
            ':card_file_box:',
            ':children_crossing:',
            ':iphone:',
            ':egg:',
            ':alembic:',
            ':mag:',
            ':label:',
            ':triangular_flag_on_post:',
            ':goal_net:',
            ':dizzy:',
            ':wastebasket:',
            ':passport_control:',
            ':adhesive_bandage:',
            ':necktie:',
          ],
        },
        releaseNotes: {
          template,
          partials: { commitTemplate },
          helpers: {
            datetime: function (format = 'UTC:yyyy-mm-dd') {
              return dateFormat(new Date(), format);
            },
            json: function (context) {
              return JSON.stringify(context);
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
