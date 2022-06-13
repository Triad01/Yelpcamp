const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: 'String',
        required: true,
        unique: true
    }
})


//would add a field for both username and password and ensure that usernames are unique and also gives us some additional methods we can use
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)

