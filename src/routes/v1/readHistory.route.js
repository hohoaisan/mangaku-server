const express = require('express');
const historyController = require('../../controllers/history.controller');
const auth = require('../../middlewares/auth');
const { historyValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.route('/').get(validate(historyValidation.getAllComicHistory), auth(), historyController.getComicReadHistories);

router
  .route('/:comicId')
  .get(validate(historyValidation.getComicLastRead), auth(), historyController.getComicLastRead)
  .delete(validate(historyValidation.deleteComicHistory), auth(), historyController.deleteComicReadHistory);

router
  .route('/:comicId/chapters/:chapterId')
  .post(
    validate(historyValidation.createComicChapterRead),
    auth({ anonymous: true }),
    historyController.createorUpdateChapterHistory
  );

module.exports = router;
