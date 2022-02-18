const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const { dialect, database, username, password, host } = config.sequelize;

const _token = require('./token');
const _user = require('./user');
const _author = require('./author');
const _chapter = require('./chapter');
const _comic = require('./comic');
const _comicAuthor = require('./comicAuthor');
const _comicCover = require('./comicCover');
const _comicFormat = require('./comicFormat');
const _comicGenre = require('./comicGenre');
const _comment = require('./comment');
const _favorite = require('./favorite');
const _format = require('./format');
const _genre = require('./genre');
const _image = require('./image');
const _page = require('./page');
const _readHistory = require('./readHistory');
const _review = require('./review');
const _statistic = require('./statistic');

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

const token = _token.init(sequelize, DataTypes);
const user = _user.init(sequelize, DataTypes);
const author = _author.init(sequelize, DataTypes);
const chapter = _chapter.init(sequelize, DataTypes);
const comic = _comic.init(sequelize, DataTypes);
const comicAuthor = _comicAuthor.init(sequelize, DataTypes);
const comicCover = _comicCover.init(sequelize, DataTypes);
const comicFormat = _comicFormat.init(sequelize, DataTypes);
const comicGenre = _comicGenre.init(sequelize, DataTypes);
const comment = _comment.init(sequelize, DataTypes);
const favorite = _favorite.init(sequelize, DataTypes);
const format = _format.init(sequelize, DataTypes);
const genre = _genre.init(sequelize, DataTypes);
const image = _image.init(sequelize, DataTypes);
const page = _page.init(sequelize, DataTypes);
const readHistory = _readHistory.init(sequelize, DataTypes);
const review = _review.init(sequelize, DataTypes);
_statistic.init(sequelize, DataTypes);

