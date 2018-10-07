/*function setBackgroundConnection(backgroundConnection){
  background = backgroundConnection
}*/

const signmsg = {
  signArbitrary: signArbitrary
}

module.exports = signmsg

//var metamaskController=null
function setController(controller){
  //metamaskController=metamaskController
  console.log("SET")
}

function logOutCall(signedMsg){
  console.log("CALL BACK")
  console.log(signedMsg)
}

function signArbitrary(msgParams){
  console.log("CALL MADE TO SIGN")
  console.log(msgParams)
  //globals.metamaskController.newUnsignedPersonalMessage(msgParams, logOutCall)
  //globlas.metamaskController.signPersonalMessage(msgParams)
}
