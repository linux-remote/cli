#!/usr/bin/env node

"use strict";

if(!process.env.NODE_ENV){
  process.env.NODE_ENV = 'production';
}

const path = require('path');
const os = require('os');
const { username, homeDir } = require('./lib/constant.js');

const { warnLog } = require('./lib/util.js');

const args = process.argv;
const command = args[2];

if(command === 'init'){ // sudo

  require('./lib/init.js')();

} else if(command === 'uninit'){ // sudo 

  require('./lib/uninit.js')();

} else {
  // ------------ Verify user is "linux-remote" ------------
  if(os.userInfo().username !== username){
    // switch to 'linux-remote' user
    console.log(`For safety, You need run command as '${username}' user. You can use the following command to switch:`);
    warnLog(`\nsudo su ${username} -s /bin/sh\n`);
    return;
  }
  
  // ------------ Run as "linux-remote" user ------------

  if(command === 'installManage'){
    require('./lib/install-manage.js')();
    return;
  }

  let manageMPath;
  if(process.env.NODE_ENV !== 'production'){
    manageMPath = path.join(__dirname, '../manage/index.js');
  } else {
    manageMPath = require.resolve('@linux-remote/manage', {
      paths: [ path.join(homeDir, 'node_modules')]
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




