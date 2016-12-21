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


exports.updateAccount = function (newData, callback) {
    models.User.find({
        where: {
            id: newData.id
        }
    }).then(function (user) {
        user.first = newData.first;
        user.last = newData.last;
        user.phone = newData.phone;

        if (user.email != newData.email) {
            models.User.find({where: {email: newData.email}}).then(function (userWithEmail) {
                if (userWithEmail) {
                    //there's already a user with that email... send an error
                } else {
                    //there isn't a user with that email, update the email
                    user.email = newData.email;
                    user.save().then(function (updatedUser) {
                        if (updatedUser) {
                            callback(null, updatedUser)
                        } else {
                            callback('error-updating-user', null);
                        }
                    });
                }
            });
        } else {
            user.save().then(function (updatedUser) {
                if (updatedUser) {
                    callback(null, updatedUser)
                } else {
                    callback('error-updating-user', null);
                }
            });
        }

    });
};

exports.deleteUser = function (userId, callback) {
    models.User.find({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            user.destroy().then(callback);
        } else {
            callback(null);
        }
    });
}