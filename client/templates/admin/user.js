Template.adminUsers.onCreated(function() {
  this.subscribe('users')
})

Template.adminUsers.helpers({
  user: function() {
    return Meteor.users.find({}).fetch()
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