var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
const util = require('util'); // -> tool to use console.log
// console.log(util.inspect(x, false, null))

var User = require('../models/user');

var appConfig = require('../app-config.json');

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, appConfig.secret, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                message: 'User is not authenticated',
                error: err
            });
        }
        next();
    })
});

router.get('/', function (req, res, next) {
    User.find({}, function (err, users){
        if (err){
            return res.status(500).json({
                title: 'An error occurred',
                message: 'Couldn\'t find any user',
                error: err
            })
        }
        res.status(200).json({
            message: "Success",
            users: users
        })
    })
            
});

router.patch('/', function(req, res, next){
    var decoded = jwt.decode(req.query.token);
    if (decoded.user.role === "staff"){
        User.findById(req.body._id, function(err, user){
            if (err){
                return res.json({
                    title: 'User is not found',
                    error: err
                });
            }
            if (user.email != req.body.email){
                return res.json({
                    title: 'User didn\'t match',
                    error: err
                })
            }
            var updateUser = {
                approved: req.body.approved
                };
            User.findByIdAndUpdate(req.body._id, updateUser, function(err, result) {
                if (err) {
                    return res.json({
                        title: 'User approving has failed',
                        error: {message:'Couldn\'t update the status', err}
                    });
                }
                res.json({
                    title: 'Success!',
                    //following part has been adjusted just to be able to use "errorHandler" service
                    error: {message:'User staus has been updated'}   
                    //obj: result
                });
            });
        })
    }else{
        return res.json({
            title: 'Authentication failed',
            error: {message: 'Sorry, only staff members are allowed to approve'}
        });
    }
});

module.exports = router;
