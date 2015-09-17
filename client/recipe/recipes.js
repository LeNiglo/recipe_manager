Template.recipes.helpers({
    recipes: function () {
        return Recipe.find();
    }
});

Template.recipe.helpers({
    formatted: function (date) {
        return moment(date).format("dddd, MMMM Do YYYY, HH:mm:ss");
    },
    fromNow: function (date) {
        return moment(date).fromNow();
    }
})

Template.newRecipe.events({

    "submit #newRecipe": function (e) {
        e.preventDefault();

        if (!Meteor.userId()) {
            $('#login-dropdown-list').addClass('open');
            throwError("Please, Sign In or Join first", "danger", 7000);
            $('#login-username-or-email').focus();
            return false;
        }

        var $this = $(e.target);

        var obj = {};

        obj.title = $this.find('input[name="title"]').val();
        obj.private = $("#privateRecipe").is(":checked");
        obj.ingredients = [];

        $this.find('tr').each(function () {

            var tmp = {};

            tmp.name = $(this).find('input.new-ing').val();
            tmp.quantity = $(this).find('input.new-qty').val();

            if (tmp.name !== '' && tmp.quantity !== '') {
                obj.ingredients.push(tmp);
            }

        });

        if (!Recipe.insert(obj)) {
            throwError("Baking failed, please try again or reload this page", "warning");
        }

        $this.trigger('reset');

        return false;
    },

    "reset #newRecipe": function (e) {
        var $this = $(e.target);

        $this.find('tr').each(function () {

            if ($(this).next('tr').length !== 0) {
                $(this).remove();
            } else {
                $(this).find('input').val('');
            }

        });
    },

    "change .new-ing": function (e) {
        var $this = $(e.target);
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
                    '<input type="text" class="new-ing form-control" placeholder="Ingredient"/>' +
                    '</td><td>' +
                    '<input type="text" class="new-qty form-control" placeholder="Quantity"/>' +
                    '</td></tr>';

                $form.find('tbody').append(str);
            }

        }

    },


});