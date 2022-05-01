import { query } from 'express-validator';

class NewsValidator {
  checkGetNewsQuery() {
    return [
      query('query').exists().withMessage('The query param is required'),
      query('publishedFrom')
        .optional()
        .isDate()
        .withMessage('The Published from is invalid '),
      query('publishedTill')
        .optional()
        .isDate()
        .withMessage('The Published from is invalid '),
      query('sort').isString().isIn(['popularity', 'relevancy', 'publishedAt']),
      query('page').optional().isNumeric(),
    ];
  }
}

export default new NewsValidator();
