const Work = require("../models/Work.model");



const average = (array) => {
  if(array.length===0){return 0}
  let total = array.reduce((a, b) => a + b, 0)
return (total/array.length).toFixed(2)
  
  };

module.exports=average;