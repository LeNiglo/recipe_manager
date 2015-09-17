Meteor.publish('allRecipes', function (limit, search) {
    var myRegExp = new RegExp(".*", "i");

    if (search && search !== '')
        myRegExp = new RegExp(".*" + search + ".*", "i");

    return Recipe.find({
        $and: [{

            $or: [
                {private: false},
                {owner: this.userId}
            ]

        }, {

            $or: [
                {_id: search},
                {title: {$regex: myRegExp}},
                {username: {$regex: myRegExp}},
                {'ingredients.name': {$regex: myRegExp}},
            ]

        }]
    }, {sort: {createdAt: -1}, limit: limit});

});