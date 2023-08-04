
const userRouter = require("express").Router();
const user = require('../controllers/user');
//const auth = require("../auth/auth");

userRouter.get('/auth-check',user.verifyToken);
userRouter.post('/signup',user.signup);
userRouter.get('/signup',user.signupGet);
userRouter.post('/otp-verification',user.verifyOtp);
userRouter.post('/user-data',user.userData);
userRouter.get('/user-data',user.userDataGet);
userRouter.post('/updated-data',user. updateFields);
userRouter.post('/login-page',user. logInCheck);
userRouter.post('/forget-password',user. forgetPassword);
userRouter.post('/reset-password',user. resetPassword);
userRouter.put('/edit-profile',user. editProfile);
userRouter.get('/view-user',user. viewUser);
module.exports = userRouter;