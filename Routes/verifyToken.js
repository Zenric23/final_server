const jwt = require("jsonwebtoken")


const verifyToken = (req, res, next) => {

     const token = req.cookies['admin_token']
        ? req.cookies['admin_token']
        : req.cookies['token']

    const isLogin = req.cookies['admin_isLogin']
        ? req.cookies['admin_isLogin']
        : req.cookies['isLogin']

    if(!token || !isLogin) {
        res.status(401).json('You are not authenticated!')
        return
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user)=> {
        if(err) res.status(403).json('Token is invalid!') 
        req.user = user
        next()
    })
}
 
const verifyTokenAndAuthorization = (req, res, next) => { 
    verifyToken(req, res, ()=> {
        if(req.user._id === req.params.id || req.user.isAdmin) {
            next() 
        } else { 
            res.status(403).json('You are not allowed to do such action!')
        } 
    })
}
 
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.isAdmin) {
            next()
        } else {
            res.status(403).json('You are not an Admin!')
        } 
    })
}


module.exports = {
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin
}