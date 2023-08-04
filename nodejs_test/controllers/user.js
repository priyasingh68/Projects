const userModel = require('../model/user');
const common = require('../helper/common');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Joi = require("joi");
const { verify } = require("jsonwebtoken");

const validator = (Schema) => (payload) => {
  return Schema.validate(payload, { abortEarly: false });
};

const signupSchema = Joi.object({
  name:Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const validateSignup = validator(signupSchema);

module.exports = {

  // api development

  // signup


  // signup: (req, res) => {
  //     try {
  //       userModel.findOne({ email: req.body.email }, (err, result) => {
  //         if (err) {
  //           return res.status(500).send({
  //             responseMessage: "Internal server error",
  //             responseCode: 501,
  //             error: err
  //           })
  //         } else if (result) {
  //           return res.status(500).send({
  //             responseMessage: "email already exists",
  //             responseCode: 401,
  //             error: []
  //           })
  //         } else {
  //           let otp = common.generateOtp();
  //           otp = Math.floor(10000000 + Math.random() * 90000000);
  //           req.body.otp = otp;
  //           console.log(req.body);

  //           let otpTime = Date.now() + 3 * 60 * 1000;
  //           req.body.otpTime = otpTime;
  //           console.log(req.body);

  //           var transporter = nodemailer.createTransport({
  //             service: 'gmail',
  //             auth: {
  //                 user: 'priya.singh@indicchain.com',
  //                 pass: 'iejlapsddgndyofm'
  //             },

  //         });

  //         var mailOptions = {
  //             from: 'priya.singh@indicchain.com',
  //             to: req.body.email,
  //             subject: 'otp verification',
  //             text: `your otp is ${otp}`
  //         };

  //         transporter.sendMail(mailOptions, function (error, info) {
  //             if (error) {
  //                 console.log(error);
  //             } else {
  //                 console.log('email sent:' + info.response);
  //             }
  //         });


  //           let password = bcrypt.hashSync(req.body.password)
  //           req.body.password = password;
  //           console.log(req.body);

  //           userModel(req.body).save((err1, res1) => {
  //             if (err1) {
  //               return res.status(500).send({
  //                 responseMessage: "Internal server error",
  //                 responseCode: 501,
  //                 error: err1
  //               })
  //             } else {
  //               return res.status(200).send({responseMessage:"Signup success",responseCode:200,result:res1})
  //             }
  //           })
  //         }
  //       })
  //     } catch (error) {
  //       console.log(error);
  //       return res.status(501).send({
  //         responseMessage: "Something went wrong",
  //         responseCode: 501,
  //         error: error
  //       })
  //     }
  //   },

  signup: async (req, res) => {
    try {
      const { name,email, password } = req.body;
      //check if user already exists
      const alreadyUser = await userModel.findOne({ email });
  
      const { error, value } = validateSignup(req.body);
      if (error) {
        return res.status(400).send({ responseMessage: "Invalid request data", error: error.details });
      } else if (alreadyUser) {
        return res.status(500).send({ responseMessage: "Email already exists" })
      } else {
        //generate otp
        let otp = common.generateOtp();
        otp = Math.floor(10000000 + Math.random() * 90000000);
        req.body.otp = otp
        console.log(req.body);
  
        let otpTime = Date.now() + 3 * 60 * 1000;
        req.body.otpTime = otpTime;
        console.log(req.body);
  
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'priya.singh@indicchain.com',
            pass: 'iejlapsddgndyofm'
          },
        });
  
        var mailOptions = {
          from: 'priya.singh@indicchain.com',
          to: req.body.email,
          subject: 'otp verification',
          text: `your otp is ${otp}`
        };
  
        await transporter.sendMail(mailOptions);
  
        //hash password
        let hashedPassword = bcrypt.hashSync(password);
        const newData = await userModel({ ...req.body, password: hashedPassword }).save();
  
        return res.status(200).send({
          responseMessage: "Signup success",
          responseCode: 200,
          result: newData
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(501).send({
        responseMessage: "Something went wrong",
        responseCode: 501,
        error: error
      });
    }
  },
  

  //get api
  // signupGet:(req,res)=>{
  //     try{
  //         userModel.find({},(req1,res1)=>{
  //             return res.status(200).send({responseMessage:"Signup success",responseCode:200,result:res1})

  //         })
  //     }catch (error) {
  //         console.log(error);
  //         return res.status(501).send({responseMessage:"Something went wrong",responseCode:501,error:error})
  //     }
  // },

  signupGet: async (req, res) => {
    try {
      const findUser = await userModel.find({})
      return res.status(200).send({ responseMessage: "signup success", result: findUser })
    }
    catch (error) {
      console.log(error);
      return res.status(501).send({
        responseMessage: "Something went wrong",
        responseCode: 501,
        error: error
      })
    }
  },
  //  verifyOtp: function(req, res) {
  //      try {
  //          const email = req.body.email;
  //          const otp = req.body.otp;
  //          userModel.findOne({ email: email, otp: otp }, function(err, userDoc) {
  //              if (err) {
  //                  console.log(err);
  //                  return res.status(500).send({
  //                      responseMessage: "Something went wrong",
  //                      responseCode: 500,
  //                      error: err
  //                  });
  //              }
  //              const otpCurrentTime = +new Date();
  //              req.body.otpCurrentTime = otpCurrentTime;

  //              if (userDoc && userDoc.otp === otp && userDoc.otpTime > otpCurrentTime) {
  //                  userModel.updateOne({ email: email }, { $set: { IsOtpVerified: true } }, function(err) {
  //                      if (err) {
  //                          console.log(err);
  //                      return res.status(500).send({
  //                              responseMessage: "Something went wrong",
  //                              responseCode: 500,
  //                              error: err
  //                          });
  //                      }
  //                      console.log("isOtpVerified field updated successfully");
  //                  return res.status(200).send({
  //                          responseMessage: "OTP verified successfully"
  //                      });
  //                  });
  //              } else {
  //                  return res.status(401).send({
  //                      responseMessage: "Invalid OTP or OTP expired"
  //                  });
  //              }
  //          });
  //      } catch (error) {
  //          console.log(error);
  //          return res.status(501).send({
  //              responseMessage: "Something went wrong",
  //              responseCode: 501,
  //              error: error
  //          });
  //     }
  //  },


  verifyOtp: async (req, res) => {
    try {
      const email = req.body.email;
      const otp = req.body.otp;
      const findUser = await userModel.findOne({ email: email, otp: otp });
      if (!findUser) {
        return res.status(500).send({ responseMessage: "internal server error" })
      }
      else {
        //create otp in else
        const otpCurrentTime = +new Date();
        req.body.otpCurrentTime = otpCurrentTime;

        if (findUser && findUser.otp === otp && findUser.otpTime > otpCurrentTime) {
          await userModel.updateOne({ email: email }, { $set: { IsOtpVerified: true } })
          return res.status(200).send({ responseMessage: "otp verified" })
        }

      }
    } catch (error) {
      console.log(error);
      return res.status(501).send({
        responseMessage: "Something went wrong",
        responseCode: 501,
        error: error
      })
    }
  },

  // get one user credentials

  // userData: (req, res) => {
  //     try {
  //         const userId = req.body.id;

  //         userModel.findById(userId, (err, result) => {
  //             if (err) {
  //                 return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err });
  //             } else if (result) {
  //                 console.log(result);
  //                 return res.status(200).send({ responseMessage: "User data found", data: result });

  //             } else {
  //                 return res.status(404).send({ responseMessage: "User not found", responseCode: 404 });
  //             }
  //         });
  //     } catch (err) {
  //         return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err });
  //     }

  // },

  //get one user credentials uing aync await
  userData: async (req, res) => {
    try {
      const userId = req.body.id;
      const userOne = await userModel.findById(userId)
      if (!userOne) {
        return res.status(500).send({ responseMessage: "user not found" })
      }
      else {
        return res.status(200).send({ result: userOne })
      }
    } catch (error) {
      console.log(error);
      return res.status(501).send({
        responseMessage: "Something went wrong",
        responseCode: 501,
        error: error
      })
    }
  },

  userDataGet: (req, res) => {
    try {
      userModel.find({}).sort({ createdAt: -1 }, (req1, res1) => {
        return res.status(200).send({ result: res1 })

      })
    } catch (error) {
      console.log(error);
      return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
    }
  },
  //update two name and email
  updateFields: (req, res) => {
    const userId = req.body.id;
    const newName = req.body.name;
    const newEmail = req.body.email;
    try {
      userModel.findById(userId, (err, result) => {
        if (err) {
          return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err });
        } else if (result) {
          userModel.updateOne({ _id: userId }, { name: newName, email: newEmail }, (err, result) => {
            if (err) {
              return res.status(500).send({
                responseMessage: "Internal server error"
              });
            } else {
              return res.status(200).send({
                responseMessage: "User updated successfully"
              });
            }
          });
        } else {
          return res.status(404).send({ responseMessage: "id not found", responseCode: 404 });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
    }
  },
  //log in api
  logInCheck: (req, res) => {
    try {
      userModel.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
          return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err });
        }
        else if (!result) {
          return res.status(401).send({ responseMessage: "email doesn't exist", responseCode: 401, error: [] });
        }
        else {
          bcrypt.compare(req.body.password, result.password, (err, isMatch) => {
            if (err) {
              return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err });
            }
            else if (!isMatch) {
              return res.status(401).send({ responseMessage: "password don't match", responseCode: 401, error: [] });
            }
            else {
              userModel.findOne({ email: req.body.email, IsOtpVerified: true }, (err, result) => { // Added email condition for OTP verification check
                if (err) {
                  return res.status(500).send({ responseMessage: "Internal server error", responseCode: 501, error: err });
                }
                else if (!result) {
                  return res.status(401).send({ responseMessage: "OTP not verified", responseCode: 401, error: [] });
                }

                else {
                  const payload = {
                    user: {
                      id: result.id,
                      email: result.email
                    }
                  };
              
                  const secretKey = 'Abcde12';
                  const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });
                  console.log(token)
                  res.json({ token });
                }
              });
            }
          });
        }
      });
    }
    catch (error) {
      console.log(error);
      return res.status(501).send({ responseMessage: "Something went wrong", responseCode: 501, error: error })
    }
  },

  //forget password

  // forgetPassword: function (req, res) {
  //   const token=req.body.headers;
  //   jwt.verify(token,'secret')
    
  //   const email = req.body.email;
  //   const newOtp = Math.floor(10000000 + Math.random() * 90000000);
  //   const time = Date.now() + 3 * 60 * 1000;
  //   try {
  //     userModel.findOne({ email: email }, function (err, user) {
  //       if (err) {
  //         console.log(err);
  //         return res.status(500).send({ responseMessage: "Internal server error" });
  //       }
  //       if (!user) {
  //         return res.status(404).send({ responseMessage: "User not found" });
  //       }

  //       // Update  new OTP and OTP time
  //       userModel.updateOne({ email: email }, { otp: newOtp, otpTime: time }, function (err) {
  //         if (err) {
  //           console.log(err);
  //           return res.status(500).send({ responseMessage: "Internal server error" });
  //         }

  //         var transporter = nodemailer.createTransport({
  //           service: 'gmail',
  //           auth: {
  //             user: 'priya.singh@indicchain.com',
  //             pass: 'iejlapsddgndyofm'
  //           },

  //         });

  //         var mailOptions = {
  //           from: 'priya.singh@indicchain.com',
  //           to: req.body.email,
  //           subject: 'otp verification',
  //           text: `your otp is ${newOtp}`
  //         };

  //         transporter.sendMail(mailOptions, function (error, info) {
  //           if (error) {
  //             console.log(error);
  //           } else {
  //             console.log('email sent:' + info.response);
  //           }
  //         });

  //         return res.status(200).send({ responseMessage: "otp is updated" });
  //       });

  //     });
  //   }
  //   catch (error) {
  //     console.log(error);
  //     return res.status(501).send({ responseMessage: "Something went wrong" })
  //   }
  // },
  //resend otp
 
 //forget password api with token

 forgetPassword: async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ responseMessage: "User doesn't exist" });
    }

    // Generate a reset token
    const token = jwt.sign({ email }, 'Kbc123', { expiresIn: '1h' });
    console.log(token)

    const resetLink = `http://example.com/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
          auth: {
            user: 'priya.singh@indicchain.com',
            pass: 'iejlapsddgndyofm'
      }
    });

    const mailOptions = {
      from: 'priya.singh@indicchain.com',
      to: req.body.email,
      subject: 'Reset Password',
      text: `Click the following link to reset your password: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ responseMessage: 'Reset password link is sent' });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ responseMessage: 'Something went wrong' });
  }
},

