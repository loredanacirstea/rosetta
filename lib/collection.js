UserS = new SimpleSchema({
    emails: {
      type: [Object],
      optional: true
    },
    "emails.$.address": {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
      type: Boolean
    },
    createdAt: {
      type: Date
    },
    profile: {
      type: Object,
      optional: true
    },
    'profile.firstName': {
        type: String,
        optional: true
    },
    'profile.lastName': {
        type: String,
        optional: true
    },
    'profile.avatar': {
      type: String,
        optional: true
    },
    'profile.trust': {
      type: Number,
      autoValue: function() {
        if(this.value || this.value == 0)
          return this.value;
        if(this.isInsert)
          return 1;
      }
    },
    services: {
      type: Object,
      optional: true,
      blackbox: true
    },
    roles: { // {admin:bool, editor:bool, blacklisted: no}
      type: Object,
      optional: true,
      blackbox: true
    }
});
Meteor.users.attachSchema(UserS);