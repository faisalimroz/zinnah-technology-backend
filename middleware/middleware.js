const jwt = require("jsonwebtoken");

module.exports.Middleware=(req,res,next)=>{
    const Authorization = req.headers.authorization;
    if (!Authorization) {
        return res.status(400).send({ error: true, message: 'unauthorized access' })
    }
    const token = Authorization.split(' ')[1];

    jwt.verify(token,process.env.JWT_SECRET,(err, decoded) =>{
        if (err) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
          }
          req.decoded = decoded;
          next();
    })
}