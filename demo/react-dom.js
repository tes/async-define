var ReactDOM = require('react-dom');
var asyncDefine = require('../lib/asyncDefine');

asyncDefine('react-dom', function (){
  return ReactDOM;
});
