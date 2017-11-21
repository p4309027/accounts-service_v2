var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// tool to use console.log
const util = require('util'); 
// console.log(util.inspect(x, false, null))

var User = require('./user');

var schema = new Schema({
    houseNumber: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    postcode:{type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

// this logic has been moved into routes/address -> delete address by id 
// schema.post('remove', function(address){
//     User.findById(address.user, function(err, user){
//         user.addresses.pull(address);
//         user.save();
//     })
// })

module.exports = mongoose.model('Address', schema);