var asyncDefine = require('../lib/asyncDefine');
var assert = require('chai').assert;

describe("asyncDefine", function () {

  it("is defined", function () {
    assert.isDefined(asyncDefine);
  });

  it("is a function", function () {
    assert.equal(typeof asyncDefine, 'function');
  });

  it("must work with a chain of 2 nodes", function (done) {
    setTimeout(function (){
      asyncDefine("hello", function (){
        return "hello";
      });
    }, 100);

    setTimeout(function (){
      asyncDefine("world", ["hello"], function (hello){
        assert.equal(hello, 'hello');
        done();
        return hello + " world";
      });
    }, 50);
  });

  it("must work with a graph of 4 nodes", function (done) {
    setTimeout(function (){
      asyncDefine("a", function (){
        return "a";
      });
    }, 100);

    setTimeout(function (){
      asyncDefine("b", function (){
        return "b";
      });
    }, 50);

    setTimeout(function (){
      asyncDefine("c", ['a'], function (a){
        assert.equal(a, 'a');
        return "c";
      });
    }, 75);

    setTimeout(function (){
      asyncDefine("d", ['a', 'b', 'c'], function (a, b, c){
        assert.equal(a, 'a');
        assert.equal(b, 'b');
        assert.equal(c, 'c');
        done();
        return "d";
      });
    }, 60);

  });

  it("mustn't execute the same dep twice", function (done) {
    var counter = 0;
    setTimeout(function (){
      asyncDefine("duplicated", function (){
        counter++;
        return "duplicated1";
      });
    }, 10);

    setTimeout(function (){
      asyncDefine("duplicated", function (hello){
        counter++;
        return "duplicated2";
      });
    }, 20);

    setTimeout(function (){
      assert.equal(counter, 1);
      done();
    }, 50);
  });
});

it("should unpack variables from a namespace", function (done) {
  setTimeout(function (){
    asyncDefine("greetings", function (){
      return {
        day: "good morning",
        night: "good night"
      };
    });
  }, 100);

  setTimeout(function (){
    asyncDefine(["greetings|day"], function (hello){
      assert.equal(hello, 'good morning');
      done();
      return hello + " world";
    });
  }, 50);
});
