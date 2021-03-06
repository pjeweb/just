var test = require('tape');
var curry = require('../../packages/function-curry');

test('returns a curried function', function (t) {
  t.plan(1);
  function converter(ratio, input) {
    return (input * ratio).toFixed(1);
  }
  var curriedConverter = curry(converter);
  var milesToKm = curriedConverter(1.62);
  t.equal(milesToKm(35), '56.7');
  t.end();
});

test('does not bind supplied arguments', function (t) {
  t.plan(3);
  function converter(ratio, input) {
    return (input * ratio).toFixed(1);
  }
  var milesToKm = curry(converter, 1.62);
  t.equal(typeof milesToKm(35), 'function');
  t.equal(milesToKm(1.62)(10), '16.2');
  t.equal(milesToKm(1.62, 10), '16.2');
  t.end();
});

test('still returns a function for zero-arity functions', function (t) {
  t.plan(2);
  function nothing() {}
  t.equal(typeof curry(nothing), 'function');
  t.equal(typeof curry(nothing, 1, 2, 3), 'function');
});

test('executes in the correct context', function (t) {
  t.plan(2);
  function converter(ratio, input) {
    return (input * ratio).toFixed(this.dps);
  }
  var milesToKm = curry(converter)(1.62);
  t.equal(milesToKm.call({dps: 0}, 35), '57');
  t.equal(milesToKm.call({dps: 2}, 35), '56.70');
  t.end();
});

test('converts n-ary function to a sequence of nested unary functions', function (t) {
  t.plan(4);
  function addThree(x, y, z) {
    return x + y + z;
  }
  var addTwoTo2 = curry(addThree)(2);
  t.equal(typeof addTwoTo2(3), 'function');
  t.equal(addTwoTo2(5)(8), 15);
  t.equal(addTwoTo2(13, 21), 36);
  t.equal(curry(addThree)(34)(55)(89), 178);
  t.end();
});
