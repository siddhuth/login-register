/**
 * Created by Siddhuth on 12/20/2016.
 */
var models = require('../models');

/**
 * gets a list of all the users
 * */
exports.getAllUsers = function (callback) {
    models.User.findAll().then(function (users) {
        if (users) {
            callback(users);
        } else {
            callback(null);
        }
    });
};