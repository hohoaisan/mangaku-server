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

author.belongsToMany(comic, { as: 'comic_comics', through: comicAuthor, foreignKey: 'author', otherKey: 'comic' });
chapter.belongsToMany(image, { as: 'image_image_pages', through: page, foreignKey: 'chapter', otherKey: 'image' });
chapter.belongsToMany(user, {
  as: 'user_user_read_histories',
  through: readHistory,
  foreignKey: 'chapter',
  otherKey: 'user',
});
comic.belongsToMany(author, { as: 'author_authors', through: comicAuthor, foreignKey: 'comic', otherKey: 'author' });
comic.belongsToMany(format, { as: 'format_formats', through: comicFormat, foreignKey: 'comic', otherKey: 'format' });
comic.belongsToMany(genre, { as: 'genre_genres', through: comicGenre, foreignKey: 'comic', otherKey: 'genre' });
comic.belongsToMany(image, { as: 'image_images', through: comicCover, foreignKey: 'comic', otherKey: 'image' });
comic.belongsToMany(user, { as: 'user_users', through: comment, foreignKey: 'comic', otherKey: 'user' });
comic.belongsToMany(user, { as: 'user_user_favorites', through: favorite, foreignKey: 'comic', otherKey: 'user' });
comic.belongsToMany(user, { as: 'user_user_reviews', through: review, foreignKey: 'comic', otherKey: 'user' });
format.belongsToMany(comic, {
  as: 'comic_comic_comic_formats',
  through: comicFormat,
  foreignKey: 'format',
  otherKey: 'comic',
});
genre.belongsToMany(comic, {
  as: 'comic_comic_comic_genres',
  through: comicGenre,
  foreignKey: 'genre',
  otherKey: 'comic',
});
image.belongsToMany(chapter, { as: 'chapter_chapters', through: page, foreignKey: 'image', otherKey: 'chapter' });
image.belongsToMany(comic, {
  as: 'comic_comic_comic_covers',
  through: comicCover,
  foreignKey: 'image',
  otherKey: 'comic',
});
user.belongsToMany(chapter, {
  as: 'chapter_chapter_read_histories',
  through: readHistory,
  foreignKey: 'user',
  otherKey: 'chapter',
});
user.belongsToMany(comic, { as: 'comic_comic_comments', through: comment, foreignKey: 'user', otherKey: 'comic' });
user.belongsToMany(comic, { as: 'comic_comic_favorites', through: favorite, foreignKey: 'user', otherKey: 'comic' });
user.belongsToMany(comic, { as: 'comic_comic_reviews', through: review, foreignKey: 'user', otherKey: 'comic' });
comicAuthor.belongsTo(author, { as: 'author_author', foreignKey: 'author' });
author.hasMany(comicAuthor, { as: 'comic_authors', foreignKey: 'author' });
page.belongsTo(chapter, { as: 'chapter_chapter', foreignKey: 'chapter' });
chapter.hasMany(page, { as: 'pages', foreignKey: 'chapter' });
readHistory.belongsTo(chapter, { as: 'chapter_chapter', foreignKey: 'chapter' });
chapter.hasMany(readHistory, { as: 'read_histories', foreignKey: 'chapter' });
chapter.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comic' });
comic.hasMany(chapter, { as: 'chapters', foreignKey: 'comic' });
comicAuthor.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comic' });
comic.hasMany(comicAuthor, { as: 'comic_authors', foreignKey: 'comic' });
comicCover.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comic' });
comic.hasMany(comicCover, { as: 'comic_covers', foreignKey: 'comic' });
comicFormat.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comic' });
comic.hasMany(comicFormat, { as: 'comic_formats', foreignKey: 'comic' });
comicGenre.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comic' });
comic.hasMany(comicGenre, { as: 'comic_genres', foreignKey: 'comic' });
comment.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comic' });
comic.hasMany(comment, { as: 'comments', foreignKey: 'comic' });
favorite.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comic' });
comic.hasMany(favorite, { as: 'favorites', foreignKey: 'comic' });
review.belongsTo(comic, { as: 'comic_comic', foreignKey: 'comic' });
comic.hasMany(review, { as: 'reviews', foreignKey: 'comic' });
comicFormat.belongsTo(format, { as: 'format_format', foreignKey: 'format' });
format.hasMany(comicFormat, { as: 'comic_formats', foreignKey: 'format' });
comicGenre.belongsTo(genre, { as: 'genre_genre', foreignKey: 'genre' });
genre.hasMany(comicGenre, { as: 'comic_genres', foreignKey: 'genre' });
comicCover.belongsTo(image, { as: 'image_image', foreignKey: 'image' });
image.hasMany(comicCover, { as: 'comic_covers', foreignKey: 'image' });
page.belongsTo(image, { as: 'image_image', foreignKey: 'image' });
image.hasMany(page, { as: 'pages', foreignKey: 'image' });
author.belongsTo(user, { as: 'user', foreignKey: 'userId' });
user.hasMany(author, { as: 'authors', foreignKey: 'userId' });
comment.belongsTo(user, { as: 'user_user', foreignKey: 'user' });
user.hasMany(comment, { as: 'comments', foreignKey: 'user' });
favorite.belongsTo(user, { as: 'user_user', foreignKey: 'user' });
user.hasMany(favorite, { as: 'favorites', foreignKey: 'user' });
image.belongsTo(user, { as: 'uploader_user', foreignKey: 'uploader' });
user.hasMany(image, { as: 'images', foreignKey: 'uploader' });
readHistory.belongsTo(user, { as: 'user_user', foreignKey: 'user' });
user.hasMany(readHistory, { as: 'read_histories', foreignKey: 'user' });
review.belongsTo(user, { as: 'user_user', foreignKey: 'user' });
user.hasMany(review, { as: 'reviews', foreignKey: 'user' });
token.belongsTo(user, { as: 'user_user', foreignKey: 'user' });
user.hasMany(token, { as: 'tokens', foreignKey: 'user' });

module.exports = sequelize;

// (async () => {
//   await token.sync();
//   await user.sync();
//   await author.sync({ alter: true, force: true });
//   await chapter.sync({ alter: true, force: true });
//   await comic.sync({ alter: true, force: true });
//   await comicAuthor.sync({ alter: true, force: true });
//   await comicCover.sync({ alter: true, force: true });
//   await comicFormat.sync({ alter: true, force: true });
//   await comicGenre.sync({ alter: true, force: true });
//   await comment.sync({ alter: true, force: true });
//   await favorite.sync({ alter: true, force: true });
//   await format.sync({ alter: true, force: true });
//   await genre.sync({ alter: true, force: true });
//   await image.sync({ alter: true, force: true });
//   await page.sync({ alter: true, force: true });
//   await readHistory.sync({ alter: true, force: true });
//   await review.sync({ alter: true, force: true });
// })();
