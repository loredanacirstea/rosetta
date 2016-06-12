export const name = 'subjectro';

subjectro.coll = {}
subjectro.coll.subject = new Mongo.Collection('subject')
subjectro.coll.relation = new Mongo.Collection('relation')
subjectro.coll.ontology = new Mongo.Collection('ontology')

subjectro.ss = {}
subjectro.ss.subject = new SimpleSchema({
  uuid: {
    type: String,
    label: "UUID"
  },
  lang: {
    type: String,
    label: 'Language'
  },
  subject: {
    type: String,
    label: 'Subject'
  },
  ontology: {
    type: String,
    label: 'Ontology UUID',
    autoValue: function() {
      if(this.value)
        return this.value
      if(ontouuid)
        return ontouuid
    }
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

      this.unset();  // Prevent user from supplying their own value
    }
  },
  extra: {
    type: Object,
    optional: true,
    blackbox: true
  }
})

subjectro.ss.relation = new SimpleSchema({
  uuid1: {
    type: String,
    label: "UUID1"
  },
  uuid2: {
    type: String,
    label: "UUID2"
  },
  relation: {
    type: Number,
    label: "Relation"
  },
  ordering: {
    type: Number,
    label: "Ordering",
    optional: true
  },
  ontology: {
    type: String,
    label: 'Ontology UUID',
    autoValue: function() {
      if(this.value)
        return this.value
      if(ontouuid)
        return ontouuid
    }
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

      this.unset();  // Prevent user from supplying their own value
    }
  }
})

subjectro.coll.subject.attachSchema(subjectro.ss.subject)
subjectro.coll.relation.attachSchema(subjectro.ss.relation)