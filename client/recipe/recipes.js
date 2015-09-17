Template.recipes.helpers({
    recipes: function () {
        return Recipe.find({}, {sort: {createdAt: -1}});
    },
    moreRecipes: function () {
        return !(Recipe.find().count() < Session.get('itemsLimit'));
    }
});

Template.recipe.events({
    "click .share-recipe": function (e) {
        e.preventDefault();

        var $this = $(e.currentTarget);
        $('#search').val($this.data('id'));
        getSearchReady();

    }
});

Template.newRecipe.events({

    "submit #newRecipe": function (e) {
        e.preventDefault();

        if (!Meteor.userId()) {
            $('#login-dropdown-list').addClass('open');
            throwError(TAPi18n._("login_please"), "danger", 7000);
            $('#login-username-or-email').focus();
            return false;
        }

        var $this = $(e.currentTarget);

        var obj = {};

        obj.title = $this.find('input[name="title"]').val();
        obj.private = $("#privateRecipe").is(":checked");
        obj.ingredients = [];

        $this.find('tr').each(function () {

            var tmp = {};

            tmp.name = $(this).find('input.new-ing').val();
            tmp.quantity = $(this).find('input.new-qty').val();

            if (tmp.name !== '') {
                obj.ingredients.push(tmp);
            }

        });

        console.log(obj);
        if (!Recipe.insert(obj)) {
            throwError(TAPi18n._("insert_failed"), "warning");
        }

        $this.trigger('reset');

        return false;
    },

    "reset #newRecipe": function (e) {
        var $this = $(e.currentTarget);

        $this.find('tr').each(function () {

            if ($(this).next('tr').length !== 0) {
                $(this).remove();
            } else {
                $(this).find('input').val('');
            }

        });
    },

    "change .new-ing": function (e) {
        var $this = $(e.currentTarget);
        var $form = $('#newRecipe');

        if ($this.val() === '') {
            var isRemovable = false;
            var $item = null;

            var $tmp = $this.closest('tr');
            while (isRemovable === false) {
                $tmp = $tmp.next('tr');

                if ($tmp.length === 0) {
                    isRemovable = true;
                    return false;
                }

                if ($tmp.find('input').filter(function () {
                        return this.value.length === 0;
                    }).length === 2) {
                    $item = $tmp;
                    isRemovable = true;
                }

            }
            if ($item !== null)
                $item.remove();
        } else {
            var $tmp = $form.find('tr').last();

            if ($tmp.find('input').filter(function () {
                    return this.value.length === 0;
                }).length === 2) {
                return false;
            } else {
                var str = '<tr><td>' +
                    '<input type="text" class="new-ing form-control" placeholder="' + TAPi18n.__("ingredient") + '"/>' +
                    '</td><td>' +
                    '<input type="text" class="new-qty form-control" placeholder="' + TAPi18n.__("quantity") + '"/>' +
                    '</td></tr>';

                $form.find('tbody').append(str);
            }

        }

    },


});