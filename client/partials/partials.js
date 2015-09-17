Template.page.events({

    "show.bs.collapse #newRecipeDiv": function () {
        $("html, body").animate({scrollTop: 0}, 250);
    },

    "shown.bs.collapse #newRecipeDiv": function () {
        $('#newRecipe').find('input[name="title"]').focus();
    },

});

Template.errors.helpers({
    errors: function () {
        return Errors.find();
    }
});

Template.error.events({
    "close.bs.alert .alert": function (e) {
        var savedId = $(e.currentTarget).data('id');
        Errors.remove({id: savedId});
    },
});

var lastKeyUp = null;
var timeoutKeyUp = null;
var getSearchReady = function () {
    var $this = $("#search");

    var newKeyUp = new Date();

    if (newKeyUp - lastKeyUp < 500) {
        clearTimeout(timeoutKeyUp);
    }

    timeoutKeyUp = Meteor.setTimeout(function () {
        Session.set('search', $this.val());
    }, 750);


    lastKeyUp = newKeyUp;
}

Template.search.events({
    "keyup #search": getSearchReady()
});

Template._loginButtonsAdditionalLoggedInDropdownActions.events({
    "click #onlyMyRecipes": function (e) {
        $('#search').val(Meteor.user().username);
        getSearchReady();
    }
})