#!/usr/bin/env node
const commander = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');
const createProject = require('./createProject.js');
const createView = require('./createView.js');
const createComponent = require('./createComponent.js');

const program = new commander.Command(packageJson.name)
  .version('1.0.0', '-v, --version')
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .option('init <name>')
  .option('view <name>')
  .option('component <name>')
  .option('--store-type <store>')
  .option('--use-npm')
  .option('--target <target>')
  .option('--own-store')
  .allowUnknownOption()
  .parse(process.argv);

if (program.hasOwnProperty('init')) {
  createProject({ program });
  return;
}

if (program.hasOwnProperty('view')) {
  createView({ program });
  return;
}

if (program.hasOwnProperty('component')) {
  createComponent({ program });
  return;
}
