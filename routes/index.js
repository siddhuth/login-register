var AM = require('../modules/account-manager');
var DM = require('../modules/data-manager');

module.exports = function (app) {

    function isLoggedIn(req, res, next) {
        if (req.cookies.username == undefined || req.cookies.password == undefined) {
            //redirect to login page
            res.redirect('/');
        } else {
            // attempt automatic login //
            AM.autoLogin(req.cookies.username, req.cookies.password, function (user) {
                if (user != null) {
                    req.session.user = user;
                }
                //console.log('DEBUG: isLoggedIn: true');
                //go to the next function
                return next();
            });
        }
    }

    app.get('/', function (req, res) {
        if (req.cookies.username == undefined || req.cookies.password == undefined) {
            res.render('login', {title: 'Hello - Please Login To Your Account'});
        } else {
            // attempt automatic login //
            AM.autoLogin(req.cookies.username, req.cookies.password, function (user) {
                if (user != null) {
                    req.session.user = user;
                    res.redirect('/home');
                } else {
                    res.render('login', {title: 'Hello - Please Login To Your Account'});
                }
            });
        }
    });

    app.post('/', function (req, res) {
        AM.manualLogin(req.body['user'], req.body['pass'], function (err, user) {
            if (!user) {
                res.status(400).send(err);
            } else {

                res.cookie('username', user.username, {maxAge: 900000});
                res.cookie('password', user.password, {maxAge: 900000});

                res.status(200).send(user);
            }
        });
    });


    app.get('/home', isLoggedIn, function (req, res) {
        var user = req.session.user;

        DM.getAllUsers(function (users) {
            res.render('home', {
                title: 'Home',
                user: user,
                users: users
            });
        })

    });

    /**
     * update the user's profile route
     * */
    app.put('/profile', isLoggedIn, function (req, res) {
        var user = req.session.user;
        var newData = {
            id: user.id,
            first: req.body['first'],
            last: req.body['last'],
            email: req.body['email'],
            phone: req.body['phone']
        };

        AM.updateAccount(newData, function (err, user) {
            if (user) {
                res.status(200).send(user);
            } else {
                res.status(400).send(null);
            }
        });
    });

    app.post('/logout', function (req, res) {
        console.log('DEBUG: user logged out');
        res.clearCookie('username');
        res.clearCookie('password');
        req.session.destroy(function (err) {
            res.status(200).send('ok');
        });
    });

    app.get('/signup', function (req, res) {
        res.render('signup', {title: 'Signup'});
    });

    app.post('/signup', function (req, res) {
        AM.addNewAccount({
            first: req.body['first'],
            last: req.body['last'],
            email: req.body['email'],
            phone: req.body['phone'],
            username: req.body['username'],
            password: req.body['password']
        }, function (err) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send('ok');
            }
        });
    });

    app.get('*', function (req, res) {
        res.render('404', {title: 'Page Not Found'});
    });

};