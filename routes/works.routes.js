const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Work = require("../models/Work.model");


router.get("/", (req, res, next) => {
   
res.render("works/works.hbs")
})



router.get("/create",isLoggedIn, (req, res, next) => {
    
    res.render("works/create.hbs")
})


router.post("/create",isLoggedIn, (req, res, next) => {
  if (!req.files) {
    res.send("File was not found");
    return;
  }
  const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const hostname = req.headers.host;
  req.body.file="http://"+hostname+"/files/"+randomName+".pdf"
  Work.create(req.body)
  
  .then((work) => {
    
    let file = req.files.file;
    
    
    file.mv(`${__dirname}/../public/files/${randomName}.pdf`, (err) => {
      console.log(err)
    });
     
        
        User.findByIdAndUpdate(req.user._id,{$push : {works : work._id}})
        .then((user)=>{

            res.redirect("/users/"+user.username+"/profile")
        })
        
        
        .catch((err) => {
            next(err);
          });
    });
    
})



router.get('/edit/:id',isLoggedIn, (req, res, next) => {
    
    Work.findById(req.params.id)
    .then((work) => {
      
      res.render("works/edit.hbs", { work });
    })
    .catch((err) => {
      next(err);
    });
  });



router.post("/edit/:id",isLoggedIn, (req, res, next) => {

    Work.findByIdAndUpdate(req.params.id,req.body)
    .then((work) => {
      
        res.redirect("/users/"+req.session.user.username+"/profile")
    })
    .catch((err) => {
      next(err);
    });

     
    
})



router.post('/delete/:id', (req, res, next) => {
    
    Work.findByIdAndDelete(req.params.id) 
    .then(() => 
    User.findOneAndUpdate({ username: req.session.user.username },{$pull : {works : req.params.id}}))
    
    
        .then(() => 
        res.redirect("/users/"+req.session.user.username+"/profile"))
        
        .catch((err) => console.log(err));


  });




router.get("/work/:id", (req, res, next) => {
    Work.findById(req.params.id)
    
    .then((work) => {
        
        res.render( "works/work",{ work })})
        
        .catch((err) => {
            next(err);
          });
    });



module.exports = router;