const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'manageAuthors', 'manageGenres', 'manageFormats', 'manageComics'],
  author: [],
  mod: ['getUsers', 'manageUsers', 'manageAuthors', 'manageGenres', 'manageFormats'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
