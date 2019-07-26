import path from 'path';
// import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

export default {
  singular: true,
  treeShaking: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        locale: {
          enable: true,
          default: 'zh-CN',
          baseNavigator: true,
        },
        // dynamicImport: { // 切换路由 显示lodding
        //   loadingComponent: './component/PageLoading/index',
        // },
        dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  targets: {
    ie: 11,
  },
  // routes: pageRoutes,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // define: { //process.env.APP_TYPE可以访问到
  //   APP_TYPE: process.env.APP_TYPE || ''
  // },
  // externals: {  引入 包 不打包进去
  //   '@antv/data-set': 'DataSet',
  // },
  // lessLoaderOptions: {    默认情况下为false，从v3.0.0开始。允许在.less文件中内联JavaScript评估。这为一些开发人员带来了安全问题，他们不希望样式表的用户输入具有可执行代码。
  //   javascriptEnabled: true,
  // },
  // 出于一些原因的考虑，我们在处理路由时把所有 redirect 声明提到路由最前面进行匹配，但这导致了一些问题，所以添加了这个配置项，禁用 redirect 上提
  disableRedirectHoist: true,
  alias: {
    Utils: path.join(__dirname, '../src/utils'),
    Src: path.join(__dirname, '../src'),
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        //  '\\component\\Exception\\index.less'
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('\\')
          .map(a => a.replace(/([A-Z])/g, '-$1')) // 把大写字母 前面加-
          .map(a => a.toLowerCase()); // 大写转小写
        return `wxj${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  proxy: {
    '/dev': {
      target: 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com',
      changeOrigin: true,
    },
    '/api': {
      target: 'api',
      changeOrigin: true,
    },
    '/proxy808': {
      target: 'http://yapi.demo.qunar.com/mock/29852/zhuzhou/api/',
      changeOrigin: true,
      pathRewrite: { '^/proxy808': '' },
    },
    '/proxy809': {
      target: 'https://operation.callai.net/callai-operation/',
      changeOrigin: true,
      pathRewrite: { '^/proxy809': '' },
    },
    '/proxy8888': {
      // 这里的配置 需要有对应的服务器做代理 即nginx有配置
      target: 'http://192.168.8.52:8086/',
      changeOrigin: true,
    },
  },
  chainWebpack: webpackPlugin,
  // chainWebpack(config) {},
  manifest: {
    name: 'ant-design-pro',
    background_color: '#FFF',
    description: 'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },
};
