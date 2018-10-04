var cca = document.getElementsByClassName('cca');
var ad_slot_ids = [];
for (var i = 0; i < cca.length; i++) {
  if (cca[i].getAttribute('data-init') !== "true") {
    cca[i].setAttribute('data-init', "true");
    ad_slot_ids.push(cca[i].id);
  }
}
var cc = document.createElement('script'); cc.type = 'text/javascript'; cc.async = true;
cc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'platform.clearcoin.co/ad/display/' + ad_slot_ids.join('-');
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(cc, s);
