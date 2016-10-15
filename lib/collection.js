Concept = new Mongo.Collection('concepts')
ConceptsS = new SimpleSchema({
  uuid: {
    type: String,
    label: "UUID"
  },
  lang: {
    type: String,
    label: 'Language'
  },
  upd: {
    type: Date,
    label: 'Updated At',
    autoValue: function() {
      if(this.value)
        return this.value
      return new Date()
    }
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    autoValue: function() {
      if (this.isInsert)
        return new Date();
      if (this.isUpsert)
        return {$setOnInsert: new Date()};
      this.unset();
    }
  },
  trust: {
    type: Number,
    label: 'Trust'
  }
})

Concept.attachSchema(ConceptsS)

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
          return 7;
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