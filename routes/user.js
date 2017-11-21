var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

var appConfig = require('../app-config.json');

router.post('/register', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        role: req.body.role,
        approved: req.body.approved
    });
    user.save(function(err, result) {
        if (err) {
            return res.status(400).json({   //to hide error in the console use "res.json({})" instead of "res.status().json({})"
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    });
});

router.post('/login', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'User does not exist, please register'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        var claimToken = {_id: user._id, email: user.email, role: user.role, approved: user.approved};
        var token = jwt.sign({user: claimToken}, appConfig.secret, {expiresIn: 7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token
            // userId: user._id,
            // userRole: user.role
        });
    });
});

router.get('/user-profile', function(req, res, next){
    var decoded =jwt.decode(req.query.token);
    User.findById(decoded.user._id, function (err, user){
        if (err) {
            return res.json({
                title: 'User is not found',
                error: err
            });
        }
        res.json({
            message: 'User is found',
            user: user
        });
    })
});

router.patch('/user-profile', function(req, res, next){
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function(err, user){
        if (err){
            return res.json({
                title: 'User is not found',
                error: err
            });
        }
        if (user.email != decoded.user.email){
            return res.json({
                title: 'User didn\'t match',
                error: err
            })
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.json({
                title: 'Authentication failed',
                error: {message: 'Sorry, password didn\'t match, try again'}
            });
        }
        var updateUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName
            };
        User.findByIdAndUpdate(decoded.user._id, updateUser, function(err, result) {
            if (err) {
                return res.json({
                    title: 'User-profile update failed',
                    error: err
                });
            }
            res.json({
                title: 'Success!',
                 //following part has been adjusted just to be able to use "errorHandler" service
                error: {message:'User profile has been updated'}   
                //obj: result
            });
        });
    })
});

module.exports = router;
