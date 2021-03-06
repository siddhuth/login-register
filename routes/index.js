var AM = require('../modules/account-manager');
var DM = require('../modules/data-manager');
var EM = require('../modules/email-dispatch');

var path = require('path'),
    fs = require('fs');

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

    var multer = require('multer');
    var upload = multer({dest: '../images/'});

    // File input field name is simply 'file'
    app.post('/upload/:username', upload.single('file'), function (req, res) {
        //gets and saves the user's username as the file name
        var username = req.params.username;
        var uploadedFile = req.file;

        if (!uploadedFile) {
            res.status(400).send('Please select a file');
            return;
        }

        if (!username) {
            res.status(400).send('internal error');
            return;
        }

        var extension = uploadedFile.mimetype;
        console.log(extension);

        if (!extension) {
            res.status(400).send('invalid image type');
            console.log('not a png');
            return;
        }
        uploadedFile.filename = username + '.png';

        var file = __dirname + '/../images/' + uploadedFile.filename;
        fs.rename(uploadedFile.path, file, function (err) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.redirect('/home');
            }
        });
    });

    app.get('/profileImage', function (req, res) {
        var imageName = req.session.user.username + '.png';
        var filepath = __dirname + '/../images/' + imageName;
        console.log(filepath);
        res.sendfile(path.resolve(filepath));
    });

    app.delete('/user', function (req, res) {
        var user = req.session.user;
        AM.deleteUser(user.id, function (user) {
            if (user) {
                res.clearCookie('username');
                res.clearCookie('password');
                req.session.destroy(function (err) {
                    res.status(200).send('ok');
                });
                //res.status(200).send();
            } else {
                res.status(400).send('Error deleting user');
            }
        })

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

    app.post('/lost-password', function (req, res) {
        // look up the user's account via their email //
        AM.getAccountByEmail(req.body['email'], function (o) {
            if (o) {
                EM.dispatchResetPasswordLink(o, function (e, m) {
                    // this callback takes a moment to return //
                    // TODO add an ajax loader to give user feedback //
                    if (!e) {
                        res.status(200).send('ok');
                    } else {
                        for (var k in e) console.log('ERROR : ', k, e[k]);
                        res.status(400).send('unable to dispatch password reset');
                    }
                });
            } else {
                res.status(400).send('email-not-found');
            }
        });
    });

    app.post('/reset-password', function (req, res) {
        var nPass = req.body['pass'];
        // retrieve the user's email from the session to lookup their account and reset password //
        var email = req.session.reset.email;
        // destory the session immediately after retrieving the stored email //
        req.session.destroy();
        AM.updatePassword(email, nPass, function (e, o) {
            if (o) {
                res.status(200).send('ok');
            } else {
                res.status(400).send('unable to update password');
            }
        })
    });

};