require('babel-register')({
  ignore: name => name.includes('node_modules') && !name.includes('obs-store'),
})

require('./helper')
