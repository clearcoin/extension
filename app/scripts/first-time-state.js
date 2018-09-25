const config = require('../config')
/**
 * @typedef {Object} FirstTimeState
 * @property {Object} config Initial configuration parameters
 * @property {Object} NetworkController Network controller state
 */

/**
 * @type {FirstTimeState}
 */
const initialState = {
  config: {selectedTokenAddress: config.XCLR_ADDRESS},
}

module.exports = initialState
