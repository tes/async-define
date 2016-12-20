(function (cb){
  var w;
  try {
    w = window;
  } catch (e) {
    w = global;
  }

  var queue = w._async_define_queue = '_async_define_queue' in w ? w._async_define_queue : [];
  var cached_dependencies = w._async_define_cached_dependencies = '_async_define_cached_dependencies' in w ? w._async_define_cached_dependencies : {};

  function getDepsArray(depNames) {
    var i,
      tmp, depNS, depProp,
      len = depNames.length,
      deps = [];

    for (i = 0; i < len; i++) {
      tmp = depNames[i].split('|');
      depNS = tmp[0];
      depProp = tmp[1];
      if (depNS in cached_dependencies){
        deps.push(depProp ? cached_dependencies[depNS][depProp] : cached_dependencies[depNS]);
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
    if (item.name in cached_dependencies) { // don't execute twice
      return true;
    }
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

  function ad() {
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
  cb.call(w, ad);
}(function (define) {
  if (typeof exports === 'object'){
  module.exports = define;
}
else{
  this.asyncDefine = define;
}

}));

