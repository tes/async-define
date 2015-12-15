(function (w){

  var queue = this._async_define_queue = '_async_define_queue' in this ? this._async_define_queue : [];
  var cached_dependencies = this._async_define_cached_dependencies = '_async_define_cached_dependencies' in this ? this._async_define_cached_dependencies : {};

  function getDepsArray(depNames) {
    var i,
      len = depNames.length,
      deps = [];
    for (i = 0; i < len; i++){
      if (depNames[i] in cached_dependencies){
        deps.push(cached_dependencies[depNames[i]]);
      }
      else {
        return;
      }
    }
    return deps;
  }

  function runThroughQueue() {
    while (_runThroughQueue());
  }

  function _runThroughQueue() {
    var i = 0;
    var solvedDependency = false;
    while (i < queue.length){
      if (execute(queue[i])){
        if (queue[i].name){
          solvedDependency = true;
        }
        queue.splice(i, 1);
      }
      else {
        i++;
      }
    }
    return solvedDependency;
  }

  function execute (item){
    var deps = getDepsArray(item.depNames);
    var exp;
    if (deps){
      exp = item.func.apply(w, deps);
      if (item.name){
        cached_dependencies[item.name] = exp;
      }
      return true;
    }
    else {
      return;
    }
  }

  function wrapObj (o){
    if (typeof o === 'function'){
      return o;
    }
    else {
      return function (){
        return o;
      };
    }
  }

  function asyncDefine() {
    var item = {
        name:  typeof arguments[0] === 'string' ? arguments[0] : undefined,
        depNames: Array.isArray(arguments[0]) ? arguments[0] : Array.isArray(arguments[1]) ? arguments[1] : [],
        func: wrapObj(arguments[arguments.length - 1])
    };
    if (!execute(item)){
      queue.push(item);
    }
    else {
      if (item.name){
        runThroughQueue(); // executed straight away, try to resolve func that depends on this
      }
    }
  }

  if (typeof exports === 'object'){
    module.exports = asyncDefine;
  }
  else{
    w.asyncDefine = asyncDefine;
  }
}(this));
