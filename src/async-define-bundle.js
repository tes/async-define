var fs = require('fs');
var path = require('path');
var hb = require('handlebars');
var placeholder = '__placeholder__';
var MagicString = require( 'magic-string' );


var template = function (templ, str) {
  return templ.replace(placeholder, str);
}

var magicTemplate = function (magic, template){
  var fragments = template.split(placeholder);
  magic.prepend(fragments[0]);
  magic.append(fragments[1]);
  return magic;
}

function asyncDefineBundle(opts) {
  var fragment;
  var fragmentPath = opts.fragmentPath;
  var bundleName = opts.bundleName;
  var importVar = opts.importVar;
  var exportVar = opts.exportVar;
  var script = opts.script;
  var scriptName = opts.scriptName;
  var hasSourceMaps = opts.hasSourceMaps;

  var mainTemplate = '../templates/main.hbs';
  var templateStr = fs.readFileSync(path.join(__dirname, mainTemplate), {encoding: 'utf8'});

  var fragmentTmp;
  if (fragmentPath) {
    fragment = fs.readFileSync(fragmentPath, {encoding: 'utf8'});
    return template(templateStr, fragment);
  }
  else {
    fragmentTmp = fs.readFileSync(path.join(__dirname, '../templates/wrapper.hbs'), {encoding: 'utf8'});
    fragment = hb.compile(fragmentTmp)({
      bundleName: bundleName,
      importVar: importVar,
      exportVar: exportVar,
      depsArgs: Object.keys(importVar).map(function (item) { return importVar[item] ? '___' + item : item; }).join(' ,'),
      depsStr: Object.keys(importVar).map(function (item) {return '"' + item + '"';}).join(' ,')
    });

    var s = new MagicString(script);
    s = magicTemplate(s, fragment);
    s = magicTemplate(s, templateStr);

    var output = s.toString();
    if (hasSourceMaps) {
      var map = s.generateMap({
        source: scriptName,
        file: scriptName + '.map',
        includeContent: true
      }); // generates a v3 sourcemap
      output += '\n//# sourceMappingURL=' + map.toUrl();
    }
    return output;
  }


}

module.exports = asyncDefineBundle;
