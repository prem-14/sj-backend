const mongoose = require('mongoose')

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

packageSchema.virtual('id').get(function () {
  return this._id
})

const Package = mongoose.model('Package', packageSchema)

module.exports = Package