author.belongsToMany(comic, { as: 'comics', through: comicAuthor, foreignKey: 'authorId', otherKey: 'comicId' });
chapter.belongsToMany(image, { as: 'image_image_pages', through: page, foreignKey: 'chapterId', otherKey: 'imageId' });
chapter.belongsToMany(user, {
  as: 'user_user_read_histories',
  through: readHistory,
  foreignKey: 'chapterId',
  otherKey: 'userId',
});
comic.belongsToMany(author, { as: 'authors', through: comicAuthor, foreignKey: 'comicId', otherKey: 'authorId' });
comic.belongsToMany(format, { as: 'formats', through: comicFormat, foreignKey: 'comicId', otherKey: 'formatId' });
comic.belongsToMany(genre, { as: 'genres', through: comicGenre, foreignKey: 'comicId', otherKey: 'genreId' });
comic.belongsToMany(image, { as: 'covers', through: comicCover, foreignKey: 'comicId', otherKey: 'imageId' });
comic.belongsToMany(user, { as: 'user_user_favorites', through: favorite, foreignKey: 'comicId', otherKey: 'userId' });
comic.belongsToMany(user, { as: 'user_user_reviews', through: review, foreignKey: 'comicId', otherKey: 'userId' });
format.belongsToMany(comic, {
  as: 'comic_comic_comic_formats',
  through: comicFormat,
  foreignKey: 'formatId',
  otherKey: 'comicId',
});
genre.belongsToMany(comic, {
  as: 'comic_comic_comic_genres',
  through: comicGenre,
  foreignKey: 'genreId',
  otherKey: 'comicId',
});
image.belongsToMany(chapter, { as: 'chapter_chapters', through: page, foreignKey: 'imageId', otherKey: 'chapterId' });
image.belongsToMany(comic, {
  as: 'comic_comic_comic_covers',
  through: comicCover,
  foreignKey: 'imageId',
  otherKey: 'comicId',
});
user.belongsToMany(chapter, {
  as: 'chapter_chapter_read_histories',
  through: readHistory,
  foreignKey: 'userId',
  otherKey: 'chapterId',
});
user.belongsToMany(comic, { as: 'comic_comic_favorites', through: favorite, foreignKey: 'userId', otherKey: 'comicId' });
user.belongsToMany(comic, { as: 'comic_comic_reviews', through: review, foreignKey: 'userId', otherKey: 'comicId' });
comicAuthor.belongsTo(author, { as: 'author_author', foreignKey: 'authorId' });
author.hasMany(comicAuthor, { as: 'comic_authors', foreignKey: 'authorId' });
page.belongsTo(chapter, { as: 'chapter_chapter', foreignKey: 'chapterId' });
chapter.hasMany(page, { as: 'pages', foreignKey: 'chapterId' });
readHistory.belongsTo(chapter, { as: 'chapter', foreignKey: 'chapterId' });
chapter.hasMany(readHistory, { as: 'read_histories', foreignKey: 'chapterId' });
chapter.belongsTo(comic, { as: 'comic', foreignKey: 'comicId' });
comic.hasMany(chapter, { as: 'chapters', foreignKey: 'comicId' });
comicAuthor.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comicId' });
comic.hasMany(comicAuthor, { as: 'comic_authors', foreignKey: 'comicId' });
comicCover.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comicId' });
comic.hasMany(comicCover, { as: 'comic_covers', foreignKey: 'comicId' });
comicFormat.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comicId' });
comic.hasMany(comicFormat, { as: 'comic_formats', foreignKey: 'comicId' });
comicGenre.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comicId' });
comic.hasMany(comicGenre, { as: 'comic_genres', foreignKey: 'comicId' });
comment.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comicId' });
comic.hasMany(comment, { as: 'comments', foreignKey: 'comicId' });
favorite.belongsTo(comic, { as: 'comic', foreignKey: 'comicId' });
comic.hasMany(favorite, { as: 'favorites', foreignKey: 'comicId' });
review.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comicId' });
comic.hasMany(review, { as: 'reviews', foreignKey: 'comicId' });
comicFormat.belongsTo(format, { as: 'format_format', foreignKey: 'formatId' });
format.hasMany(comicFormat, { as: 'comic_formats', foreignKey: 'formatId' });
comicGenre.belongsTo(genre, { as: 'genre_genre', foreignKey: 'genreId' });
genre.hasMany(comicGenre, { as: 'comic_genres', foreignKey: 'genreId' });
comicCover.belongsTo(image, { as: 'image_image', foreignKey: 'imageId' });
image.hasMany(comicCover, { as: 'comic_covers', foreignKey: 'imageId' });
page.belongsTo(image, { as: 'image', foreignKey: 'imageId' });
image.hasMany(page, { as: 'pages', foreignKey: 'imageId' });
author.belongsTo(user, { as: 'user', foreignKey: 'userId' });
user.hasMany(author, { as: 'authors', foreignKey: 'userId' });
comment.belongsTo(user, { as: 'user', foreignKey: 'userId' });
user.hasMany(comment, { as: 'comments', foreignKey: 'userId' });
favorite.belongsTo(user, { as: 'user_user', foreignKey: 'userId' });
user.hasMany(favorite, { as: 'favorites', foreignKey: 'userId' });
image.belongsTo(user, { as: 'uploader_user', foreignKey: 'uploader' });
user.hasMany(image, { as: 'images', foreignKey: 'uploader' });
readHistory.belongsTo(user, { as: 'user_user', foreignKey: 'userId' });
user.hasMany(readHistory, { as: 'read_histories', foreignKey: 'userId' });
review.belongsTo(user, { as: 'user_user', foreignKey: 'userId' });
user.hasMany(review, { as: 'reviews', foreignKey: 'userId' });
token.belongsTo(user, { as: 'user_user', foreignKey: 'user' });
user.hasMany(token, { as: 'tokens', foreignKey: 'user' });

module.exports = sequelize;

(async () => {
  // await token.sync();
  // await user.sync();
  // await author.sync({ force: true });
  // await chapter.sync({ force: true });
  // await comic.sync({ force: true });
  // await comicAuthor.sync({ force: true });
  // await comicCover.sync({ force: true });
  // await comicFormat.sync({ force: true });
  // await comicGenre.sync({ force: true });
  // await comment.sync({ force: true });
  // await favorite.sync({ force: true });
  // await format.sync({ force: true });
  // await genre.sync({ force: true });
  // await image.sync({ force: true });
  // await page.sync({ force: true });
  // await readHistory.sync({ force: true });
  // await review.sync({ force: true });
})();
