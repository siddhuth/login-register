/**
 * Created by Siddhuth on 12/20/2016.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {

            }
        },
        // add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,

        // define the table's name
        tableName: 'User'
    }, {
        dialect: 'mysql'
    });

    return User;
};