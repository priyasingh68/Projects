const {Types,Schema,model} = require('mongoose')

const user = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    otp:{
        type:String
    },
    otpTime:{
        type:Number
    },
    password:{
        type:String
    },
    IsOtpVerified:{
        type:Boolean,
        default:false
    },
    mobileNumber:{
        type:Number
    },

},{
    timestamps:true
})

module.exports = model('user',user)
