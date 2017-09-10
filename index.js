const Joi = require('joi');
const zxcvbn = require('zxcvbn');

const joiZxcvbn = joi => ({
  base: joi.string(),
  name: 'string',
  language: {
    zxcvbn: {
      base: 'Password strength score {{!score}} does not suffice the minimum of {{!min}}',
    },
  },
  rules: [
    {
      name: 'zxcvbn',
      params: {
        _minScore: Joi.number().integer().min(0).max(4),
        _userInputs: Joi.array(),
      },

      validate(params, value, state, options) {
        const min = params._minScore || 0;
        const userInputs = params._userInputs;
        const result = zxcvbn(value, userInputs);
        const { score } = result;

        if (score >= min) {
          return value;
        }

        return this.createError('string.zxcvbn.base', {
          score,
          min,
        }, state, options);
      },
    },
  ],
});

module.exports = joiZxcvbn;
