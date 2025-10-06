const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Quiz mgmt 
router.post('/', quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:quizId', quizController.getQuiz);

// Question mgmt 
router.post('/:quizId/questions', quizController.addQuestion);
router.get('/:quizId/questions', quizController.getQuizQuestions);

// Quiz taking 
router.post('/:quizId/submit', quizController.submitAnswers);

module.exports = router;