const zxcvbn = require('zxcvbn');

const DEFAULT_MIN_SCORE = 3;

const joiZxcvbn = (joi) => ({
  base: joi.string(),
  name: 'string',
  language: {
    zxcvbn: 'Password strength score {{!score}} does not suffice the minimum of {{!min}}',
  },
  rules: [
    {
      name: 'zxcvbn',
      params: {
        _minScore: joi.number().integer().min(0).max(4),
        _userInput: joi.array(),
      },

      validate(params, value, state, options) {
        const min = (typeof params._minScore === 'number') ? params._minScore : DEFAULT_MIN_SCORE;
        const result = zxcvbn(value || '', params._userInput);
        const { score, feedback, calc_time } = result;

        if (score >= min) {
          return value;
        }

        return this.createError('string.zxcvbn', {
          score,
          calc_time,
          feedback,
          min,
        }, state, options);
      },
    },
  ],
});

module.exports = joiZxcvbn;
