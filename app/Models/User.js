var mongoose = require('mongoose');
var brcypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name:  { type: String, required: true },
    username:  { type: String, lowecase: true, unique: true, required: true },
    email: { type: String, lowecase: true, unique: true, required: true },
    password:   { type: String, required: true },
});

UserSchema.pre('save', function (next) {
    var user = this;
    brcypt.hash(user.password, null, null, function(err, hash){
        if (err) return next(err);
        else {
            user.password = hash;
            next();
        }
    })
});

UserSchema.methods.comparePassword = function(password){
    return brcypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', UserSchema);