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
        var savedId = $(e.target).data('id');
        Errors.remove({id: savedId});
    },
});