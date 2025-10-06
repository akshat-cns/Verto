const quizService = require('../services/quizService');

const quizController = {
  async createQuiz(req, res) {
    try {
      const { title, description } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Quiz title is required' });
      }

      const quiz = await quizService.createQuiz({ title, description });
      res.status(201).json({
        message: 'Quiz created successfully',
        quiz: {
          id: quiz._id,
          title: quiz.title,
          description: quiz.description
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },


  async addQuestion(req, res) {
    try {
      const { quizId } = req.params;
      const questionData = req.body;

      const quiz = await quizService.addQuestion(quizId, questionData);
      
      const addedQuestion = quiz.questions[quiz.questions.length - 1];
      res.status(201).json({
        message: 'Question added successfully',
        question: {
          id: addedQuestion._id,
          text: addedQuestion.text,
          type: addedQuestion.type,
          options: addedQuestion.options
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getQuizQuestions(req, res) {
    try {
      const { quizId } = req.params;
      const quiz = await quizService.getQuizQuestions(quizId);
      
      res.json({
        quiz: {
          id: quiz._id,
          title: quiz.title,
          description: quiz.description
        },
        questions: quiz.questions.map(q => ({
          id: q._id,
          text: q.text,
          type: q.type,
          options: q.options,
          maxLength: q.maxLength
        }))
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  async submitAnswers(req, res) {
    try {
      const { quizId } = req.params;
      const { answers } = req.body;

      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Answers array is required' });
      }

      const result = await quizService.submitAnswers(quizId, answers);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllQuizzes(req, res) {
    try {
      const quizzes = await quizService.getAllQuizzes();
      res.json({ quizzes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getQuiz(req, res) {
    try {
      const { quizId } = req.params;
      const quiz = await quizService.getQuizById(quizId);
      
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      res.json({
        quiz: {
          id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          createdAt: quiz.createdAt,
          questionCount: quiz.questions.length
        }
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
};

module.exports = quizController;