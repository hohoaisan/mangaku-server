const express = require('express');
const { comicAuthorController, chapterAuthorController } = require('../../controllers');
const { comicValidation, comicAuthorValidation, chapterValidation } = require('../../validations');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const router = express.Router();
router
  .route('/comics')
  .get(auth(), validate(comicValidation.getComics), comicAuthorController.getComics)
  .post(auth(), validate(comicAuthorValidation.createComic), comicAuthorController.createComic);

router
  .route('/comics/:comicId')
  .get(auth(), validate(comicValidation.getComic), comicAuthorController.getComic)
  .patch(auth(), validate(comicAuthorValidation.updateComic), comicAuthorController.updateComic)
  .delete(auth(), validate(comicValidation.deleteComic), comicAuthorController.deleteComic);

router
  .route('/comics/:comicId/chapters')
  .get(auth(), validate(chapterValidation.getChapters), chapterAuthorController.getComicChapters)
  .post(auth(), validate(chapterValidation.createChapter), chapterAuthorController.createComicChapter);

router
  .route('/comics/:comicId/chapters/:chapterId')
  .get(auth(), validate(chapterValidation.getChapter), chapterAuthorController.getComicChapter)
  .patch(auth(), validate(chapterValidation.updateChapter), chapterAuthorController.updateComicChapter)
  .delete(auth(), validate(chapterValidation.deleteChapter), chapterAuthorController.deleteComicChapter);

module.exports = router;

module.exports = router;
