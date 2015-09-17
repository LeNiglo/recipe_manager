Recipe = new Meteor.Collection('recipes');


Recipe.allow({
    insert: function (userId, doc) {
        return (userId && doc.owner === userId);
    },
    update: function (userId, doc, fields, modifier) {
        return doc.owner === userId;
    },
    remove: function (userId, doc) {
        return doc.owner === userId;
    },
    fetch: ['owner']
});

Recipe.before.insert(function (userId, it) {

    if (!userId) {
        return false;
    }

    if (it.title === '') {
        return false;
    }

    it.owner = it.owner == userId ? it.owner : userId;
    it.username = Meteor.users.findOne(userId).username;

    var d = new Date();
    it.createdAt = it.createdAt || d;
    it.updatedAt = d;
    return true;
});

Recipe.before.update(function (userId, it) {
    var d = new Date();
    it.updatedAt = d;
    return true;
});

Recipe.before.remove(function (userId, it) {
    return userId == it.owner;
});
