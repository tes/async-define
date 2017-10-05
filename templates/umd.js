if (typeof exports === 'object'){
  define.importExternal = importExternal;
  module.exports = define;
}
else{
  this.asyncDefine = define;
  this.importExternal = importExternal;
}
