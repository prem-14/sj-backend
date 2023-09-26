const User = require('../../../models/user')
const { jsonResponse } = require('../../../common/response')
const catchAsync = require('../../../common/catchAsync')
const { processResults, slugify } = require('../../../common/commonFunctions')
const mongoose = require('mongoose')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await processResults(req, User)
  jsonResponse(res, 200, 'success', {
    message: 'Users retrieved successfully.',
    responseData: users,
  })
})

exports.getSingleUser = catchAsync(async (req, res, next) => {
  const user = await User.findById({ _id: req.query.id })
  jsonResponse(res, 200, 'success', {
    message: 'Users retrieved successfully.',
    responseData: {
      record: user,
    },
  })
})

exports.addNewUser = catchAsync(async (req, res, next) => {
  await User.create(req.body)
  jsonResponse(res, 200, 'success', {
    message: `User created successfully.`,
  })
})

exports.updateUser = catchAsync(async (req, res, next) => {
  req.body.slug = slugify(req.body.name)
  await User.updateOne({ _id: req.body.id }, { $set: req.body })
  jsonResponse(res, 200, 'success', {
    message: `User updated successfully.`,
  })
})

exports.changeUserStatus = catchAsync(async (req, res, next) => {
  await User.updateMany({ _id: { $in: req.body.id } }, { $set: { subscribed: req.body.subscribed } })
  jsonResponse(res, 200, 'success', {
    message: `User status changed successfully.`,
  })
})
