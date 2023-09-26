const Employee = require('../../../models/employee')
// const Template = require("../../../models/template")
const { jsonResponse } = require('../../../common/response')
const catchAsync = require('../../../common/catchAsync')
const AppError = require('../../../middleware/error')
const jwt = require('jsonwebtoken')
const { getIstDateTime } = require('../../../common/commonFunctions')

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400))
  }
  const employee = await Employee.findOne({ email }).select('+password')

  // if (!employee || !(await employee.correctPassword(password, employee.password))) {
  //     return next(new AppError('Incorrect email or password', 401));
  // }

  const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  employee.lastLogin = getIstDateTime()
  await employee.save({ validateBeforeSave: false })

  employee.password = undefined

  jsonResponse(res, 200, 'success', {
    message: 'Login successful',
    token,
    employee,
  })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.admin.id).select('+password')

  if (!(await employee.correctPassword(req.body.current_password, employee.password))) {
    return next(new AppError('Your current password is wrong.', 401))
  }

  employee.password = req.body.new_password
  await employee.save()

  jsonResponse(res, 200, 'success', {
    message: 'Password updated successful',
  })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const employee = await Employee.findOne({ email: req.body.email })
  if (!employee) {
    return next(new AppError('There is no employee with email address.', 404))
  }

  const resetToken = employee.createPasswordResetToken()
  await employee.save({ validateBeforeSave: false })

  try {
    // const forgotPasswordMail = await Template.findOne({ title: 'employee_forgot_password' })
    if (forgotPasswordMail) {
      let { subject, template } = forgotPasswordMail

      template = template.replace(/{{employeename}}/g, employee.name)
      template = template.replace(/{{reseturl}}/g, `${process.env.ADMIN_URL}/resetPassword/${resetToken}`)

      email.sendEmail(subject, employee.email, template)
    }
    jsonResponse(res, 200, 'success', {
      message: 'Mail sent successfully',
    })
  } catch (err) {
    employee.passwordResetToken = undefined
    employee.passwordResetExpires = undefined
    await employee.save({ validateBeforeSave: false })

    return next(new AppError('There was an error sending the email. Try again later!'), 500)
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex')

  const employee = await Employee.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!employee) {
    return next(new AppError('Token is invalid or has expired', 400))
  }
  employee.password = req.body.password
  employee.passwordResetToken = undefined
  employee.passwordResetExpires = undefined
  await employee.save()

  const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  jsonResponse(res, 200, 'success', {
    message: 'Password resetted successful',
    token,
  })
})

exports.validateAdmin = catchAsync(async (req, res, next) => {
  await Employee.updateOne({ _id: req.admin._id }, { $set: { lastLogin: getIstDateTime() } })

  jsonResponse(res, 200, 'success', {
    message: 'Admin validated successful',
    employee: req.admin,
  })
})
