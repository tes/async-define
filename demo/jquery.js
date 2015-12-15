var $ = require('jquery');
var asyncDefine = require('../lib/asyncDefine');

asyncDefine('jquery', function (){
  return $;
});
