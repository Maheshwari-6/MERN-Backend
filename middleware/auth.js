const jwt = require('jsonwebtoken')

const checkHomePageToken = (req, res, next) => {
    let token = req.headers.usertoken;
    if(!token){
        res.locals.user = false;
        next();
    }else{
        jwt.verify(token, process.env.JWT_TEXT, async (err, userInfo) => {
            if(err){
                console.log(err);
                res.locals.user = false;
            } else {
                res.locals.user = userInfo.existedUser.userName;
                res.locals.email = userInfo.existedUser.email;
                res.locals.userId = userInfo.existedUser._id;
            }
        })
        next();
    }

}

const checkUserToken = (req, res, next) => {
    let token = req.headers.usertoken;

    if(token){
        jwt.verify(token, process.env.JWT_TEXT, async (err, userInfo) => {
            if(err){
                console.log(err);
                res.locals.user = false;
                res.status(401)
                res.send('Unauthorized, please login')
            } else {
                res.locals.user = userInfo.existedUser.userName;
                res.locals.email = userInfo.existedUser.email;
                res.locals.userId = userInfo.existedUser._id;
                next();
            }
        })
    } else {
        res.locals.user = false;
        res.status(401)
        res.send('Unauthorized, please login')
    }
}

module.exports = {
    checkUserToken,
    checkHomePageToken
}