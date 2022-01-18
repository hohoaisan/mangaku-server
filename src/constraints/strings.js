module.exports = {
  common: {
    errors: {
      notFound: 'Not found',
      noPerm: "You don't have permission to do that",
    },
  },
  auth: {
    errors: {
      invalidToken: 'Invalid token type',
      tokenExpired: 'Token expired',
      alreadyVerifedUser: 'User is already verified',
      unauthorized: 'Please authenticate',
      incorrectAuth: 'Incorrect email or password',
      passwordResetFailed: 'Password reset failed',
      emailVerifyFailed: 'Email verification failed',
    },
  },
  author: {
    errors: {
      notFound: 'Author not found or had been deleted',
      mustBeAuthor: 'Must be an author to do that',
      restricted: 'You are restricted',
      alreadyAuthor: 'You have already become an author',
      mustBeUser: 'Must be an user to become author',
      alreadyRegister: 'You are aleady registered to become an author',
    },
  },
  chapter: {
    errors: {
      notFound: 'Chapter not found or had been deleted',
      notBelongComic: 'Chapter not found or does not belong to comic',
    },
  },
  comic: {
    errors: {
      notFound: 'Comic not found or had been deleted',
    },
  },
  comment: {
    errors: {
      notFound: 'Comment not found or had been deleted',
    },
  },
  favorite: {
    errors: {
      notFavorited: `This comic haven't in favorites list yet`,
    },
  },
  format: {
    errors: {
      keyExist: 'Format key has already existed',
      notFound: 'Format not found or had been deleted',
    },
  },
  genre: {
    errors: {
      keyExist: 'Genre key has already existed',
      notFound: 'Genre not found or had been deleted',
    },
  },
  history: {
    errors: {
      notInHistory: `User haven't read this comic`,
      notFound: 'Comic not found',
    },
  },
  review: {
    errors: {
      notFound: 'Review not found',
      alreadyReviewed: 'You have reviewed this comic',
    },
  },
};