//reset password api

resetPassword: function (req, res) {
  const { email, token, newPassword, confirmPassword } = req.body;

  try {
    // Validate the reset token
    jwt.verify(token, 'Kbc123', (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ responseMessage: 'Token expired' });
        } else {
          return res.status(401).json({ responseMessage: 'Invalid token' });
        }
      }

      // Check if the reset token's email matches the request email
      if (decoded.email !== email) {
        return res.status(400).json({ responseMessage: 'Invalid token or email' });
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ responseMessage: 'New passwords do not match' });
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ responseMessage: 'Internal server error' });
        }

        // Update the user's password in the database
        userModel.updateOne({ email: email }, { password: hashedPassword }, (err, result) => {
          if (err) {
            return res.status(500).json({ responseMessage: 'Internal server error' });
          } else {
            return res.status(200).json({ responseMessage: 'Password updated successfully' });
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ responseMessage: 'Something went wrong' });
  }
},


// resend otp api
  resendOtp: function (req, res) {
    const email = req.body.email;
    const newOtp = Math.floor(10000000 + Math.random() * 90000000);
    const time = Date.now() + 3 * 60 * 1000;//for updation of otp time after generating new otp
    const otpCurrentTime = +new Date();//this shows current time
    req.body.otpCurrentTime = otpCurrentTime;
    try {
      userModel.findOne({ email: email }, function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).send({ responseMessage: "Internal server error" });
        }
        if (!result) {
          return res.status(500).send({ responseMessage: "User not found" });
        } else {
          if (result.otpTime < otpCurrentTime) {
            userModel.updateOne({ email: email }, { otp: newOtp, otpTime: time, IsOtpVerified: false }, function (err) {
              if (err) {
                console.log(err);
                return res.status(500).send({ responseMessage: "Internal server error" });
              }

              // Send OTP to user's email
              var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'priya.singh@indicchain.com',
                  pass: 'iejlapsddgndyofm'
                },

              });

              var mailOptions = {
                from: 'priya.singh@indicchain.com',
                to: req.body.email,
                subject: 'otp verification',
                text: `your otp is ${newOtp}`
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('email sent:' + info.response);
                }
              });

              return res.status(200).send({ responseMessage: "OTP sent to your mail" });
            });
          } else {
            return res.status(200).send({ responseMessage: "OTP already sent. Please wait for 3 minutes." });
          }
        }
      });
    }
    catch (error) {
      console.log(error);
      return res.status(501).send({ responseMessage: "Something went wrong" })
    }
  },
  //reset paasword
  
