Meteor.startup(function () {
    Accounts.emailTemplates.from = 'Lefrant Guillaume <lefrantguillaume@gmail.com>';

    Accounts.emailTemplates.siteName = 'Recipe Manager';

    // A Function that takes a user object and returns a String for the subject line of the email.
    Accounts.emailTemplates.verifyEmail.subject = function (user) {
        return 'Confirm Your Email Address';
    };

    // A Function that takes a user object and a url, and returns the body text for the email.
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
    Accounts.emailTemplates.verifyEmail.text = function (user, url) {
        return 'Click on the following link to verify your email address: ' + url;
    };

});
