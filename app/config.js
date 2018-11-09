// when changing SERVICE_BASE_URL keep in mind that the base url is also hard coded in scripts/blocker/replace-ad.js
// const SERVICE_BASE_URL = "https://platform.clearcoin.co/"
const SERVICE_BASE_URL = "http://localhost:3000/"

const XCLR_ADDRESS = "0x1e26b3d07e57f453cae30f7ddd2f945f5bf3ef33"
const XCLR_SYMBOL = "XCLR"
const XCLR_DECIMALS = 8
const XCLR_NETWORK = "mainnet"

module.exports = {
  SERVICE_BASE_URL,
  XCLR_ADDRESS,
  XCLR_SYMBOL,
  XCLR_DECIMALS,
  XCLR_NETWORK
}
