#!/usr/bin/env node
const fs = require('fs');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const exec = require('child_process').exec;

const metaIntoFile = (files = [], meta) => {
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file).toString();
      const result = handlebars.compile(content)(meta);
      fs.writeFileSync(file, result);
    }
  });
};

const createProject = ({ program }) => {
  let projectName = program.init;
  if (!fs.existsSync(projectName)) {
    inquirer
      .prompt([
        {
          name: 'description',
          message: '请输入项目描述'
        },
        {
          name: 'author',
          message: '请输入作者名称'
        },
        {
          name: 'projectName',
          message: '请输入projectName'
        },
        {
          name: 'clientId',
          message: '请输入clientId'
        },
        {
          name: 'apiUrl',
          message: '请输入api路径'
        }
      ])
      .then(answers => {
        const spinner = ora('正在下载模板...');
        spinner.start();
        download(`Deari/react-${program.storeType || 'mobx'}-antd`, projectName, err => {
          if (err) {
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          } else {
            spinner.succeed('模版下载完成');
            const package = `${projectName}/v5/package.json`;
            const apidoc = `${projectName}/v5/apidoc.json`;
            const view = `${projectName}/view.html`;
            const feProperties = `${projectName}/fe.properties`;
            const indexJs = `${projectName}/v5/src/pages/index.react/index.js`;
            const pubConfig = `${projectName}/v5/config/webpack-config/pub.config.js`;
            const meta = {
              name: projectName,
              ...answers
            };
            metaIntoFile([apidoc, package, view, indexJs, feProperties, pubConfig], meta);
            const installType = program.useNpm ? 'npm' : 'yarn';
            const install = ora(`正在执行${installType} install...`);
            install.start();
            exec(`cd ${projectName}/v5 && ${installType} install`, err => {
              if (err) {
                install.fail();
                console.log(symbols.error, chalk.red(err));
              } else {
                install.succeed(`${installType} install 执行完成`);
                console.log(symbols.success, chalk.green('项目初始化完成'));
              }
            });
          }
        });
      });
  } else {
    // 错误提示项目已存在，避免覆盖原有项目
    console.log(symbols.error, chalk.red('项目已存在'));
  }
};

module.exports = createProject;
