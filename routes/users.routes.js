const router = require("express").Router();
const User = require("../models/User.model");
const Work = require("../models/Work.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const average= require("../utils/average");
const { findByIdAndUpdate } = require("../models/User.model");


router.get("/", (req, res, next) => {
  User.find()
  .then((user) => 
  
  res.render("users/users.hbs", { user }))
  
      
      .catch((err) => console.log(err));
  });


  router.get("/:user", (req, res, next) => {
    User.findOne({ username: req.params.user })
    .populate("works")  
    
    .then((user) => {
        if(user===null){res.redirect("/users")}

     
       
           
        
        res.render( "users/user",{ user})})
       })
        .catch((err) => res.render("users/users"));
    })
    });


    router.post("/:user/favorite",isLoggedIn, (req, res, next) => {
        User.findById(req.session.user._id)
        .then((userLoged) => {
        if(!userLoged.favorites.includes(req.params.user)){
            
            
            User.findByIdAndUpdate(userLoged._id,{
                $push: { favorites: req.params.user},
            }).then(() => {
                res.redirect("/");
            }).catch((err) => console.log(err))
        }
    });

    router.get("/:user/profile",isLoggedIn, (req, res, next) => {
        if(req.params.user!==req.session.user.username){
            res.redirect("/users")}

        User.findOne({ username: req.params.user })
        .populate("works")   

        .then((user) => 
        res.render("users/profile.hbs", { user }))
        
        .catch((err) => console.log(err));
    });
       
  



module.exports = router;
