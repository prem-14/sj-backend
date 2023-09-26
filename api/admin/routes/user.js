const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')

router.route('/getAllUsers').post(userCtrl.getAllUsers)
router.route('/getSingleUser').get(userCtrl.getSingleUser)
router.route('/addNewUser').post(userCtrl.addNewUser)
router.route('/updateUser').put(userCtrl.updateUser)
router.route('/changeUserStatus').patch(userCtrl.changeUserStatus)

module.exports = router
