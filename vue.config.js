module.exports = {
    devServer: {
        proxy: {
            '^/data': {
                target: 'http://localhost:5000/',
                changeOrigin: true
            },
        }
    },
    pages: {
        dashboard: {
            entry: 'src/dashboard.js',
            template: 'public/dashboard.html',
            filename: 'dashboard.html',
            title: 'Dashboard'
        },
        login: {
            entry: 'src/login.js',
            template: 'public/login.html',
            filename: 'login.html',
            title: 'Login'
        },
        oauth: {
            entry: 'src/oauthconsent.js',
            template: 'public/oauthconsent.html',
            filename: 'oauthconsent.html',
            title: 'OAuth authentication'
        }
    },
    filenameHashing: false,
    chainWebpack: config => {
        config.optimization.delete('splitChunks')
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}