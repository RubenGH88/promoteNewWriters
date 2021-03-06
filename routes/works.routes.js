const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Work = require("../models/Work.model");
const average= require("../utils/average")
const fs= require("fs")



router.get("/", async (req, res, next) => {
  try {
    let logged=false

if(req.session.user){logged=true}

    let works
    const allWorks = await Work.find()
  
    // debo buscar el pokemon del URL
    const filteredWorks = await Work.find({ type: req.query.type,
      genre: req.query.genre,
      language: req.query.language })

  
      if(filteredWorks.length===0){works=allWorks}
      if(filteredWorks.length!==0){works=filteredWorks}
      
      res.render("works/works",{works,logged});
    
  } catch (error) {
    console.log(error)
  }

      
})

router.get("/create",isLoggedIn, (req, res, next) => {
  let logged=false

  if(req.session.user){logged=true}
   
    
    
    res.render("works/create.hbs",{logged})
})

router.post("/create",isLoggedIn, (req, res, next) => {
 
  
  if (!req.body.name) {
    return res.status(400).render("works/create", {
      errorMessage: "Please enter the work's name"}
      )}     
      
      if (!req.body.language) {
        return res.status(400).render("works/create", {
          errorMessage: "Please enter the work's language"}
          )}
          
          if (!req.body.description) {
            return res.status(400).render("works/create", {
              errorMessage: "Please enter a description."}
              )}
              
              if (!req.files) {
                return res.status(400).render("works/create", {
                  errorMessage: "Please enter your file."}
                  )}
              
              
              
              const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
              
  req.body.file="/files/"+randomName+".pdf"

  Work.create(req.body)
  
  
  .then((work) => {
    
    let file = req.files.file;
    
    
    file.mv(`${__dirname}/../public/files/${randomName}.pdf`, (err) => {
      console.log(err)
    });
     
        
        User.findByIdAndUpdate(req.user._id,{$push : {works : work._id}})
        .then((user)=>{

            res.redirect("/users/profile")
        })
        
        
        .catch((err) => {
            next(err);
          });
    });
    
})



router.get('/edit/:id',isLoggedIn, (req, res, next) => {

  if (!req.body.name) {
    return res.status(400).render("works/create", {
      errorMessage: "Please enter the work's name"}
      )}     
      
      if (!req.body.language) {
        return res.status(400).render("works/create", {
          errorMessage: "Please enter the work's language"}
          )}
          
          if (!req.body.description) {
            return res.status(400).render("works/create", {
              errorMessage: "Please enter a description."}
              )}
              
              if (!req.files) {
                return res.status(400).render("works/create", {
                  errorMessage: "Please enter your file."}
                  )}




    let logged=false

if(req.session.user){logged=true}
    Work.findById(req.params.id)
    .then((work) => {
      
      res.render("works/edit.hbs", { work ,logged});
    })
    .catch((err) => {
      next(err);
    });
});



router.post("/edit/:id",isLoggedIn, (req, res, next) => {
  
  if (!req.files) {
    Work.findByIdAndUpdate(req.params.id,req.body)
    .then((work) => {
    res.redirect("/users/profile")
  });
  }
else{
  let path="public"+req.body.file
    fs.unlink(path,function(err){
         if(err) return console.log(err);
    });  
  

  const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  req.body.file="/files/"+randomName+".pdf"

    Work.findByIdAndUpdate(req.params.id,req.body)
    .then((work) => {
      let file = req.files.file;
      file.mv(`${__dirname}/../public/files/${randomName}.pdf`, (err) => {
        console.log(err)
      });

      
        res.redirect("/users/profile")
    })
    .catch((err) => {
      next(err);
    });
  }

     
    
})



router.post('/delete/:id', (req, res, next) => {
    
    let path="public"+req.body.file
    fs.unlink(path,function(err){
         if(err) return console.log(err);
    });  
   
    Work.findByIdAndDelete(req.params.id) 
    .then(() => 
      User.findOneAndUpdate({ username: req.session.user.username },
        {$pull : {works : req.params.id}}))
        
            .then(() => {
              User.findById(req.session.user._id)
              .populate("works")
    
              .then((user) => {
                  let ratingsA=[]
                  user.works.forEach((work)=>{ratingsA.push(work.avRating)})
        
                User.findByIdAndUpdate(user._id,{rating : average(ratingsA)})
                    .then(() => {
                      Work.findById(req.params.id)  
                      .then(() => {
        
                    res.redirect("/users/profile")
                  })
          })
      })
            
          
          
    })
        
        .catch((err) => console.log(err));

});




router.get("/work/:id", (req, res, next) => {
  let logged=false

  if(req.session.user){logged=true}

  Work.findById(req.params.id)  
  .then((work)=>{ 
    
    let ratings=work.ratings
    
  Work.findByIdAndUpdate(work.id,{avRating : average(ratings)})

  .then(()=>{
    User.findOne({ works: req.params.id })
    .populate("works")
    
      .then((user) => {
        let ratingsA=[]
        user.works.forEach((work)=>{if(work.ratings.length){
          ratingsA.push(work.avRating)}})
        
        User.findByIdAndUpdate(user._id,{rating : average(ratingsA)})
        .then((user) => {
            Work.findById(req.params.id)  
            .then((work) => {
        
              res.render( "works/work",{ work,logged })
            })
          })
      })
  })
})

        .catch((err) => {
            next(err);
          });
});


router.get("/rating", async (req, res, next) => {
      
  
  try {
    let logged=false

if(req.session.user){logged=true}
    const allAuthors = await User.find().sort({rating: -1,})
    let authors=[...allAuthors].splice(0,5)
  
    // debo buscar el pokemon del URL
    const allWorksSorted = await Work.find().sort({avRating: -1,})
    const filteredWorksSorted = await Work.find({ type: req.query.type,
      genre: req.query.genre,
      language: req.query.language }).sort({avRating: -1,})

    
      let allWorks
      if(filteredWorksSorted.length===0){allWorks=allWorksSorted}
      if(filteredWorksSorted.length!==0){allWorks=filteredWorksSorted}



    let works=[...allWorks].splice(0,5)
    
      
      res.render("works/rating",{works,authors,logged});
    
  } catch (error) {
    console.log(error)
  }

});

router.post("/rating", (req, res, next) => {
      
    
  Work.findByIdAndUpdate(req.body.id,{$push : {ratings : req.body.stars}})
  .then(() => {
        
          res.redirect("/works/work/"+req.body.id)
  })
          
    .catch((err) => {
              next(err);
            });
});

module.exports = router;