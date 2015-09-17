Accounts.ui.config({
    requestPermissions: {},
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Session.setDefault("recipes_increment", 5);
Session.setDefault("search", '');

Session.setDefault("itemsLimit", Session.get("recipes_increment"));

Deps.autorun(function () {
    Meteor.subscribe("allRecipes", Session.get("itemsLimit"), Session.get("search"));
});


var lastKeyUp = null;
timeoutKeyUp = new ReactiveVar(null);
getSearchReady = function () {
    var $this = $("#search");

    var value = $this.val();

    if (value !== '')
        Router.go(Router.current().route.path({}, {query: "q=" + value}));
    else
        Router.go(Router.current().route.path({}, {}));

    var newKeyUp = new Date();

    if (newKeyUp - lastKeyUp < 500) {
        clearTimeout(timeoutKeyUp.get());
        timeoutKeyUp.set(null);
    }

    timeoutKeyUp.set(Meteor.setTimeout(function () {
        Session.set('search', value);
        timeoutKeyUp.set(null);
    }, 750));


    lastKeyUp = newKeyUp;
};

Errors = new Meteor.Collection(null);

errorId = 0;

throwError = function (message, level, timeout) {

    var savedId = ++errorId;

    Errors.insert({
        id: savedId,
        message: message,
        level: level
    });

    if (timeout) {
        Meteor.setTimeout(function () {
            $('.alert[data-id="' + savedId + '"]').fadeOut(200, function () {
                $(this).remove();
                Errors.remove({id: savedId});
            });
        }, timeout);
    }

    return false;

};

showMoreVisible = function () {
    var threshold, target = $("#showMoreRecipes");
    if (!target.length) return;

    threshold = $(window).scrollTop() + $(window).height() - target.height();

    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
            target.data("visible", true);
            Session.set("itemsLimit", Session.get("itemsLimit") + Session.get("recipes_increment"));
        }
    } else {
        if (target.data("visible")) {
            target.data("visible", false);
        }
    }

};

$(document).ready(function () {

    $(window).scroll(showMoreVisible);

});