const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'Please tell us your firstname!'],
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
    },

    subscribed: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.virtual('id').get(function () {
  return this._id
})

const User = mongoose.model('User', userSchema)

module.exports = User
