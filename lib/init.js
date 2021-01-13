const path = require('path');
const fs = require('fs');
const os = require('os');
const { homeDir, username } = require('./constant');
const { checkUser, checkHomeDir, successLog, execSyncInherit } = require('./util');





function init(){
  // process.argv not have single quotes and double quotes. but  support "`";
  // So use env.
  let cBuildTpl = process.env.C_BUILD_TPL;

  _preCheck(function(err){
    if(err){
      console.error(err.name + ': ' + err.message);
      return;
    }
    const currCwd = path.join(__dirname, '../');
    // Create User
    // -m, --create-home
    // '/usr/sbin/nologin' or '/bin/nologin'? used '/bin/false'
    // --skel=skel CentOS 8 Will lead to node: command not found(bash env not init).
    execSyncInherit(`useradd ${username} --system -m --base-dir=${path.dirname(homeDir)} --shell=/bin/false -K UMASK=022`, {cwd: currCwd});
    console.log('user add success.');
    execSyncInherit(`chmod 755 ${homeDir}`); // Some system default permission is 700.
    if(process.env.NODE_ENV === 'debug'){
      execSyncInherit(`usermod -aG vboxsf linux-remote`); // debug at VM share folder.
    }
    _runAsUser(`cp -r skel/* ${homeDir}`);
    console.log('init skel success.');
    cBuildTpl = cBuildTpl || 'gcc {{src}} -o {{out}}';
    
    const cSrc = homeDir + '/src/lr-login.c';
    const buildOut = homeDir + '/bin/lr-login';
    let buildCmd = _cmdRender(cBuildTpl, {src: cSrc, out: buildOut});
    execSyncInherit(buildCmd);
    console.log('build lr-login success.');
    execSyncInherit('chmod 750 ' + buildOut);
    execSyncInherit('chgrp linux-remote ' + buildOut);
    // execSyncInherit('setfacl -m u:linux-remote:rx ' + buildOut);
    execSyncInherit('chmod u+s ' + buildOut);
    console.log('set lr-login permission success.');
    console.log('npminstalling manage...');

    _runAsUser('npm install @linux-remote/manage@latest --save-exact', homeDir);
    console.log('npminstall manage success.');
    successLog('\nlinux-remote init success!\n');
  });
}

function _runAsUser(cmd, cwd){
  execSyncInherit(`runuser ${username} --shell=/bin/sh --command='${cmd}'`, {
    cwd
  });
}

function _cmdRender(tpl, {src, out}){
  return tpl.replace('{{src}}', "'" + src + "'")
    .replace('{{out}}', "'" + out + "'");
}

function _preCheck(callback){
  checkUser(function(err){
    if(err){
      return callback(err);
    }
    checkHomeDir(function(err){
      if(err){
        return callback(err);
      }
      callback(null);
    })
  })
}

module.exports = init;
