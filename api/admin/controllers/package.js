const Package = require('../../../models/package')
const { jsonResponse } = require('../../../common/response')
const catchAsync = require('../../../common/catchAsync')
const { processResults, slugify } = require('../../../common/commonFunctions')
const mongoose = require('mongoose')

exports.getAllPackages = catchAsync(async (req, res, next) => {
  const packages = await processResults(req, Package)
  jsonResponse(res, 200, 'success', {
    message: 'Packages retrieved successfully.',
    responseData: packages,
  })
})

exports.getSinglePackage = catchAsync(async (req, res, next) => {
  const package = await Package.findById({ _id: req.query.id })
  jsonResponse(res, 200, 'success', {
    message: 'Packages retrieved successfully.',
    responseData: {
      record: package,
    },
  })
})

exports.addNewPackage = catchAsync(async (req, res, next) => {
  await Package.create(req.body)
  jsonResponse(res, 200, 'success', {
    message: `Package created successfully.`,
  })
})

exports.updatePackage = catchAsync(async (req, res, next) => {
  req.body.slug = slugify(req.body.name)
  await Package.updateOne({ _id: req.body.id }, { $set: req.body })
  jsonResponse(res, 200, 'success', {
    message: `Package updated successfully.`,
  })
})

// exports.changePackageStatus = catchAsync(async (req, res, next) => {
//   await Package.updateMany({ _id: { $in: req.body.id } }, { $set: { subscribed: req.body.subscribed } })
//   jsonResponse(res, 200, 'success', {
//     message: `Package status changed successfully.`,
//   })
// })
