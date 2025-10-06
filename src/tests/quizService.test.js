const mongoose = require('mongoose');
const quizService = require('../services/quizService');
const Quiz = require('../models/Quiz');


jest.setTimeout(30000);

describe('Quiz Service', () => {
  let testQuiz;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });  

  beforeEach(async () => {
    await Quiz.deleteMany({});
    
    testQuiz = await quizService.createQuiz({
      title: 'Test Quiz',
      description: 'A test quiz'
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('createQuiz', () => {
    it('should create a new quiz', async () => {
      const quizData = {
        title: 'JavaScript Basics',
        description: 'Test your JavaScript knowledge'
      };

      const quiz = await quizService.createQuiz(quizData);

      expect(quiz.title).toBe(quizData.title);
      expect(quiz.description).toBe(quizData.description);
      expect(quiz.questions).toHaveLength(0);
    });
  });

  describe('addQuestion', () => {
    it('should add a multiple choice question to quiz', async () => {
      const questionData = {
        text: 'What is 2+2?',
        type: 'multiple_choice',
        options: [
          { id: '1', text: '3' },
          { id: '2', text: '4' },
          { id: '3', text: '5' }
        ],
        correctAnswer: '2'
      };

      const quiz = await quizService.addQuestion(testQuiz._id, questionData);
      
      expect(quiz.questions).toHaveLength(1);
      expect(quiz.questions[0].text).toBe(questionData.text);
      expect(quiz.questions[0].type).toBe(questionData.type);
    });

    it('should validate question data', async () => {
      const invalidQuestionData = {
        text: 'Invalid question',
        type: 'multiple_choice',
        options: [{ id: '1', text: 'Only one option' }],
        correctAnswer: '2'
      };

      await expect(
        quizService.addQuestion(testQuiz._id, invalidQuestionData)
      ).rejects.toThrow();
    });
  });

  describe('submitAnswers', () => {
    beforeEach(async () => {
      await quizService.addQuestion(testQuiz._id, {
        text: 'What is 2+2?',
        type: 'multiple_choice',
        options: [
          { id: '1', text: '3' },
          { id: '2', text: '4' },
          { id: '3', text: '5' }
        ],
        correctAnswer: '2'
      });

      await quizService.addQuestion(testQuiz._id, {
        text: 'What is 3+3?',
        type: 'multiple_choice',
        options: [
          { id: '1', text: '5' },
          { id: '2', text: '6' },
          { id: '3', text: '7' }
        ],
        correctAnswer: '2'
      });
    });

    it('should calculate correct score', async () => {
      const answers = [
        { questionId: (await Quiz.findById(testQuiz._id)).questions[0]._id, selectedOptionId: '2' },
        { questionId: (await Quiz.findById(testQuiz._id)).questions[1]._id, selectedOptionId: '2' }
      ];

      const result = await quizService.submitAnswers(testQuiz._id, answers);

      expect(result.score).toBe(2);
      expect(result.total).toBe(2);
    });

    it('should calculate partial score', async () => {
      const answers = [
        { questionId: (await Quiz.findById(testQuiz._id)).questions[0]._id, selectedOptionId: '2' },
        { questionId: (await Quiz.findById(testQuiz._id)).questions[1]._id, selectedOptionId: '1' }
      ];

      const result = await quizService.submitAnswers(testQuiz._id, answers);

      expect(result.score).toBe(1);
      expect(result.total).toBe(2);
    });
  });
});