const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits

module.exports = ClearyBot

inherits(ClearyBot, Component)
function ClearyBot () {
  Component.call(this)
}

ClearyBot.prototype.render = function () {
  return (
    h('img.app-header__metafox', {
      src: './images/clearybot.svg',
      style: {
        height: 124,
        width: 144,
      },
    })
  )
}
