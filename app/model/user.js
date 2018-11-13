module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    
    const UserSchema = new Schema({
        name : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : Number,
            default : 1
        },
        avatar : {
            type : String,
            default : ''
        },
        createAt : {
            type : Number,
            default : Date.now
        },
        updatedAt : {
            type : Number
        },
        deletedAt : {
            type : Number
        },
        status : { // 状态
            type : String,
            enum : [ '0', '1', '2' ], // 0存在 1更新，2 删除
            default : '0'
        }
    })
    
    return mongoose.model('Users', UserSchema)
}
