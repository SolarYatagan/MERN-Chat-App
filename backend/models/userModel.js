const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator =  require('validator')
const ValidatePassword = require('validate-password');



mongoose.set('strictQuery', false)

const userSchema = mongoose.Schema({
     name:{
        type: String, 
        required: true
     },
     email:{
        type: String,
        required: true, 
        unique: true
     },
     password:{
        type: String,
        required: true
     },
     users:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
     }],
     picture:{
        type: String,
        default: 'https://e1.pngegg.com/pngimages/564/726/png-clipart-button-ui-system-icons-contacts-unknown-human-profile-illustration.png'
     }
},{
    timestamps: true
});

userSchema.pre("save", async function (next){
   if(!this.isModified('password')){
      return next()
   }
   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next()
   } catch (error) {
      return new Error(error.message)
   }
})

userSchema.methods.validation = async function validation(pass) {
   return await bcrypt.compare(pass, this.password)
}

userSchema.statics.signup = async function (email, passwordUser, name) {

   if(!name || !email || !passwordUser){
      throw new Error('Please, fill all the fields')
  }

   if(!validator.isEmail(email)){
      throw new Error('Email is not valid')
   }
   
   var options = {
      enforce: {
      lowercase: true,
      uppercase: true,
      specialCharacters: false,
      numbers: true
      }
      };
      
      const validate = new ValidatePassword(options);

   if(!validate.checkPassword(passwordUser).isValid){
      throw new Error(`${validate.checkPassword(passwordUser).validationMessage}`)
   }

   const isUserExists = await User.findOne({ email })

   if(isUserExists){
       throw new Error("User is already exists")
   }

   return true;
 };


const User = mongoose.model("User", userSchema)

module.exports = User;