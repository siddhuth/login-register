/**
 * Created by Siddhuth on 12/20/2016.
 */
var models = require('../models');
'use strict';

/* login validation methods */
exports.autoLogin = function (username, pass, callback) {
    console.log('DEBUG: account-manager: auto login');
    //debug('account-manager: auto login');
    models.User.find({where: {username: username}}).then(function (user) {
        if (user) {
            user.password == pass ? callback(user) : callback(null);
        } else {
            callback(null);
        }
    });
};

exports.manualLogin = function (username, pass, callback) {
    models.User.find({where: {username: username}}).then(function (user) {
        if (user == null) {
            callback('user-not-found');
        } else {
            if (user.password == pass) {
                callback(null, user);
            } else {
                callback('invalid-password');
            }
        }
    });
};

exports.addNewAccount = function (newData, callback) {
    //find a user that has an email or username that is equal to the attempted signup
    models.User.find({
            where: {
                $or: [
                    {username: newData.username},
                    {email: newData.email}
                ]
            }
        }
    ).then(function (user) {
        if (user) {
            if (user.username.toLocaleLowerCase() == newData.username.toLocaleLowerCase()) {
                callback('username-taken');
            } else if (user.email.toLocaleLowerCase() == newData.email.toLocaleLowerCase()) {
                callback('email-taken');
            }

        } else {
            models.User.create({
                username: newData.username,
                password: newData.password,
                first: newData.first,
                last: newData.last,
                email: newData.email,
                phone: newData.phone
            }).then(callback(null));
        }
    });
};
