Template.searchFormula.onCreated(function() {
  this.result = new ReactiveVar([])
  this.letters = new ReactiveVar('')
  var url = serverUrl + '/api/subject/search?'

  var self = this
  this.autorun(function() {
    var text = self.letters.get()
    var lang = sysLang.get()
    if(lang && text && text.length > 2)
      $.getJSON(url + 'limit=' + maxFormCount*2 + '&lang=' + lang + '&text=' + text, function(data){
        self.result.set(data)
      })
    else
      self.result.set([])
  })
})

Template.searchFormula.helpers({
  result: function() {
    return Template.instance().result.get()
  }
})

Template.searchFormula.events({
  'keyup .searchFormula': function(e, templ) {
    var t = templ.$(e.currentTarget)
    templ.letters.set(t.val())
  }
})