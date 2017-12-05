const util = require('util'); // -> tool to use console.log
// console.log(util.inspect(x, false, null))

const expect = require('expect');
const request = require('supertest');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var appConfig = require('../app-config.json');
const app = require('../app');
const userRoutes = require('../routes/user.js');

var User = require('../models/user');

const {spyUsers, spyUsersToken, populateSpyUsers, stubUsers, stubUsersToken} = require('./doubles/doubles');

mongoose.connect(appConfig.testConnectionString, { useMongoClient: true });
mongoose.Promise = global.Promise;

beforeEach(populateSpyUsers);

describe('Testing Registration functionality', () => {

    it('should create a user', (done) => {  
      request(app)
        .post('/as/api/user/register')
        .send(stubUsers[0])
        .expect(200)
        .expect((res) => {
          expect(res.body.obj._id).toExist();
          expect(res.body.obj.email).toBe(stubUsers[0].email);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

           User.findOne({email: stubUsers[0].email}).then((user) => {
            expect(user).toExist();
            expect(user.email).toBe(stubUsers[0].email);
            done();
           });
        });
    });

    it('should not create user if email already exists', (done) => {
      request(app)
        .post('/as/api/user/register')
        .send(spyUsers[0])
        .expect(400)
        .end(done);
    });

});

describe('Testing Login functionality', () => {  
  it('should not log in if the user doesn\'t exist' , (done) => {
    request(app)
      .post('/as/api/user/login')
      .send({
        email:stubUsers[1].email,
        password: stubUsers[1].password
      })
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      })
  });

  it('should not log in if the user exists but password doesn\'t match' , (done) => {
    request(app)
      .post('/as/api/user/login')
      .send({
        email: spyUsers[0].email,
        password: "iAmWrongPass"
      })
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      })
  });

  it('should log in only if the user exists & password matches' , (done) => {
    request(app)
      .post('/as/api/user/login')
      .send({
        email: spyUsers[1].email,
        password: 'spyUserTwoPass',
      })
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      })
  });

  it('should return token if user successfully logs in' , (done) => {
    request(app)
      .post('/as/api/user/login')
      .send({
        email: spyUsers[0].email,
        password: 'spyUserOnePass',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.token).toExist();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      })
  });
});

describe('Testing User-Profile functionality', () => {
  it('should get all the user details', (done) => {
    request(app)
      .get('/as/api/user/user-profile')
      .query({token: spyUsersToken[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.user).toExist();
        expect(res.body.user._id).toBe(spyUsers[0]._id);
        expect(res.body.user.email).toBe(spyUsers[0].email);
        expect(res.body.user.firstName).toBe(spyUsers[0].firstName);
        expect(res.body.user.lastName).toBe(spyUsers[0].lastName);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      })
  });

  it('should reject if user doesn\'t exist', (done) => {
    request(app)
      .patch('/as/api/user/user-profile')
      .query({token: stubUsersToken[1].token})
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should reject if the passwords don\'t match', (done) => {
    request(app)
      .patch('/as/api/user/user-profile')
      .query({token: spyUsersToken[1].token})
      .send({
        email: spyUsers[1].email,
        password: 'IamWrongPass'
      })
      .expect((res) => {
        expect(res.body).toExist();
        expect(res.body.title).toBe('Authentication failed');
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should update user\'s Firstname and Lastname', (done) => {
    request(app)
      .patch('/as/api/user/user-profile')
      .query({token: spyUsersToken[1].token})
      .send({
        firstName: 'A new name',
        lastName: 'A new surname',
        email: spyUsers[1].email,
        password: 'spyUserTwoPass'
      })
      .expect((res) => {
        expect(res.body).toExist();
        expect(res.body.title).toBe('Success!');
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});