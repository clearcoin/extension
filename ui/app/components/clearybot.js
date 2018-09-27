const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const isNode = require('detect-node')
const findDOMNode = require('react-dom').findDOMNode

module.exports = ClearyComponent

inherits(ClearyComponent, Component)
function ClearyComponent () {
  Component.call(this)
}

ClearyComponent.prototype.render = function () {
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
