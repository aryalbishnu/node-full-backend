const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    sex: {
        type: String
    },
    phone: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: [4, 'password minimum must be 4 digit']
    },
    repassword: {
        type: String,
        require: true,
        min: [4, 'password minimum must be 4 digit']
    },
    tokens:[{
        token:{
            type: String,
            require: true
        }
    }]
});

mySchema.methods.generateToken = async function(){
   try {
    const newToken = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token: newToken});
    await this.save();
    return newToken;
   } catch (error) {
    res.status(500).send(error);
   }
};

mySchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.repassword = await bcrypt.hash(this.repassword, 10);
    }
    next();
})
 const User = new mongoose.model("User", mySchema);
module.exports = User;