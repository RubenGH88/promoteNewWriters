const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  let logged=false

        if(req.session.user){logged=true}
    
  res.render("index",{logged});
});

module.exports = router;
