const catchAsync = require("../common/catchAsync")
const AppError = require("../middleware/error")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

exports.userAuth = catchAsync(async (req, res, next) => {
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

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user does no longer exist.', 401));
    } else {
        if (currentUser.status === "deactivated") {
            return next(new AppError('Your account has been deactivated', 401));
        } else if (currentUser.status === "not_verified") {
            return next(new AppError('Your account has not been verified', 401));
        }
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    req.user = currentUser;
    next();
});