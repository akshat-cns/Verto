const Quiz = require('../models/Quiz');

class QuizService {
 
  async createQuiz(quizData) {
    try {
      const quiz = new Quiz(quizData);
      return await quiz.save();
    } catch (error) {
      throw new Error(`Failed to create quiz: ${error.message}`);
    }
  }

  async addQuestion(quizId, questionData) {
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      this.validateQuestion(questionData);

      quiz.questions.push(questionData);
      return await quiz.save();
    } catch (error) {
      throw new Error(`Failed to add question: ${error.message}`);
    }
  }

  validateQuestion(question) {
    switch (question.type) {
      case 'multiple_choice':
      case 'single_choice':
        if (!question.options || question.options.length < 2) {
          throw new Error('Multiple/single choice questions must have at least 2 options');
        }
        if (!question.correctAnswer) {
          throw new Error('Correct answer is required for multiple/single choice questions');
        }
        
        const optionIds = question.options.map(opt => opt.id);
        if (!optionIds.includes(question.correctAnswer)) {
          throw new Error('Correct answer must match one of the option IDs');
        }
        break;

      case 'text':
        if (question.maxLength > 300) {
          throw new Error('Text answers cannot exceed 300 characters');
        }
        break;

      default:
        throw new Error('Invalid question type');
    }
  }

  // Get all questions for a quiz (without correct answers)
  async getQuizQuestions(quizId) {
    try {
      const quiz = await Quiz.findById(quizId).select('-questions.correctAnswer');
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      return quiz;
    } catch (error) {
      throw new Error(`Failed to fetch quiz questions: ${error.message}`);
    }
  }

  async submitAnswers(quizId, userAnswers) {
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      let score = 0;
      const results = [];

      for (const userAnswer of userAnswers) {
        const question = quiz.questions.id(userAnswer.questionId);
        if (!question) {
          throw new Error(`Question not found: ${userAnswer.questionId}`);
        }

        const isCorrect = this.checkAnswer(question, userAnswer.selectedOptionId);
        if (isCorrect) {
          score++;
        }

        results.push({
          questionId: userAnswer.questionId,
          correct: isCorrect
        });
      }

      return {
        score,
        total: quiz.questions.length,
        results
      };
    } catch (error) {
      throw new Error(`Failed to submit answers: ${error.message}`);
    }
  }

  checkAnswer(question, userAnswer) {
    switch (question.type) {
      case 'multiple_choice':
      case 'single_choice':
        return question.correctAnswer === userAnswer;
      case 'text':
        return question.correctAnswer.toLowerCase() === userAnswer.toLowerCase();
      default:
        return false;
    }
  }

  async getAllQuizzes() {
    try {
      return await Quiz.find({}, 'title description createdAt');
    } catch (error) {
      throw new Error(`Failed to fetch quizzes: ${error.message}`);
    }
  }

  async getQuizById(quizId) {
    try {
      return await Quiz.findById(quizId);
    } catch (error) {
      throw new Error(`Failed to fetch quiz: ${error.message}`);
    }
  }
}

module.exports = new QuizService();