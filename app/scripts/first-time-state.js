
/**
 * @typedef {Object} FirstTimeState
 * @property {Object} config Initial configuration parameters
 * @property {Object} NetworkController Network controller state
 */

/**
 * @type {FirstTimeState}
 */
const initialState = {
  config: {selectedTokenAddress: "0x1e26b3d07e57f453cae30f7ddd2f945f5bf3ef33"},
}

module.exports = initialState
