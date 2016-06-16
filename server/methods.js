
Meteor.methods({
  isAdmin: function() {
    var user = Meteor.user()
    if(!user)
      return false
    if(user.roles && user.roles.admin)
      return true
    return false
  },
  addTranslation: function(obj) {
    var user = Meteor.user()
    if(!user)
      throw new Meteor.Error('no user')
    var concept = Subject.findOne({uuid: obj.uuid, lang: obj.lang}, {sort: {'extra.trust': -1}})
    if(concept.extra.trust > user.profile.trust)
      throw new Meteor.Error('not enough trust')

    obj.extra = {user: user._id, trust: user.profile.trust}
    obj.extra.source = obj.source
    delete obj.source
    console.log('add: ' + JSON.stringify(obj))
    Subject.insert(obj)
    Concept.update({uuid: obj.uuid, lang: obj.lang}, {$set: {trust: obj.extra.trust}})
  },
  setTrust: function(userid, amount) {
    var user = Meteor.user()
    if(!user)
      throw new Meteor.Error('not authenticated')
    var userP = Meteor.users.findOne({_id: userid})
    if(!userP)
      throw new Meteor.Error('no user')
    if(user.profile.trust <= userP.profile.trust)
      throw new Meteor.Error('not enough trust')
    Meteor.users.update({_id: userid}, {$inc: {'profile.trust': amount}})
  },
  getMaxTrust: function() {
    return Meteor.users.findOne({}, {sort: {'profile.trust': -1}}).profile.trust
  },
  getRoles: function() {
    var user = Meteor.user()
    if(user)
      return user.roles
    return {}
  },
  setRole: function(userId, role, state) {
    var u = Meteor.user()
    if(!u || !u.roles || !u.roles.admin)
      return
    var user = Meteor.users.findOne(userId)
    if(!user || !user.emails)
      return
    var set = {}
    set['roles.'+role] = state
    Meteor.users.update({_id: userId}, {$set: set})

    this.unblock()
    sendEmail(user.emails[0].address, 
      'Omega Phi - ' + (state ? 'Added as ' : 'No longer ') + role, 
      'Dear ' + user.profile.firstName + ' ' + user.profile.lastName + ',' + '\n\n' +
      'We have ' + (state ? 'added you as a new ' : 'removed your role as ') + role + '.'
    )
  },
  countConcepts: function() {
    return Concept.find().count()
  }
})