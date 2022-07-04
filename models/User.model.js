const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      
      required: true, 
    },
    password: {
      type: String,
      required: true, 
    }, 
    /*email: {
      type: String,
      unique: true,
      required: true
      
    }, */
    works: [{ type: Schema.Types.ObjectId, ref: "Work" }],

    favorites: [{ type: Schema.Types.ObjectId, ref: "User" }],

    rating: {
      type: Number,
       
    }, 
  
  },


  {
    
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;


