const question = require("../model/userModel");
const comment = require("../model/comment");
const moment = require("moment");

const getQuestionDetails = (req, res) => {
  question
    .findById(req.params.id)
    .populate('userId')
    .populate({path: 'comments', populate: {path: 'userId'}})
    .then((result) => {
      console.log(result)
      res.render("fullQuestionAndComments", {
        question: {
          ...result._doc,
          formattedDate: moment(result.createdAt).format("YYYY-MM-DD"),
        },
      });
    })
    .catch((err) => console.log(err));
};

//Edit question

const editQuestion = (req, res) => {
  question
    .findById(req.params.id)
    .then((result) => {
        if(res.locals.userId.toString() === result.userId.toString()) {
            res.render("editQuestion", {
                question: { ...result._doc },
              });        
        } else {
            res.redirect('/')
        }
    })
    .catch((err) => {
      res.render("404");
    });
};

const updateQuestion = (req, res) => {
  question
    .findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
      res.redirect(`/question/${result._id}`);
    })
    .catch((err) => console.log(err));
};

//delete question
const deleteQuestion = (req, res) => {
  question
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const addComment = (req, res) => {
  let newComment = new comment({
    ...req.body,
    questionId: req.params.id,
    userId: res.locals.userId
  });

  newComment
    .save()
    .then((result) => {
      question.findById(req.params.id).then((foundQuestion) => {
        foundQuestion.comments.push(result);
        foundQuestion.save().then(res.redirect(`/question/${req.params.id}`));
      });
    })
    .catch((err) => console.log(err));
};

//delete comment
const deleteComment = (req, res) => {
  comment.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect(`/question/${req.params.question}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getQuestionDetails,
  editQuestion,
  updateQuestion,
  deleteQuestion,
  addComment,
  deleteComment,
};
