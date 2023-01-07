const path = require('path');
const WebpackBar = require('webpackbar'); // 显示打包进度条用的

const resolve = (dir) => path.resolve(__dirname, dir);
// const env = process.env.REACT_APP_ENV;

module.exports = ({ env: webpackEnv }) => {
  return {
    webpack: {
      plugins: [
        new WebpackBar({
          name: webpackEnv !== 'production' ? '正在启动' : '正在打包',
          color: '#fa8c16'
        })
      ],
      alias: {
        '@': resolve('src')
      },
      // configure这里可以拿到create-react-app的所有webpack配置，某些在外面修改不了的配置，可以在这配置
      configure: (webpackConfig, { env: webpackEnv, paths }) => {
        // console.log(env, paths)
        paths.appBuild = path.join(path.dirname(paths.appBuild), 'build');
        webpackConfig.output = {
          ...webpackConfig.output,
          ...{
            path: paths.appBuild
          }
        };
        webpackConfig.devtool =
          webpackEnv !== 'production' ? 'eval-source-map' : 'none';
        return webpackConfig;
      }
    },
    plugins: [],
    style: {
      postOptions: {
        plugins: [require('tailwindcss'), require('autoprefixer')]
      }
    },
    //配置代理解决跨域
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
  };
};
