# create-react-mobx-app

## 安装

yarn global install @liepin/create-react-mobx-app-cli

## 命令

````javascript
  iksw init <name> 创建项目

  iksw view <view-name> 创建view组件

  ikse view <view-name> --target <parent-view-name> 创建parent-view下面的view-name
  
  iksw component <view-name> --target <component-name> 创建view组件下的component组件
````

## 注意事项

  1、init：会在当前目录创建新项目，需保证当前目录下没有与项目名冲突的文件夹

  2、view：需要在有package.json的文件夹下使用该命令，会在stores，routes，views以及components下的business文件夹中创建相关文件
