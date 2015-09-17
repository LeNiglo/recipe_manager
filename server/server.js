Meteor.methods({
    "changeLocale": function (locale) {
        Meteor.users.update(
            {_id: Meteor.userId()},
            {$set: {"profile.locale": locale}}
        );
    }
})