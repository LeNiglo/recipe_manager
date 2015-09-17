Accounts.ui.config({
    requestPermissions: {},
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Meteor.subscribe('allRecipes');

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