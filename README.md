asyncDefine
===========
asyncDefine is a simple function that coordinates the execution of aynchronous scripts.

The issue
---------
Sometime you want to split a script in more than one bundle. For caching for example, or for sharing a common library between two or more scripts running in the same page.
What you can easily do is this:
```html
<script src="script1.js"></script>
<script src="script2.js"></script>
```
This works of course but with a couple of problems:

* script1 needs to expose something in the global namespace or script2 won't be able to see script1
* you are forced to load script1 synchronously or script2 may be executed BEFORE and won't see its dependency

For example, you can do:
```html
<script src="script1.js"></script>
<script src="script2.js" async></script>
```
But you can't do this (it will fail sometimes):
```html
<script src="script1.js" async></script>
<script src="script2.js" async></script>
```
Using asyncDefine
-----------------
asyncDefine wraps your scripts and insure the execution order without polluting the global namespace.
This will be script1.js
```js
defineAsync('script1', function (){ // script1 will be the name of this bundle
  // I am exposing the functionalities through the object "obj"
  return obj;
});
```
This will be script2.js
```js
defineAsync(['script1'], function (script1){ // the array lists the dependencies
  // I execute the code and script1 will be defined
});
```
It is also protecting you for executing the same common libraries twice. For example:
```js
defineAsync('script1', function (){
  // will I be executed ?
  return;
});
defineAsync('script1', function (){
  // will I be executed ?
  return;
});
```
In the previous example only one of these will be executed.

Syntax
------
The syntax resembles a lot AMD (http://requirejs.org/docs/api.html#define). There is only one function:
```js
defineAsync(name, [array of dependencies], func);
```
The name and the list of dependencies are optionals. The function will be executed and it will receive the dependencies as arguments.

What is NOT
-----------
AsyncDefine is not a module definition system, it doesn't trigger the download of the dependencies, it doesn't require, include or enforce any kind of package manager.

How to use with browserify
--------------------------
AsyncDefine is compatible with plain javascript, browserify and ES2015 modules. Here's an example with Browserify.
The first bundle will contain jquery:
```js
var $ = require('jquery');
var asyncDefine = require('asyncDefine');

asyncDefine('jquery', function (){
  return $;
});
```
The second bundle will contain react:
```js
var React = require('react');
var asyncDefine = require('asyncDefine');

asyncDefine('react', function (){
  return React;
});
```
The third bundle will contain react-dom:
```js
var ReactDOM = require('react-dom');
var asyncDefine = require('asyncDefine');

asyncDefine('react-dom', function (){
  return ReactDOM;
});
```
The main file will depend on the others:
```js
var asyncDefine = require('asyncDefine');

asyncDefine(['jquery', 'react', 'react-dom'], function ($, React, ReactDOM){
  var $node = $('<div />').appendTo(document.body);
  var node = $node.get(0);

  var Hello = React.createClass({displayName: "hello", render: function (){
    return React.createElement('div', {className: 'helloworld'}, 'Hello World!');
  }});

  ReactDOM.render(
    React.createElement(Hello, null),
    node);
});
```
As an alternative it is also possible to bundle a group of resources together in the same file:
```js
var asyncDefine = require('asyncDefine');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

asyncDefine('jquery', function (){
  return $;
});

asyncDefine('react', function (){
  return React;
});

asyncDefine('react-dom', function (){
  return ReactDOM;
});
```
Then you can put in the html:
```html
<script async src="dist/main.js"></script>
<script async src="dist/react.js"></script>
<script async src="dist/react-dom.js"></script>
<script async src="dist/jquery.js"></script>
```
All will be downloaded asynchronously with the maximum performances!
There is also a transformer available https://github.com/tes/browserify-async-define

asyncDefineBundle
=================
This is a command line/API available to wrap scripts into asyncDefine. Can be used as additional build steps in webpack/browserify/xyz, and allows to load bundles asynchronously.

Here are the options:

* -name (-n): name of this bundle (optional)
* -import (-i): symbols to import (optional)
* -export (-e): symbols to export (optional)
* -minified (-m): use this if you want to use a minified version of async-define
* -fragment (-f): (advanced) the fragment to use (default to asyncDefine wrapper)
* -script (-s): the path of the script to wrap into asyncDefine
Example:
```
async-define-bundle.js -n bundle3 -s hello.js -i bundle1.x,bundle1.y,bundle2.z -e j
```
will produce:
```js
// ... async define bundle
asyncDefine("bundle3", ["bundle1" ,"bundle2"], function (___bundle1 ,___bundle2) {
      var x = ___bundle1.x;
      var y = ___bundle1.y;
      var z = ___bundle2.z;

  console.log('hello world'); // this is the script

  return {
      j: j,
  };
});
```
There is an equivalent module:
```js
var asyncDefineBundle = require('async-define/src/async-define-bundle');
console.log(asyncDefineBundle({
  fragmentPath: fragmentPath, // (advanced) the fragment to use (default to asyncDefine wrapper)
  bundleName: bundleName, // name of this bundle (optional)
  importVar: importVar, // an object like {bundle1: ['x', 'y'], bundle2: ['z']}
  exportVar: exportVar, // a list of exported symbols ['j']
  script: script, // the script to wrap into asyncDefine (a string)
  minified: minified, // use this if you want to use a minified version of async-define
}));
```
