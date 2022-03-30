module.exports = {
  pwa: {
    iconPaths: {
      favicon32: '/imgicon.png',
      favicon16: '.img/icon.png'
    }
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '^/chart': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
}
