var limit = maxFormCount
Template.browseConcepts.onCreated(function() {
  var page = FlowRouter.getQueryParam('page')
  var skip
  if(page)
    skip = parseInt(page) * limit
  SubjectSubs.subscribe('subjectstrust', {lang: sysLang.get()}, {skip: skip, limit: limit})
})

Template.browseConcepts.helpers({
  result: function() {
    var page = FlowRouter.getQueryParam('page')
    var skip = page ? (parseInt(page) * limit) : 0
    return Subject.find({lang: sysLang.get()}, {skip: skip, limit: limit})
  }
})


Template.babelConcept.onCreated(function() {
  var self = this
  this.autorun(function() {
    var uuid = routeUuid.get()
    var lang = sysLang.get()
    if(!uuid || !lang)
      return
    self.conceptSub = ConceptSubs.subscribe('subjecttrust', uuid)
    self.pathSub = PathSubs.subscribe('pathtrust', uuid, lang)
    self.kidsSub = KidsSubs.subscribe('kidstrust', uuid, lang, {limit: 50})
  })

  this.newTrans = new ReactiveVar()
})

Template.babelConcept.helpers({
  path: function() {
    var uuid = routeUuid.get()
    if(!uuid) return
    var lang = sysLang.get()
    if(!lang) return
    var rels = Relation.findOne({relation: 1, uuid2: {$ne: uuid}})
    if(Template.instance().pathSub.ready()) {
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
    return Subject.find({uuid: routeUuid.get(), lang: {$ne: 'jp'}}, {sort: {lang: -1}})
  },
  newTranslation: function() {
    return Template.instance().newTrans.get()
  },
  options: function() {
    if(!Meteor.user()) 
      return
    return Subject.find({uuid: routeUuid.get()}, {sort: {trust: -1}})
  }
})

Template.babelConcept.events({
  'change .selectTranslation': function(e, templ) {
    if(templ.$('.selectTranslation').val() == 'other')
      Template.instance().newTrans.set(true)
  },
  'click #newTranslationB': function(e, templ) {
    var transl = templ.$('#newTranslation').val()
    var sn = templ.$('#sourceN').val()
    var surl = templ.$('#sourceUrl').val()
    console.log(transl)
    Meteor.call('addTranslation', {
      uuid: routeUuid.get(), 
      lang: sysLang.get(), 
      subject: transl,
      source: {name: sn, url: surl}
    },
      function(err, res) {
      if(err) console.log(err)
    })
  }
})




