Template.recipes.helpers({
    recipes: function () {
        if (Recipe.find().count() === 1) {
            $("html, body").animate({scrollTop: 300}, 250);
        }
        return Recipe.find({}, {sort: {createdAt: -1}});
    },
    moreRecipes: function () {
        return !(Recipe.find().count() < Session.get('itemsLimit'));
    }
});

Template.recipe.helpers({
    isMine: function (_id) {
        return (Meteor.userId() === _id);
    }
});

Template.recipe.events({
    "click .share-recipe": function (e) {
        e.preventDefault();

        var $this = $(e.currentTarget);
        $('#search').val($this.data('id'));
        getSearchReady();

    },

    "click .edit-recipe": function (e) {
        e.preventDefault();

        var $this = $(e.currentTarget);
        var recipe = Recipe.findOne({_id: $this.data('id')});

        var $form = $('#newRecipe').trigger('reset');
        $form.find('input[name="title"]').val(recipe.title);
        $form.find('textarea[name="resume"]').val(recipe.resume);
        $("#privateRecipe").attr('checked', recipe.private);

        recipe.ingredients.forEach(function (pair) {
            $form.find('tr').each(function () {
                var $inputIng = $(this).find('input.new-ing');
                var $inputQty = $(this).find('input.new-qty');

                if ($inputIng.val() === '') {
                    $inputIng.val(pair.name).trigger('change');
                    $inputQty.val(pair.quantity);
                    return false;
                }
            });
        });


        Meteor.setTimeout(function () {
            $('#collapse-newRecipe').myCollapse(true);
            $form.find('button[type="submit"]').myButton(recipe._id);
        }, 100);
    },

    "click .remove-recipe": function (e) {
        e.preventDefault();

        var $this = $(e.currentTarget);
        if (confirm(TAPi18n.__("confirm_remove"))) {

            Recipe.remove({_id: $this.data('id')}, function (err, res) {
                if (err || !res) {
                    return throwError(err.reason, "danger");
                }
            });

        } else {
            return false;
        }


    }
});

Template.newRecipe.events({

    "submit #newRecipe": function (e) {
        e.preventDefault();

        if (!Meteor.userId()) {
            $('#login-dropdown-list').addClass('open');
            throwError(TAPi18n.__("login_please"), "danger", 7000);
            $('#login-username-or-email').focus();
            return false;
        }

        var $this = $(e.currentTarget);
        var $submit = $this.find('button[type="submit"]');

        var obj = {};

        obj.title = $this.find('input[name="title"]').val();
        obj.resume = $this.find('textarea[name="resume"]').val();
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

        if (!$submit.hasClass('to-edit')) {

            if (!Recipe.insert(obj)) {
                return throwError(TAPi18n.__("insert_failed"), "warning");
            }

        } else {

            var idEdit = $submit.data('id-edit');
            Recipe.update({
                _id: idEdit
            }, {
                $set: obj
            }, function (err, res) {
                if (err || !res) {
                    return throwError(err.reason, "danger");
                }
            });

        }

        $this.trigger('reset');

        return false;
    },

    "reset #newRecipe": function (e) {
        var $this = $(e.currentTarget);

        // Fake Collapse plugin using Meteor's jQuery & bootstrap.js
        $('#collapse-newRecipe').myCollapse(false, 50);

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