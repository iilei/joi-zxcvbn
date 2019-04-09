const test = require('tape');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

let Joi = require('joi');

const zxcvbnSpy = sinon.stub();

zxcvbnSpy.returns({ score: 0 });
zxcvbnSpy.withArgs('jondoe').returns({ score: 2 });
zxcvbnSpy.withArgs('jondoe', ['jondoe']).returns({ score: 1 });
zxcvbnSpy.withArgs('pass-scores-0').returns({ score: 0 });
zxcvbnSpy.withArgs('pass-scores-1').returns({ score: 1 });
zxcvbnSpy.withArgs('pass-scores-2').returns({ score: 2 });
zxcvbnSpy.withArgs('pass-scores-3').returns({ score: 3 });
zxcvbnSpy.withArgs('pass-scores-4').returns({ score: 4 });

zxcvbnSpy.withArgs('gimme-feedback').returns({ score: 3, calc_time: 5, feedback: { suggestions: ['something'] } });

const joiZxcvbn = proxyquire('./index', {
  zxcvbn: zxcvbnSpy,
});


Joi = Joi.extend(joiZxcvbn(Joi));

test('Should implement zxcvbn', (t) => {
  t.plan(1);
  Joi.string().zxcvbn().validate('foo');
  t.equal(zxcvbnSpy.firstCall.args[0], 'foo');
  t.end();
});

test('Should extend string validation', (t) => {
  t.plan(1);
  const result = Joi.string().min(4).zxcvbn().validate('foo');
  t.ok(result.error);
  t.end();
});


test('return the value', (t) => {
  t.plan(1);
  const result = Joi.string().zxcvbn().validate('hello');
  t.equal(result.value, 'hello');
  t.end();
});

test('Should validate against a default minimum score of 3', (t) => {
  t.plan(3);

  const results = [];

  results.push(Joi.string().zxcvbn().validate('pass-scores-2'));
  results.push(Joi.string().zxcvbn().validate('pass-scores-3'));
  results.push(Joi.string().zxcvbn().validate('pass-scores-4'));

  t.ok(results[0].error);
  t.error(results[1].error);
  t.error(results[2].error);

  t.end();
});

test('Should pass userInput', (t) => {
  t.plan(2);

  const results = [];

  results.push(Joi.string().zxcvbn(2).validate('jondoe'));
  results.push(Joi.string().zxcvbn(2, ['jondoe']).validate('jondoe'));

  t.error(results[0].error);
  t.ok(results[1].error);

  t.end();
});

test('Should pass feedback, score and calc_time', (t) => {
  t.plan(5);

  const result = Joi.string().zxcvbn(4).validate('gimme-feedback');
  const details = result.error.details[0];

  t.ok(result.error);
  t.ok(details.message.indexOf('Password strength score 3 does not suffice the minimum of 4'));
  t.equal(details.context.score, 3);
  t.equal(details.context.calcTime, 5);
  t.equal(details.context.feedback.suggestions[0], 'something');

  t.end();
});
