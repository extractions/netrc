const core = require('@actions/core');
const fs = require('fs');
const os = require('os');
const path = require('path');

try {
  const machine = encodeURI(core.getInput('machine')) || "''";
  const username = encodeURI(core.getInput('username')) || "''";
  const password = encodeURI(core.getInput('password')) || "''";
  const line = `machine ${machine} login ${username} password ${password}\n`;
  const netrc = path.resolve(os.homedir(), '.netrc');
  fs.writeFile(netrc, line, { flag: 'a' }, (error) => {
    if (error) throw error;
    core.info(`[netrc] wrote ${machine} credentials to ~/.netrc`);
  });
} catch (error) {
  core.setFailed(`[netrc] ${error.message}`);
}
