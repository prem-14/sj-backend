const catchAsync = require("../common/catchAsync")
const AppError = require("../middleware/error")
const Employee = require("../models/employee")
const jwt = require("jsonwebtoken")

exports.adminAuth = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentAdmin = await Employee.findOne({ _id: decoded.id, active: true });
    if (!currentAdmin) {
        return next(
            new AppError(
                'The admin account no longer exist or it is not activated',
                401
            )
        );
    }

    req.admin = currentAdmin;
    next();
});