var ccdynas = document.getElementsByClassName('ccdynas');

if (ccdynas.length) {
  var w_h_ids = [];
  for (var i = 0; i < ccdynas.length; i++) {
    if (ccdynas[i].getAttribute('data-init') !== "true") {
      ccdynas[i].setAttribute('data-init', "true");
      w_h_ids.push(ccdynas[i].className.replace(/ccdynas /g, '') + '-' + ccdynas[i].id);
    }
  }
  var cc = document.createElement('script');
  cc.type = 'text/javascript';
  cc.async = true;

  // prod
  // cc.src = 'https://platform.clearcoin.co/ad/display-by-dims/' + btoa(unescape(encodeURIComponent(w_h_ids.join('!'))));
  // dev
  cc.src = 'http://localhost:3000/ad/display-by-dims/' + btoa(unescape(encodeURIComponent(w_h_ids.join('!'))));

  // todo: ...so this will only work if there is already a script tag somewhere on page?
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(cc, s);


  // relay to background script
  window.addEventListener("message", function(event) {
    var origin = event.origin;
    var data = event.data;
    if(event.data.source === "page") {
      vAPI.messaging.send('contentscript', {
        what: 'signImpression',
        impression_id: data.impression_id,
        origin: origin,
        timestamp: Math.floor(Date.now() / 1000)
      }, function(response){
        // console.log(response);
      });  
    }
  }, false);
}
