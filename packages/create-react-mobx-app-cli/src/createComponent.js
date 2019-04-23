const fs = require('fs');
const chalk = require('chalk');
const mkdirs = require('../utils/mkdirs.js').mkdirs;

module.exports = ({ program }) => {
  const componentName = program.component;
  const componentTarget = program.target;
  const url = `src/components/business${componentTarget ? `/${componentTarget}` : ''}/${componentName}`;
  mkdirs(url, () => {
    fs.open(`${url}/index.js`, 'ax', () => {
      const fileData = `import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';

@inject('${componentTarget ? `${componentTarget.replace(/^[A-Z]/, l => l.toLowerCase())}Store` : ''}')
@observer
export default class ${componentName} extends Component {
  render() {
    return <div>${componentName}</div>
  }
}`;
      fs.writeFile(`${url}/index.js`, fileData, (err, data) => {
        console.log('====================================');
        console.log(chalk.green(`创建 ${componentName} 组件 成功 `));
        console.log('====================================');
      });
    });
  });
};
