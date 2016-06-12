Template.langChooser.onRendered(function() {
  $('#langChooser').val(sysLang.get())
})

Template.langChooser.events({
  'change #langChooser': function(e, templ) {
    sysLang.set($('#langChooser').val())
  }
})

Template.langChooser.helpers({
  lang: function() {
    return ['es-p', 'ro-p']
  }
})


Template.settings.onCreated(function() {
  this.addUser = new ReactiveVar()
})

Template.settings.helpers({
  en: function() {
    return sysLang.get() == 'en'
  },
  addUser: function() {
    return Template.instance().addUser.get()
  },
  trustopt: function(e, templ) {
    var user = Meteor.user()
    if(!user)
      return
    var opts = []
    for(var i=0; i<user.profile.trust; i++)
      opts.push(i)
    return opts
  }
})

Template.settings.events({
  'click #GoogleLogin': function(e,templ) {
    Meteor.loginWithGoogle({
      requestPermissions: [
        'email'
      ],
      requestOfflineToken: false,
      loginStyle:  "redirect"//,
      //redirectUrl: '/browse'
    }, function(err) {
      if(err) console.log(err)
    })
  },
  'click #logout': function(e, templ) {
    Meteor.logout()
  },
  'click #addUser': function(e, templ) {
    templ.addUser.set(1)
  },
  'click #inviteUser': function(e, templ) {
    templ.addUser.set(0)
  }
})