const express = require('express')
const router = express.Router()

const packageCtrl = require('../controllers/package')

router.route('/getAllPackages').post(packageCtrl.getAllPackages)
router.route('/getSinglePackage').get(packageCtrl.getSinglePackage)
router.route('/addNewPackage').post(packageCtrl.addNewPackage)
router.route('/updatePackage').put(packageCtrl.updatePackage)

module.exports = router