verifyToken: async (req, res, next) => {
  try {
    const token = req.headers.token;
    jwt.verify(token, 'Abcde12', (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
        } else {
          return res.status(401).json({ message: 'Invalid token' });
        }
      }
      
      // Token is valid, return decoded information
      res.status(200).json({ 
        id: decoded._id, 
        data: decoded 
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
},

 //edit profile 
 editProfile: async (req, res) => {
  try {
    const userId = req.body.Id;
    const profileData = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile data
    if (profileData.name) {
      const existingUserWithName = await userModel.findOne({ name: profileData.name });
      if (existingUserWithName && existingUserWithName._id.toString() !== userId) {
        return res.status(400).json({ error: 'Name already exists' });
      }
      user.name = profileData.name;
    }

    if (profileData.email) {
      const existingUserWithEmail = await userModel.findOne({ email: profileData.email });
      if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      user.email = profileData.email;

      // Send email notification about email change
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'priya.singh@indicchain.com',
          pass: 'iejlapsddgndyofm'
        }
      });

      const mailOptions = {
        from: 'priya.singh@indicchain.com',
        to: req.body.email,
        subject: 'Email Change',
        text: 'Your email has been updated.'
      };

      await transporter.sendMail(mailOptions);
    }

    if (profileData.password) {
      const { newPassword, confirmPassword, oldPassword } = profileData;

      // Check if the confirm password matches the new password
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      // Check if the old password matches the current password
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).json({ error: 'Invalid old password' });
      }

      // Hash and save the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
    }

    // Save the updated user profile
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.log('Error during profile update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

//viewuser api
viewUser: async (req, res) => {
  try {
    const { _id, email, name } = req.query;

    if (!_id && !email && !name) {
      return res.status(400).json({ error: 'Please provide _id, email, or userName as query parameters.' });
    }
    if(email){
      const users = await userModel.find({ email:email });
      return res.json(users);
    }
    if (name && /^[A-M]/i.test(name)) {
     const users = await userModel.find({ name: { $regex: '^[A-M]', $options: 'i' } });
     // Retrieve and return the trainees with names starting from A to M
     return res.json(users);
    } else if (name && /^[N-Z]/i.test(name)) {
      const users = await userModel.find({ name: { $regex: '^[N-Z]', $options: 'i' } });
     // Retrieve and return the trainees with names starting from A to M
     return res.json(users);
    } 
    else if (email) {
      // Request type for email
      const users = await userModel.find({ email: email });
      // Retrieve and return the trainees with the specified email
      return res.json(users);
    }
    else if (_id) {
      // Request type for email
      const users = await userModel.find({ _id: _id });
      // Retrieve and return the trainees with the specified email
      return res.json(users);
    }else {
      return res.status(400).json({ error: 'Invalid or missing userName parameter.' });
    }
  } catch (error) {
    console.log('Error during profile update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


}