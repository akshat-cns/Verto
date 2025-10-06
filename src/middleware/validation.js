const validateQuestion = (req, res, next) => {
    const { text, type, options, correctAnswer } = req.body;
  
    if (!text || !type) {
      return res.status(400).json({ 
        error: 'Question text and type are required' 
      });
    }
  
    if ((type === 'multiple_choice' || type === 'single_choice') && (!options || options.length < 2)) {
      return res.status(400).json({ 
        error: 'Multiple/single choice questions require at least 2 options' 
      });
    }
  
    next();
  };
  
  module.exports = {
    validateQuestion
  };