import logger from '../utils/logger.js';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    logger.warn(`Validation error: ${errorMessage}`);
    return res.status(400).json({ message: errorMessage });
  }

  next();
};

export default validate;
