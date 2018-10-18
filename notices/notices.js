// fs.readFileSync is inlined by browserify transform "brfs"
const fs = require('fs')
const path = require('path')

module.exports = [
  {
    id: 0,
    read: false,
    date: 'Wed Sept 25 2018',
    title: 'Terms of Use',
    body: fs.readFileSync(path.join(__dirname, '/archive', 'notice_0.md'), 'utf8'),
  },
  {
    id: 2,
    read: false,
    date: 'Wed Sept 25 2018',
    title: 'Phishing Warning',
    body: fs.readFileSync(path.join(__dirname, '/archive', 'notice_2.md'), 'utf8'),
  },
]
