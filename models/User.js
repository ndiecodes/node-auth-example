const mongoose = require('mongoose')
const Schema  = mongoose.Schema;
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')

//get secret from enviromental variable. Reference: .env file
const jwtSecret = process.env.JWT_SECRET

//define your user schema
let userSchema = Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String
})

// hash passwords for new records before saving
userSchema.pre('save', function(next) {
    if(this.isNew) {
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(this.password, salt)
        console.log(hash)
        this.password = hash
    }
    next();
});

//validate user password
userSchema.methods.validPassword = function(inputedPassword) {
   return bcrypt.compareSync(inputedPassword, this.password)
}

//sign token for this user
userSchema.methods.getJWT = function() {
    return JWT.sign({ userId: this._id }, jwtSecret)
}
module.exports = mongoose.model('User', userSchema)

