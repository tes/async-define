var fs = require('fs');
var path = require('path');
var hb = require('handlebars');

function asyncDefineBundle(opts) {
  var fragmentPath = opts.fragmentPath;
  var bundleName = opts.bundleName;
  var importVar = opts.importVar;
  var exportVar = opts.exportVar;
  var script = opts.script;
  var minified = opts.minified;

  var mainTemplate = minified ? '../templates/main-min.hbs' : '../templates/main.hbs';
  var templateStr = fs.readFileSync(path.join(__dirname, mainTemplate), {encoding: 'utf8'});
  var template = function (str) {
    return templateStr.replace('asyncDefine()', str);
  }

  var fragmentTmp;
  if (!fragmentPath) {
    fragmentTmp = fs.readFileSync(path.join(__dirname, '../templates/wrapper.hbs'), {encoding: 'utf8'});
  }
  else {
    fragmentTmp = fs.readFileSync(fragmentPath, {encoding: 'utf8'});
  }


  var fragment = hb.compile(fragmentTmp)({
    bundleName: bundleName,
    importVar: importVar,
    exportVar: exportVar,
    script: script,
    depsArgs: Object.keys(importVar).map(function (item) { return importVar[item] ? '___' + item : item; }).join(' ,'),
    depsStr: Object.keys(importVar).map(function (item) {return '"' + item + '"';}).join(' ,')
  });

  return template(fragment);

}

module.exports = asyncDefineBundle;
