const test = require('tape');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

let Joi = require('joi');

const zxcvbnSpy = sinon.stub();
zxcvbnSpy.returns({ score: 3 });
zxcvbnSpy.withArgs('jondoe', ['jondoe']).returns({ score: 0 });
zxcvbnSpy.withArgs('hello').returns({ score: 3 });

const joiZxcvbn = proxyquire('./', {
  zxcvbn: zxcvbnSpy,
});

Joi = Joi.extend(joiZxcvbn(Joi));

test('Should implement zxcvbn', (t) => {
  t.plan(2);
  const result = Joi.string().zxcvbn().validate(' ');
  t.error(result.error);
  t.equal(zxcvbnSpy.firstCall.args[0], ' ');
  t.end();
});

test('Should fail if empty string', (t) => {
  t.plan(1);
  const result = Joi.string().zxcvbn().validate('');
  t.ok(result.error);
  t.end();
});

test('Should pass if score is good', (t) => {
  t.plan(2);
  const result = Joi.string().zxcvbn(0, ['jondoe']).validate('jondoe');
  t.error(result.error);
  t.equal(result.value, 'jondoe');
  t.end();
});

test('Should throw an error if score is bad', (t) => {
  t.plan(1);
  const result = Joi.string().zxcvbn(4).validate('hello');
  t.ok(result.error);
  t.end();
});
