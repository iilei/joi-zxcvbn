# joi-zxcvbn password strength check

Validate Password complexity with Joi and zxcvbn

## Usage

```
npm install --save joi-zxcvbn
```

or 

```
yarn add joi-zxcvbn
```

```js
var joiZxcvbn = require('joi-zxcvbn')
var PlainJoi = require('joi');
var Joi = PlainJoi.extend(joiZxcvbn(PlainJoi));

var minimumScore = 3; // default - must in 0...4
var userInputs = ['janedoe', 'jane@doe.com']; // optional & best practice

Joi.string().min(4).zxcvbn(minimumScore, userInputs).validate('👍🐴🔋❤️', function (err) {
  console.log(err ? 'Invalid' : 'Valid')
})

```

Have a look at the `tests.js` to see how to parse its results. `feedback, score, calc_time` are
passed trough.

For configuration options, see [dropbox/zxcvbn](https://github.com/dropbox/zxcvbn#usage)
