const { Schema, model } = require("mongoose");


const workSchema = new Schema(
  {
    name: {
      type: String,
      required: true, 
    },


    type: {
      type: String,
      enum: ["Short Story", "Poetry", "Song", "Theater", "Narrative"],
      required: true, 
    }, 

    genre:{
      type: String,
      enum: ["Drama", "Romance", "Erotic", "Comedy", "Thriller", "Terror", "Others"],
      required: true, 
    },

    language: {
      type: String,
      required: true, 
      
    }, 

    description: {
      type: String,
      
      required: true, 
    }, 

    ratings:[Number],

    avRating: {
      type: Number,
      default:0
      
      
    }, 

    file:{type:String}

  },


  {
    
    timestamps: true,
  }
);

const Work = model("Work", workSchema);

module.exports = Work;


