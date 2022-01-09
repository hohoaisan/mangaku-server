const express = require('express');
const validate = require('../../middlewares/validate');
const { comicValidation, chapterValidation, commentValidation } = require('../../validations');
const { comicController, chapterController, commentController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(comicValidation.createComic), comicController.createComic)
  .get(auth({ anonymous: true }), validate(comicValidation.getComics), comicController.getComics);

router
  .route('/:comicId')
  .get(auth({ anonymous: true }), validate(comicValidation.getComic), comicController.getComic)
  .patch(auth('manageComics'), validate(comicValidation.updateComic), comicController.updateComic)
  .delete(auth('manageComics'), validate(comicValidation.deleteComic), comicController.deleteComic);

router
  .route('/:comicId/chapters')
  .get(auth({ anonymous: true }), validate(chapterValidation.getChapters), chapterController.getComicChapters)
  .post(auth('manageComics'), validate(chapterValidation.createChapter), chapterController.createComicChapter);

router
  .route('/:comicId/chapters/:chapterId')
  .get(auth({ anonymous: true }), validate(chapterValidation.getChapter), chapterController.getComicChapter)
  .patch(auth('manageComics'), validate(chapterValidation.updateChapter), chapterController.updateComicChapter)
  .delete(auth('manageComics'), validate(chapterValidation.deleteChapter), chapterController.deleteComicChapter);

router
  .route('/:comicId/comments')
  .get(auth({ anonymous: true }), validate(commentValidation.getComments), commentController.getComments)
  .post(auth(), validate(commentValidation.createComment), commentController.createComment);

router
  .route('/:comicId/comments/:commentId')
  .get(commentController.getComment)
  .patch(auth(), validate(commentValidation.updateComment), commentController.updateComment)
  .delete(auth(), validate(commentValidation.deleteComment), commentController.deleteComment);

module.exports = router;
