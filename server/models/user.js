const mongoose= require('mongoose');
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken');
const schema = mongoose.Schema;

const userschema= new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    },
    tokens:[
        {
            token:{
                type: String,
                required: true
            }
        }
    ]
})

userschema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password, 12);
        this.cpassword= await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

const SECRET_KEY="THISISMYKUSHAGRAPORWALOWNHISFANTASTICSECRET"
userschema.methods.generateAuthToken= async function(){
    try{
        let token= jwt.sign({_id: this._id}, SECRET_KEY);
        this.tokens= this.tokens.concat({token: token});
        await this.save();
        return token;
    }
    catch(err){
        console.log(err);
    }
}

const User= mongoose.model('User', userschema);
module.exports=User;