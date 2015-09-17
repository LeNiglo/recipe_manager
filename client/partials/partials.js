Template.page.events({

    "show.bs.collapse #newRecipeDiv": function () {
        $("html, body").animate({scrollTop: 0}, 250);
    },

    "shown.bs.collapse #newRecipeDiv": function () {
        $('#newRecipe').find('input[name="title"]').focus();
    },

});

Template.header.events({

    "click header": function () {
        $('#search').val('');
        getSearchReady();
        return true;
    }

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


Template.search.events({
    "keyup #search": function () {
        getSearchReady();
    }
});

Template.search.helpers({
    getSearchFromUrl: function () {
        var param = Router.current().params.query.q;
        if (param) {
            Meteor.setTimeout(function () {
                getSearchReady();
            }, 5);
        }
        return param;
    },
    isTimeoutRunning: function () {
        return !!timeoutKeyUp.get();
    }
});

Template._loginButtonsAdditionalLoggedInDropdownActions.events({
    "click #onlyMyRecipes": function (e) {
        $('#search').val(Meteor.user().username);
        getSearchReady();
    }
});