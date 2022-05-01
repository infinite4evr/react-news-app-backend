import express from 'express';
import NewsValidator from '../validator';
import Middleware from '../../middleware';
import NewsController from '../controller';

const router = express.Router();

router.get(
  '/news',
  NewsValidator.checkGetNewsQuery(),
  Middleware.handleValidationError,
  NewsController.get,
);

export default router;
