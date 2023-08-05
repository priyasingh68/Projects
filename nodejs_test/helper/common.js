const otpGenerator = require('otp-generator')

otpGenerator.generate(8, { upperCaseAlphabets: false, specialChars: false });
module.exports ={

    generateOtp:()=>{
        Math.floor(100000 + Math.random() * 900000).toString();
    }
}