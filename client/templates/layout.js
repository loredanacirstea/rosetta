Template.layout1.onCreated(function() {
  $('head').append('<link rel="stylesheet" type="text/css" href="/ratchet-v2.0.2/css/ratchet.min.css">')
  $('head').append('<link rel="stylesheet" type="text/css" href="/ratchet-v2.0.2/css/ratchet-theme-ios.min.css">')
  $('head').append('<script src="/ratchet-v2.0.2/js/ratchet.min.js"></script>');
})

Template.titleBar.helpers({
  lang: function() {
    return sysLang.get()
  }
})