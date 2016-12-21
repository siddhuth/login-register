/**
 * Created by Siddhuth on 12/21/2016.
 */
var EM = {};
module.exports = EM;

var email = require('emailjs');
var server = email.server.connect({
    host: 'smtp.mail.yahoo.com',
    user: 'siddhuth@yahoo.com',
    password: 'siddhu12',
        ssl: true
    });

EM.dispatchResetPasswordLink = function (account, callback) {
    server.send({
        from: '<siddhuth@yahoo.com>',
        to: account.email,
        subject: 'Password Reset',
        text: 'reset your password',
        attachment: EM.composeEmail(account)
    }, callback);
};

EM.composeEmail = function (user) {
    var link = 'localhost:3000/reset-password?e=' + user.email + '&p=' + user.pass;
    var html = "<html><body>";
    html += "Hi " + user.first + ",<br><br>";
    html += "Your username is <b>" + user.username + "</b><br><br>";
    html += "\<a href=\'" + link + "\'\>Click here to reset your password\<\/a\>\<br\>\<br\>";
    html += "Cheers,<br>";
    html += "</body></html>";
    return [{data: html, alternative: true}];
};