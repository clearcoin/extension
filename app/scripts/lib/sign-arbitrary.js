var signmsg = {
  setBackgroundConnection: setBackgroundConnection,
  signArbitrary: signArbitrary
}

window.signarbit = signmsg

module.exports = signmsg 

var background = null
function setBackgroundConnection(backgroundConnection){
  background = backgroundConnection
}

function logOutCall(signedMsg){
//  console.log("CALL BACK")
  console.log(signMsg)
}

function signArbitrary(msgParams){
  console.log("CALL MADE TO SIGN")
  background.newUnsignedPersonalMessage(msgParams, logOutCall)
  background.signPersonalMessage(msgParams)
}
