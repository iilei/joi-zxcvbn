# joi-zxcvbn

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

Joi.zxcvbn(minimumScore, userInputs).validate('👍🐴🔋❤️', function (err) {
  console.log(err ? 'Invalid' : 'Valid')
})

```

For configuration options, see [dropbox/zxcvbn](https://github.com/dropbox/zxcvbn#usage)
