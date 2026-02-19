const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){

 const authHeader = req.headers.authorization;

 if(!authHeader){
  return res.status(401).json({msg:"No token"});
 }

 try{

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
// Debugging: Check if userId exists here
    console.log("Decoded JWT:", decoded);
  req.user = decoded;

  next();

 }catch(err){
  console.log("JWT ERROR =>", err);
  res.status(401).json({msg:"Token invalid"});
 }

}
