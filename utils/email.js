const dotenv = require('dotenv')
const SibApiV3Sdk = require('sib-api-v3-sdk')
const nodemailer = require('nodemailer')

dotenv.config({ path: './.env' })

exports.sendEmail = async (subject, toEmail, template, ccEmail = '') => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test@test.com',
      pass: 'lakkeiaaaqdddvhk',
    },
  })

  var mailOptions = {
    from: `SJ test <test@gmail.com>`,
    to: toEmail,
    subject: subject,
    html: template,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email Sent: ' + info.response)
    }
  })
}
