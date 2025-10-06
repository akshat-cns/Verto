const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'single_choice', 'text'],
    default: 'multiple_choice'
  },
  options: [optionSchema],
  correctAnswer: {
    type: String, // stores option ID for multiple/single choice, or text for text answers
    required: true
  },
  maxLength: {
    type: Number,
    default: 300
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);