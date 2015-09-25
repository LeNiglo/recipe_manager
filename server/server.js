Meteor.methods({
    "changeLocale": function (locale) {
        Meteor.users.update(
            {_id: Meteor.userId()},
            {$set: {"profile.locale": locale}}
        );
    }
});

Accounts.onCreateUser(function (options, user) {
    console.log(user);

    user.profile = {};

    // we wait for Meteor to create the user before sending an email
    Meteor.setTimeout(function () {
        Accounts.sendVerificationEmail(user._id);
    }, 2000);

    return user;
});

Accounts.validateLoginAttempt(function (attempt) {
    if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified) {
        return false;
    }
    return true;
});