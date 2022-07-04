const router = require("express").Router();
const User = require("../models/User.model");
const Work = require("../models/Work.model");


router.get("/", (req, res, next) => {
  User.find()
  .then((users) => 
      res.render("users/users.hbs", { users }))
      
      .catch((err) => console.log(err));
  });


  router.get("/:user", (req, res, next) => {
    User.findOne({ name: req.params.user })
    .then((user) => 
        res.render("users/user.hbs", { user }))
        
        .catch((err) => console.log(err));
    });
  



module.exports = router;
