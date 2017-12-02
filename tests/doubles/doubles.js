const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var appConfig = require('../../app-config.json');
//const Address = require('../../models/address');
const User = require('../../models/user');

const spyUserOneId = String(new ObjectID());
const spyUserTwoId = String(new ObjectID());

const spyUsers = [{
    _id: spyUserOneId,
    firstName:'spyUserOne',
    lastName:'spyUserOne',
    password: bcrypt.hashSync('spyUserOnePass', 10),
    email: 'spyUserOne@test.uk',
    role: 'customer',
    approved: true
}, {
    _id: spyUserTwoId,
    firstName:'spyUserTwo',
    lastName:'spyUserTwo',
    password: bcrypt.hashSync('spyUserTwoPass', 10),
    email: 'spyUserTwo@test.uk',
    role: 'customer',
    approved: false
}];

const spyUsersToken = [{
    token : jwt.sign({user: spyUsers[0]}, appConfig.secret, {expiresIn: 7200})
    }, {
    token : jwt.sign({user: spyUsers[1]}, appConfig.secret, {expiresIn: 7200})
    }
];


const stubUserOneId = String(new ObjectID());
const stubUserTwoId = String(new ObjectID());

const stubUsers = [{
    _id: stubUserOneId,
    firstName:'stubUserOne',
    lastName:'stubUserOne',
    password: bcrypt.hashSync('stubUserOnePass', 10),
    email: 'stubUserOne@test.uk',
    role: 'customer',
    approved: true
}, {
    _id: stubUserTwoId,
    firstName:'stubUserTwo',
    lastName:'stubUserTwo',
    password: bcrypt.hashSync('stubUserTwoPass', 10),
    email: 'stubUserTwo@test.uk',
    role: 'customer',
    approved: false
}];

const stubUsersToken = [{
    token : jwt.sign({user: stubUsers[0]}, appConfig.secret, {expiresIn: 7200})
}, {
    token : jwt.sign({user: stubUsers[1]}, appConfig.secret, {expiresIn: 7200})
}
];

const populateSpyUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(spyUsers[0]).save();
    var userTwo = new User(spyUsers[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = { spyUsers, spyUsersToken , populateSpyUsers, stubUsers, stubUsersToken};
