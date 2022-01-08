const _ = require('lodash');

const flatComic = (comic, attributeToRemove = []) => {
  const flattenComic = comic.toJSON ? comic.toJSON() : comic;
  if (flattenComic.covers && Array.isArray(flattenComic.covers)) {
    // flat the cover.comicCover.default object to cover.default
    flattenComic.covers = flattenComic.covers.map(({ id, url, comicCover }) => ({
      id,
      url,
      ...(comicCover && comicCover.toJSON ? comicCover.toJSON() : comicCover),
    }));

    // add the cover field is the url of default cover
    const defaultCover = flattenComic.covers.find((cover) => cover.default);
    flattenComic.cover = defaultCover && defaultCover.url;
  }
  if (flattenComic.covers && !Array.isArray(flattenComic.covers) && flattenComic.covers.id) {
    flattenComic.cover = flattenComic.covers.url;
  }
  // remove the comic.covers attribute
  return _.omit(flattenComic, attributeToRemove);
};

const flatChapterPage = (page, attributeToRemove = []) => {
  let flattenPage = page.toJSON ? page.toJSON() : page;

  flattenPage.url = flattenPage.image && flattenPage.image.url;
  // remove the comic.covers attribute
  flattenPage = _.omit(flattenPage, ['image', ...attributeToRemove]);

  return flattenPage;
};

// {chaper} <Chapter>
// options.attributeToRemove: String[]
// options.lastedReadChaperId: String

const flatChapter = (chapter, options = {}) => {
  let flattenChapter = chapter.toJSON ? chapter.toJSON() : chapter;
  if (flattenChapter.read_histories && flattenChapter.read_histories.length) {
    const [firstItem] = flattenChapter.read_histories;
    flattenChapter.lastRead = firstItem.lastRead;
    flattenChapter.isLastedRead = options.lastedReadChaperId === flattenChapter.id;
  }
  flattenChapter = _.omit(flattenChapter, ['read_histories', ...(options.attributeToRemove || [])]);
  return flattenChapter;
};
module.exports = {
  flatComic,
  flatChapterPage,
  flatChapter,
};
