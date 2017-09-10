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

Joi.emoji().validate('🙊 🙈 🙉', function (err) {
  console.log(err ? 'Invalid' : 'Valid')
})


```

## Credits

Thanks to

 *  [dropbox/zxcvbn](https://github.com/dropbox/zxcvbn)
