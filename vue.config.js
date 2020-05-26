module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        disableHostCheck: true
    },
    configureWebpack: {
        externals: {
            'echarts': 'echarts',
            'axios': 'axios',
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            "NProgress": 'nprogress',
            'moment': 'moment'

        }
    },
    lintOnSave: false,
    productionSourceMap: false
}