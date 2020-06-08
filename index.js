#!/usr/bin/env node

"use strict";
const path = require('path');
const os = require('os');
const { username, homeDir } = require('./lib/constant.js');

if(!process.env.NODE_ENV){
  process.env.NODE_ENV = __dirname.indexOf(homeDir) === 0 ? 'production' : 'development';
}


const { warnLog } = require('./lib/util.js');

const args = process.argv;
const command = args[2];

if(command === 'init'){ // sudo

  const init = require('./lib/init.js');
  init();

} else if(command === 'uninit'){ // sudo 

  const uninit = require('./lib/uninit.js');
  uninit();

} else {
  
  // -v everybody can be use.
  const userInfo = os.userInfo();
  if(command !== '-v' && userInfo.username !== username){
    // switch to 'linux-remote' user
    console.log(`You need run command as '${username}' user.`);
    console.log(`You can use the following command to switch:`);
    warnLog(`\nsudo su ${username} -s /bin/bash\n`);

  } else { // 'linux-remote' user.
    let manageMPath;
    if(process.env.NODE_ENV !== 'production'){
      manageMPath = path.join(__dirname, '../manage/index.js');
    } else {
      manageMPath = require.resolve('@linux-remote/manage', {
        paths: [ homeDir + '/node_modules']
      });
    }


    const managerHandler = require(manageMPath);
    if(command === '-v' || 
        command === 'update' ||
        command === 'install'){
      const cliVersion = require(path.join(__dirname, 'package.json')).version;
      managerHandler(command, cliVersion);
    } else {
      managerHandler(command);
    }
  }

  // 'linux-remote' user field:
  // proxy to @linux-remote/manage
  // execSync(`linux-remote-manage ${command}${params}`, {
  //   cwd: homeDir
  // });

}




