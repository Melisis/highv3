const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Email is invalid',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    firstname: {
        type: String,
        maxLength: [100, 'Firstname cannot exceed 100 characters'],
        trim: true,
        default: '',
    },
    lastname: {
        type: String,
        maxLength: [100, 'Lastname cannot exceed 100 characters'],
        trim: true,
        default: '',
    },
    cart: {
        type: Array,
        default: [],
    },
    history: {
        type: Array,
        default: [],
    },
    verified: {
        type: Boolean,
        default: false,
    },
});

// Şifreyi kaydetmeden önce hashleme
userSchema.pre('save', async function (next) {
    let user = this;

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    next();
});

// Token üretimi
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const payload = { sub: user._id.toHexString() };
    return jwt.sign(payload, process.env.DB_SECRET, { expiresIn: '1d' });
};

// Benzersiz email kontrolü
userSchema.statics.emailTaken = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
};


// Şifre karşılaştırma
userSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;
    const match = await bcrypt.compare(candidatePassword, user.password);
    return match;
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
