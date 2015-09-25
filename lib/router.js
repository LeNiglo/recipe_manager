Router.route('/', {
    template: "page",
    layoutTemplate: "layout"
});

Router.route('/(.*)', {
    onBeforeAction: function () {
        Router.go('/');
    }
});