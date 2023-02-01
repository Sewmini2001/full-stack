const jwt = require('jsonwebtoken')
module.exports = (req, res, next) =>{
    try{
     const token = req.headers.authorization.split(' ')[1];
    //return res.json(token);
    const decode = jwt.verify(token, "webBatch")
    req.userData = decode
    //return res.json(decode);
    next();
    }catch(error){
    res.json({success: false, message: "Auth Failed.."})
    }
}