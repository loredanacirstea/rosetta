Template.adminUsers.onCreated(function() {
  this.subscribe('users')
})

Template.adminUsers.helpers({
  user: function() {
    var user = Meteor.user()
    if(!user) return []
    return Meteor.users.find({'profile.trust' : {$lt: user.profile.trust}}, {sort: {'profile.trust': -1}}).fetch()
  },
  hasRole: function(role) {
    if(this.roles)
      return this.roles[role]
  }
})

Template.adminUsers.events({
  'click .addAdmin': function() {
    Meteor.call('setRole', this._id, 'admin', true)
  },
  'click .removeAdmin': function() {
    Meteor.call('setRole', this._id, 'admin', false)
  },
  'click .decrTrust': function() {
    Meteor.call('setTrust', this._id, -1)
  },
  'click .incrTrust': function() {
    Meteor.call('setTrust', this._id, 1)
  }
})