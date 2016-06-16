/*Meteor.publish('subjectstrust', function(query, options) {
  if(!this.userId)
    return
  var user = Meteor.users.findOne({_id: this.userId})

  query = query || {}
  options = options || {}

  query['extra.trust'] = {$lt: user.profile.trust}
  options.sort = {'extra.trust': -1}
  return Subject.find(query, options)
})*/

Meteor.publishComposite('subjectstrust', function(query, options) {
  if(!this.userId)
    return
  var user = Meteor.users.findOne({_id: this.userId})

  query = query || {}
  options = options || {}

  query.trust = {$lt: user.profile.trust}
  options.sort = {trust: -1}
  console.log(JSON.stringify(query))
  return {
    find: function() {
      return Concept.find(query, options)
    },
    children: [
      {
        find: function(c) {
          return Subject.find({uuid: c.uuid, lang: c.lang, 'extra.trust': c.trust})
        }
      }
    ]
  }
})


Meteor.publish('subjecttrust', function(uuid, langs) {
  if(!uuid) return
  var query = {uuid: uuid}
  if(langs)
    query.lang = {$in: langs}
  return Subject.find(query)
})


Meteor.publishComposite('kidstrust', function(uuid, langs, options) {
  if(typeof langs == 'string')
    langs = [langs]
  options = options || {}

  //console.log('publish kids; uuid: ' + uuid + '; options: ' + JSON.stringify(options))

  return {
    find: function() {
      return Relation.find({uuid2: uuid, relation: 1}, options)
    },
    children: [
      {
        find: function(r) {
          var obj = {uuid: r.uuid1}
          if(langs)
            obj.lang = {$in: langs}
          return Subject.find(obj)
        }
      }
    ]
  }
})

Meteor.publish('pathtrust', function(uuid, lang) {
  var uuids = getPathT(uuid)
  var obj = {uuid: {$in: uuids.path}}
  if(lang)
    obj.lang = lang
  return [
    Subject.find(obj),
    Relation.find({_id: {$in: uuids.rels}})
  ]
})



var recurs = 0
getPathT = function(uuid){
  var uuids = {path: [], rels: []}, rel, id = uuid;
  while(id != ontouuid && recurs < 100){
    recurs ++
    rel = Relation.findOne({uuid1:id, relation: 1})
    if(rel) {
      id = rel.uuid2
      uuids.path.push(id);
      uuids.rels.push(rel._id)
    }
    else
      break;
  }
  recurs = 0
  return uuids;
}

