const router = require("express").Router();
const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");



router.get("/", (req, res, next) => {
let logged=false

if(req.session.user){logged=true}


 

  
  User.find()
  .then((user) => {
   
  res.render("users/users.hbs", { user, logged})})
  
      
      .catch((err) => console.log(err));
  });

  router.get("/profile",isLoggedIn, (req, res, next) => {
    let logged=false

if(req.session.user){logged=true}

     User.findById(req.session.user._id)
     .populate("works")   

     .then((user) => {
     res.render("users/profile.hbs",  {user, logged} )})
     
     .catch((err) => console.log(err));
 });
    


  router.get("/:user", async (req, res, next) => {
    try {
        let added=false
        let logged=false

        if(req.session.user){logged=true}
    const user= await User.findOne({ username: req.params.user })
    .populate("works")
    const userLoged = await User.findById(req.session.user._id)  
    
    if(user===null){res.redirect("/users")}

    if (userLoged.favorites.includes(user.username)){added=true}


    res.render( "users/user",{ user,added,logged})
    
} catch (error) {
    res.render("users/users")
  }
       
     
   
    });


    router.post("/:user/favorite",isLoggedIn, (req, res, next) => {
        
        User.findById(req.session.user._id)
        .then((userLoged) => {
            
            if(!userLoged.favorites.includes(req.params.user)){
              
                
                User.findByIdAndUpdate(req.session.user._id,{
                    $push: { favorites: req.params.user},
                }).then(()=>{})
                
            }
            res.redirect("/users/profile")
        })
        
            
                 
        .catch((err) => console.log(err))
    });

    router.post("/:user/delete", isLoggedIn, (req, res, next) => {
      
        User.findByIdAndUpdate(req.session.user._id, {$pull : {favorites : req.params.user}})
            
                .then(() => {  
        res.redirect("/users/profile")    
        })
            
            .catch((err) => console.log(err));
    

    });


  
  



module.exports = router;
