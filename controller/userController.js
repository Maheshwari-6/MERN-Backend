const user = require('../model/userModel');
const signupModel = require('../model/signupModel');
let bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');



const homePage = (req, res) => { 
    user.find()
    //.sort({create_at : '-1'})
    //.then((result) => {res.render('homePage', {question : result})})
    .then((result) => {res.send(result)})
    .catch(err => console.log(err))   
} 

const loginUser = (req, res) => {    
    res.render('outh', {error:""});
} 

const questionAddition = (req, res) => {    
    user.find()
    .then((err) => res.render('addQuestion'))
    .catch(err => console.log(err))
}


const questionAdditionChat = (req, res) => {    
    user.find()
    .then((err) => res.render('askChat', { questionTitle: false, questionDescription: false, chatGPTResponse: false, questionId: false }))
    .catch(err => console.log(err))
}



const postQuestion = (req,res) =>{
    let newUser = new user({
        ...req.body,
        userId: res.locals.userId
      });
    newUser.save()
    .then((result) => res.redirect('/'))
    .catch(err => res.render('addQuestion'))
}

const postQuestionChatGPT = (req,res) =>{
    let newUser = new user({
        ...req.body,
        userId: res.locals.userId
      });
    newUser.save()
    .then((result) => {
        console.log(result)
        chatWithOpenAI(result.desc).then(chatGPTResponse => {
            res.render('askChat', {questionTitle: result.question, questionDescription: result.desc, chatGPTResponse: chatGPTResponse, questionId: result.id})
        })
    })
}

const addAnswerToQuestion = (req, res) => {
    console.log(req.body)
    user.findById(req.params.id).then(question => {
        question.chatGPTReply = req.body.answer
        question.save().then(result => {
            res.redirect('/')
        })
    })
}



const chatWithOpenAI = async (question) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: question }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.CHAT_GPT_KEY}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Extract the assistant's reply from the response
      const reply = response.data.choices[0].message.content;
      console.log(reply);
      return reply;
    } catch (error) {
      console.error(error.response.data);
      throw error;
    }
  };


 

const signUp = async (req, res) => {
    //Check if the user is already in the DB 
    let existedUser = await signupModel.findOne({email: req.body.email});

    if(existedUser) {
        res.render('outh', {
            error: "user exist",
            success: ""
        })
    }else{
        let hashedPass = bcrypt.hashSync(req.body.password, 12)
        
        let userObj = {
            ...req.body,
            password: hashedPass
        }

        let newUser = new signupModel(userObj);
        newUser.save()
        .then( () => {
            res.locals.success = "User has been added";
            res.redirect('/');
        })
        .catch( (err) => {
            throw err
        })
    }
}

const logIn = async (req, res) => {
    //Check if the user is already in the DB 
    let existedUser = await signupModel.findOne({email: req.body.email});
    
    if(!existedUser) {
     res.render('outh', {

         error : "user is not exist. So signup first please!",
         
     })
     }else{
     let isCorrectPass = bcrypt.compareSync(req.body.password, existedUser.password)
 
     if(!isCorrectPass){
      res.render('outh', {
             error : "user password is not correct"

         })  
     }else{
         let userToken = jwt.sign({existedUser}, process.env.JWT_TEXT);
         res.cookie("userToken", userToken, {httpOnly: true});
         res.redirect('/')
     }
     }
    }

const logOut = (req, res) => {
    res.clearCookie('userToken');
    res.redirect('/');
}  

module.exports = {
    homePage,
    loginUser,
    questionAddition,
    postQuestion,
    signUp,
    logIn,
    logOut,
    questionAdditionChat,
    postQuestionChatGPT,
    addAnswerToQuestion,
}