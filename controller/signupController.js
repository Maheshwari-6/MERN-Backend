// const signupModel = require('../model/signupModel');
// let bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const homePage = (req, res) => {    
//     res.render('homePage', {
//         error: ""
//     })
// }
// const signUp = async (req, res) => {
//     //Check if the user is already in the DB 
//     let existedUser = await signupModel.findOne({email: req.body.email});

//     if(existedUser) {
//         res.render('outh', {
//             error: "user exist",
//             success: ""
//         })
//     }else{
//         let hashedPass = bcrypt.hashSync(req.body.password, 12)
        
//         let userObj = {
//             ...req.body,
//             password: hashedPass
//         }

//         let newUser = new signupModel(userObj);
//         newUser.save()
//         .then( () => {
//             res.locals.success = "User has been added";
//             res.redirect('/f');
//         })
//         .catch( (err) => {
//             throw err
//         })
//     }
// }

// module.exports = {
//     homePage,
//     signUp
// }