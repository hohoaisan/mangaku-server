const enumRole = {
  USER: 'user',
  ADMIN: 'admin',
  MOD: 'mod',
  AUTHOR: 'author',
};

const allRoles = {
  [enumRole.USER]: [],
  [enumRole.ADMIN]: ['getUsers', 'manageUsers', 'manageAuthors', 'manageGenres', 'manageFormats', 'manageComics'],
  [enumRole.AUTHOR]: [],
  [enumRole.MOD]: ['getUsers', 'manageUsers', 'manageAuthors', 'manageGenres', 'manageFormats', 'manageComics'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
  enumRole,
};
