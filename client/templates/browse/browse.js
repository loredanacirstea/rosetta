var limit = maxFormCount
Template.browseConcepts.onCreated(function() {
  var page = FlowRouter.getQueryParam('page')
  var skip
  if(page)
    skip = parseInt(page) * limit
  //SubjectSubs.subscribe('subjectstrust', {lang: sysLang.get()}, {skip: skip, limit: limit})
  this.subscribe('subjectstrust', {lang: sysLang.get()}, {skip: skip, limit: limit})
})

Template.browseConcepts.onRendered(function() {
  if(!Meteor.userId())
    FlowRouter.go('/settings')
})

Template.browseConcepts.helpers({
  result: function() {
    var page = FlowRouter.getQueryParam('page')
    var user = Meteor.user() || {profile:{trust:0}}
    var skip = page ? (parseInt(page) * limit) : 0
    return Subject.find({lang: sysLang.get(), 'extra.trust': {$lt: user.profile.trust}}, {skip: skip, limit: limit, sort: {'extra.trust': -1}})
  }
})


Template.babelConcept.onCreated(function() {
  var self = this
  this.autorun(function() {
    var uuid = routeUuid.get()
    var lang = sysLang.get()
    if(!uuid || !lang)
      return
    self.subscribe('subjecttrust', uuid)
    self.subscribe('pathtrust', uuid, lang)
    self.subscribe('kidstrust', uuid, lang, {limit: 50})
  })

  this.newTrans = new ReactiveVar()
  this.selected = new ReactiveVar()
})

Template.babelConcept.helpers({
  path: function() {
    var uuid = routeUuid.get()
    if(!uuid) return
    var lang = sysLang.get()
    if(!lang) return
    var rels = Relation.findOne({relation: 1, uuid2: {$ne: uuid}})
    if(Template.instance().subscriptionsReady()) {
      var uuids = getPathT(uuid)
      uuids.reverse()
      return uuids.map(function(id) {
        return Subject.findOne({uuid: id, lang: lang})
      })
    }
  },
  subj: function() {
    return Subject.findOne({uuid: routeUuid.get(), lang: sysLang.get()})
  },
  kids: function() {
    return Relation.find({uuid2: routeUuid.get(), relation: 1}).map(function(r) {
      return Subject.findOne({uuid: r.uuid1, lang: sysLang.get()})
    })
  },
  translation: function() {
    return Subject.find({uuid: routeUuid.get(), lang: {$nin: ['jp', 'es-p', 'es']}}, {sort: {lang: -1}})
  },
  newTranslation: function() {
    return Template.instance().newTrans.get()
  },
  currentTransl: function() {
    return Subject.findOne({uuid: routeUuid.get(), lang: sysLang.get()}, {sort: {'extra.trust': -1}})
  },
  options: function() {
    if(!Meteor.user()) 
      return
    var en = Subject.findOne({uuid: routeUuid.get(), lang: 'en'})
    var opts = [], subjs = []
    Subject.find({uuid: routeUuid.get(), lang: sysLang.get()}).fetch().sort(function(a,b){
      return b.extra.trust - a.extra.trust
    }).forEach(function(s) {
      if(subjs.indexOf(s.subject) == -1) {
        opts.push(s)
        subjs.push(s.subject)
      }
    })
    if(en)
      opts.push(en)
    return opts
  },
  selected: function() {
    return Template.instance().selected.get()
  }
})

Template.babelConcept.events({
  'change .selectTranslation': function(e, templ) {
    if(templ.$('.selectTranslation').val() == 'other')
      Template.instance().newTrans.set(true)
    else
      Template.instance().newTrans.set()
    if(templ.$('.selectTranslation').val() != '')
      Template.instance().selected.set(true)
    else
      Template.instance().selected.set()
  },
  'click #newTranslationB': function(e, templ) {
    var transl, source = {}
    if(templ.newTrans.get()) {
      transl = templ.$('#newTranslation').val()
      source.name = templ.$('#sourceN').val()
      source.url = templ.$('#sourceUrl').val()
    }
    else {
      transl = templ.$('.selectTranslation option:selected').val()
      source.subject = templ.$('.selectTranslation option:selected').data('id')
    }

    Meteor.call('addTranslation', {
      uuid: routeUuid.get(), 
      lang: sysLang.get(), 
      subject: transl,
      source: source
    },
      function(err, res) {
      if(err)
        console.log(err)
      else {
        templ.$('#newTranslation').val("")
        templ.$('#sourceN').val("")
        templ.$('#sourceUrl').val("")
        templ.$('.selectTranslation').val("")
        templ.newTrans.set(0)
      }
    })
  }
})