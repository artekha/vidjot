if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://artekha:artekha@ds223019.mlab.com:23019/vidjot-prod'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}