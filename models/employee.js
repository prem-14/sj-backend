const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please tell us your first name!']
    },
    last_name: {
        type: String,
        required: [true, 'Please tell us your last name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
    },
    password: {
        type: String,
        minlength: 8,
        select: false,
        default: crypto.randomBytes(4).toString('hex')
    },
    permissions: {
        type: Array,
    },
    type: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin'
    },
    active: {
        type: Boolean,
        default: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password') && !this.isNew) return next();
    this.unHashedPassword = this.password
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000;

    next();
});

employeeSchema.methods.correctPassword = async function (
    candidatePassword,
    employeePassword
) {
    return await bcrypt.compare(candidatePassword, employeePassword);
};

employeeSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
