#! /usr/bin/env node
var fs = require('fs');
var path = require('path');

var hb = require('handlebars');
var minimist = require('minimist');
var asyncDefineBundle = require('../src/async-define-bundle');
var argv = require('minimist')(process.argv.slice(2));


var fragmentPath = argv.fragment || argv.f;
var importVar = argv.import || argv.i;
var exportVar = argv.export || argv.e;
var bundleName = argv.name || argv.n;
var scriptPath = argv.script || argv.s;
var hasSourceMaps = argv.sourcemaps;

exportVar = exportVar ? exportVar.split(',') : [];
importVar = importVar ? createMap(importVar.split(',')) : {};

if (!fragmentPath && !scriptPath) {
  error('Please add a fragment or a script');
}

var script = scriptPath ? fs.readFileSync(scriptPath, {encoding: 'utf8'}) : '';
var scriptName = scriptPath ? path.basename(scriptPath) : '';

console.log(asyncDefineBundle({
  fragmentPath: fragmentPath,
  bundleName: bundleName,
  importVar: importVar,
  exportVar: exportVar,
  script: script,
  scriptName: scriptName,
  hasSourceMaps: typeof hasSourceMaps !== 'undefined',
}));

process.exit();

function error(msg) {
  console.error(msg);
  process.exit(1);
}

function createMap(arr) {
  return arr.map(function (item) {
    var out = {};
    var parts = item.split('.');
    out.key = parts[0];
    out.value = parts.slice(1).join('.');
    return out;
  })
  .reduce(function (obj, current) {
    if (current.value) {
      obj[current.key] = obj[current.key] ? obj[current.key].concat(current.value) : [current.value];
    }
    else {
      obj[current.key] = null;
    }
    return obj;
  }, {});
}
