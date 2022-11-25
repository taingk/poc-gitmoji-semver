const path = require('path');
const { exec } = require('child_process');
const { load } = require('js-yaml');
const { readFileSync } = require('fs');

const getLocalEnv = path.join(__dirname, '../env.local.yaml');
const envs = load(readFileSync(getLocalEnv, 'utf-8'));
const option = process.argv[2];

gconst callback = (error, stdout, stderr) => {
  console.log(`STANDARD OUTPUT:\n\n${stdout}`);
  if (stderr) {
    console.log(`STANDARD ERROR/WARNING:\n\n${stderr}\n`);
  }
  if (error) {
    console.log(`ERROR:\n\n${error.message}\n`);
  }
};

const release = (option) => {
  if (option === '--dry-run') {
    return exec(
      `GH_TOKEN=${envs.common.GITHUB_PAT} npx semantic-release --no-ci --dry-run`,
      callback
    );
  }

  return exec(
    `GH_TOKEN=${envs.common.GITHUB_PAT} npx semantic-release --no-ci`,
    callback
  );
};

release(option);
