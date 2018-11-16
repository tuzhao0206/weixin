#运行方法

1.  npm install yarn -g
2.  yarn install
3.  yarn mock // 如果使用模拟接口
4.  yarn start // 新开窗口

#一些说明

1. /example 为自定义组件的使用范例
2. 抽离 ajax 的提示为全局吐司，避免每次异步请求要处理三层提示:开始、成功、失败；
3. ajax 结果现在不再拆包，既回调方法会获得包含 code 在内的数据结构，可以使用 es6 语法的参数解构来简化 data 的获取
4. 基于 webpack4 构建，分割代码等功能也许需要进一步优化；
5. 使用 css-loader 中的局部命名功能 :local(.class) 来规避多模块打包在一起可能造成样式冲突的问题；
