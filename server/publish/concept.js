Meteor.publish('general', function(collection, query, options) {
  console.log('publish general')
  query = query || {}
  options = options || {}
  return Om.C[collection].find(query, options)
})

Meteor.publish('subject', function(query, options) {
  console.log('publish subject')
  query = query || {}
  options = options || {}
  return Subject.find(query, options)
})


Meteor.publish('users', function() {
  if(!this.userId)
    return
  var user = Meteor.users.findOne({_id: this.userId}),
    query

  if(user.roles && user.roles.admin)
    query = {}
  else
    query = {'profile.trust': {$lt: user.profile.trust}}
  console.log('user query: ' + JSON.stringify(query))
  return Meteor.users.find(query, {fields: {emails: 1, profile: 1, roles: 1}})
})

Meteor.publish('user', function() {
  return Meteor.users.find({_id: this.userId}, {fields: {emails: 1, profile: 1, roles: 1}})
})

Meteor.publish('conceptall', function() {
  return [
    Subject.find(),
    Relation.find()
  ]
})

Meteor.publish('conceptCol', function(query, options) {
  query = query || {}
  options = options || {}
  return Concept.find(query, options)
})

Meteor.publish('term', function(uuid, langs) {
  if(!(langs instanceof Array))
    langs = [langs]
  return Subject.find({uuid: uuid, lang: {$in: langs}})
})

Meteor.publishComposite('concept', function(query, options) {
  query = query || {}
  options = options || {}
  options.sort = {upd: 1}

  return {
    find: function() {
      return Concept.find(query, options)
    },
    children: [
      {
        find: function(c) {
          return Subject.find({uuid: c.uuid})
        },
        children: [
          // All relations
          {
            find: function(s) {
              return Relation.find({uuid1: s.uuid})
            },
            // And Subjects with which relations exist
            children: [
              {
                find: function(r, s) {
                  var uuid = r.uuid1 == s.uuid ? r.uuid2 : r.uuid1
                  return Subject.find({uuid: uuid})
                }
              }
            ]
          }
        ]
      }
    ]
  }
})
