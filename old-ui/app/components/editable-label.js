const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const findDOMNode = require('react-dom').findDOMNode

module.exports = EditableLabel

inherits(EditableLabel, Component)
function EditableLabel () {
  Component.call(this)
}

EditableLabel.prototype.render = function () {
  const props = this.props
  const state = this.state

  if (state && state.isEditingLabel) {
    return h('div.editable-label', [
      h('input.sizing-input', {
        defaultValue: props.textValue,
        maxLength: '20',
        onKeyPress: (event) => {
          this.saveIfEnter(event)
        },
      }),
      h('button.editable-button', {
        onClick: () => this.saveText(),
      }, 'Save'),
    ])
  } else {
    return h('div.name-label', {
      onClick: (event) => {
        const nameAttribute = event.target.getAttribute('name')
        // checks for class to handle smaller CTA above the account name
        const classAttribute = event.target.getAttribute('class')
        if (nameAttribute === 'edit' || classAttribute === 'edit-text') {
          this.setState({ isEditingLabel: true })
        }
      },
    }, this.props.children)
  }
}

EditableLabel.prototype.saveIfEnter = function (event) {
  if (event.key === 'Enter') {
    this.saveText()
  }
}

EditableLabel.prototype.saveText = function () {
  // eslint-disable-next-line react/no-find-dom-node
  var container = findDOMNode(this)
  var text = container.querySelector('.editable-label input').value
  var truncatedText = text.substring(0, 20)
  this.props.saveText(truncatedText)
  this.setState({ isEditingLabel: false, textLabel: truncatedText })
}
