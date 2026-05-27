const crypto = require('crypto');

exports.generateCode = (prefix = 'CODE', length = 6) => {
  const randomChars = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
  return `${prefix}-${randomChars}`;
};
