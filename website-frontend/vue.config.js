module.exports = {
  pwa: {
    iconPaths: {
      favicon32: 'icon.png',
      favicon16: 'icon.png'
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
