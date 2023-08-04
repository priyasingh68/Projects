const {Types,Schema,model} = require('mongoose')

const staticModel = new Schema({
    type:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:Boolean
    },

},{
    timestamps:true
})

module.exports = model('staticModel',staticModel)
