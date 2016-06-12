import { Meteor } from 'meteor/meteor';

//var ontouuid = uuid.v1();

Meteor.startup(() => {
  //toRelation()
  //toSubject()
})

toRelation = function() {
  Relation.find().forEach(function(r) {
    Relation.update({_id: r._id}, {
      $set: {
        uuid1: r.concept1,
        uuid2: r.concept2,
        relation: parseInt(r.relation)
      }
    })
  })
}

toSubject = function() {
  var baseUser = Meteor.users.findOne(),
    trust = baseUser.profile.trust

  Subject.find().forEach(function(s) {
    Subject.update({_id: s._id}, {
      $set: {
        uuid: s.concept,
        lang: s.language,
        subject: s.term || '-', 
        extra: {
          user: baseUser._id, trust: 100, 
          source: {name: 'FIPAT', url: "http://www.unifr.ch/ifaa/"}
        }
      }
    })
  })
  // in robomongo
  //Subject.update({}, {$unset: {id: "", term_id: "", concept: "", language: "", term: "", updatedAt: ""}}, {multi: true})
  Subject.update({lang: 'es'}, {
    $set: {
      lang: 'es-p',
      'extra.trust': 0,
      'extra.source': {name: "Google Translate", url: "https://translate.google.com/"}
    }
  }, {multi: true})
  Subject.update({lang: 'ro'}, {
    $set: {
      lang: 'ro-p',
      'extra.trust': 0,
      'extra.source': {name: "Google Translate", url: "https://translate.google.com/"}
    }
  }, {multi: true})
  
}