FlowRouter.route('/', {
  triggersEnter: [function(context, redirect) {
    redirect('/babel');
  }]
})

FlowRouter.route('/babel', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "browseConcepts", bottom:"menuBar"});
    }
});

FlowRouter.route('/babel/:uuid', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "babelConcept", bottom:"menuBar"});
    }
});

FlowRouter.route('/search', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "searchFormula", bottom:"menuBar"});
    }
});

FlowRouter.route('/settings', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "settings", bottom:"menuBar"});
    }
});

FlowRouter.route('/info', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "info", bottom:"menuBar"});
    }
});

FlowRouter.route('/admin/users', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout1', { top: "titleBar", main: "adminUsers", bottom:"menuBar"});
    }
});

