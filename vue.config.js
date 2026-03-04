const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = 'StarFinder';
            return args;
        });
    },
    devServer: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8089',
                changeOrigin: true
            }
        }
    }
})
