var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
const util = require('util'); // -> tool to use console.log
// console.log(util.inspect(x, false, null))

var User = require('../models/user');
var Address = require('../models/address');
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
    var decoded = jwt.decode(req.query.token);
    Address.find({user:decoded.user._id})
        .populate('user')
        .exec(function (err, addresses) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    message: 'Couldn\'t get any address for this user',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                addresses: addresses
            });
        });
});

router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    //console.log(util.inspect(decoded, false, null))
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                message: 'Couldn\'t find the user',
                error: err
            });
        }
        var address = new Address({
            houseNumber: req.body.houseNumber,
            street: req.body.street,
            city: req.body.city,
            postcode:req.body.postcode,
            user: user
        });
        address.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Couldn\'t save the address',
                    message: 'Couldn\'t save the address',
                    error: err
                });
            }
            user.addresses.push(mongoose.Types.ObjectId(result._id));
            user.save();
            res.status(201).json({
                title: 'Address has been saved',
                //this part has been adjusted just to be able to use "errorHandler" service
                error: {message: 'Address has been saved successfully'},
                obj: result
            });
        });
    });
});

router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Address.findById(req.params.id, function (err, address) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!address) {
            return res.status(500).json({
                title: 'No Address Found!',
                error: {message: 'Address not found'}
            });
        }
        if (address.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        address.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            // remove this address id from referenced this user.addresses array
            User.findById(address.user, function(err, user){
                user.addresses.pull(mongoose.Types.ObjectId(address._id));
                user.save();
            });
            res.status(200).json({
                title: "Delete status",
                //this part has been adjusted just to be able to use "errorHandler" service
                error: {message: 'Address has been deleted'},
                obj: result
            });
        });
    });
});

module.exports = router;