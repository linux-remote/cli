
const { homeDir } = require('./constant');
const { execSyncInherit } = require('./util');

function installManage(){
  execSyncInherit('npm install @linux-remote/manage@latest --save-exact', {
    cwd: homeDir
  });
  console.log('npminstall manage success.');
}

module.exports = installManage;
