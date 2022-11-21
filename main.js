#!/usr/bin/env node
let inpArr = process.argv.slice(2)
const treeFn = require('./commands/tree')
const organizeFn = require('./commands/organize')
const helpFn = require('./commands/help')
//node main.js tree "directory path" | sysTree tree "directory path"
//node main.js tree                   | sysTree tree 
//node main.js organize "directory path" | sysTree organize "directory path" 
//node main.js help | sysTree help

///////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
//node main.js tree "directory path"
let command = inpArr[0]
switch (command) {
    case 'tree': treeFn(inpArr[1]); break;
    case 'organize': organizeFn(inpArr[1]); break;
    case 'help': helpFn(inpArr[1]); break;
    default:
        console.log('Please Input Right Command.😊');
}

