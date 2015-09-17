Meteor.publish('allRecipes', function () {
    return Recipe.find({
        $or: [{
            private: false
        }, {
            owner: Meteor.userId
        }]
    });
});