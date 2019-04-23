const fs = require('fs');
const chalk = require('chalk');
const mkdirs = require('../utils/mkdirs.js').mkdirs;

module.exports = ({ program }) => {
  if (fs.existsSync('package.json')) {
    const { view: viewName, target: viewTarget } = program;
    const viewFirstLowerName = viewName.replace(/^[A-Z]/, l => l.toLowerCase());
    const viewTargetFirstLowerName = (viewTarget && viewTarget.replace(/^[A-Z]/, l => l.toLowerCase())) || '';
    const viewTargetStoreName = (viewTarget && `${viewTargetFirstLowerName}Store`) || '';
    const viewStoreName = `${viewFirstLowerName}Store`;
    const viewNameLower = viewName.toLowerCase();
    const viewUrl = `${viewTarget ? `src/views/${viewTarget}/childViews/${viewName}` : `src/views/${viewName}`}`;
    const routeUrl = `${
      viewTarget ? `src/routes/${viewTarget.toLowerCase()}/childRoutes/${viewNameLower}` : `src/routes/${viewNameLower}`
    }`;
    const ownStore = !viewTarget || !!program.ownStore;
    if (!fs.existsSync(`${viewUrl}`)) {
      // 创建view组件
      mkdirs(`${viewUrl}`, () => {
        fs.open(`${viewUrl}/index.js`, 'ax', () => {
          const fileData = `import React, {Component} from 'react';
import { toJS } from 'mobx';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';

@inject('${ownStore ? viewStoreName : viewTargetStoreName}')
@observer
export default class ${viewName} extends Component {
  render() {
    return (
      <div>${viewName}</div>
    )
  }
}`;
          fs.writeFile(`${viewUrl}/index.js`, fileData, () => {
            console.log(chalk.green(`创建${viewUrl}/index.js 成功`));
          });
        });
      });
      // 创建view组件对应components文件夹
      if (!viewTarget) mkdirs(`src/components/business/${viewName}`);
      // 创建store文件
      ownStore &&
        mkdirs(`src/stores/${viewName}Store`, () => {
          fs.open(`src/stores/${viewName}Store/index.js`, 'ax', () => {
            const fileData = `import { observable, computed, action, runInAction, toJS } from 'mobx';
import service from '../../services/${viewName}Service';
class ${viewName}Store {

}
export default new ${viewName}Store();`;
            fs.writeFile(`src/stores/${viewName}Store/index.js`, fileData, () => {
              fs.readFile(`src/stores/index.js`, (err, data) => {
                const fileData = data
                  .toString()
                  .replace(/export default {/, l => `${l}\n${viewStoreName},`)
                  .replace(/^./, l => `import ${viewStoreName} from './${viewName}Store';\n${l}`);
                fs.writeFile(`src/stores/index.js`, fileData, () => {
                  console.log(chalk.green(`创建src/stores/${viewName}Store/index.js 成功`));
                });
              });
            });
          });
        });
      // 创建路由;
      mkdirs(`${routeUrl}`, () => {
        fs.open(`${routeUrl}/index.js`, 'ax', () => {
          const fileData = `import onEnter from '${viewTarget ? '../../../' : '../'}_util/enter';

export default {
  path: '${viewNameLower}',
  indexRoute: {
    path: '',
    onEnter: () => onEnter('${viewNameLower}'),
    getComponent(nextState, cb) {
      require.ensure(
        [],
        require => {
          cb(null, require('../${viewTarget ? '../../../' : '../'}views/${
            viewTarget ? `${viewTarget}/childViews/` : ''
          }${viewName}').default);
        },
        '${viewName}'
      );
    },
  },
  childRoutes: []
};`;
          fs.writeFile(`${routeUrl}/index.js`, fileData, () => {
            fs.readFile(`src/routes/${viewTarget ? `${viewTarget.toLowerCase()}/` : ''}index.js`, (err, data) => {
              const fileData = data
                .toString()
                .replace(
                  /childRoutes: \[/,
                  l => `${l}require('./${viewTarget ? 'childRoutes/' : ''}${viewNameLower}').default,`
                );
              fs.writeFile(`src/routes/${viewTarget ? `${viewTarget.toLowerCase()}/` : ''}index.js`, fileData, () => {
                console.log(chalk.green(`创建${routeUrl}/index.js 成功`));
              });
            });
          });
        });
      });

      // 创建service文件
      ownStore &&
        mkdirs(`src/services/${viewName}Service`, () => {
          fs.open(`src/services/${viewName}Service/index.js`, 'ax', () => {
            const fileData = `import request from '../../common/js/utils/request';
import { message } from 'antd';

class ${viewName}Service {

}
export default new ${viewName}Service();`;
            fs.writeFile(`src/services/${viewName}Service/index.js`, fileData, () => {
              console.log(chalk.green(`创建src/services/${viewName}Service/index.js 成功`));
            });
          });
        });
    } else {
      console.log(chalk.red('该文件已存在'));
    }
  } else {
    console.log(chalk.red('请在根目录执行该命令'));
  }
};
