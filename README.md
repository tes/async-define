asyncDefine
===========
asyncDefine is a simple function that coordinates the execution of aynchronous scripts.

The issue
=========
Sometime you want to split a script in more than one bundle. For caching for example, or for sharing a common library between two or more scripts running in the same page.
What you can easily do is this:

    <script src="script1.js"></script>
    <script src="script2.js"></script>

This works of course but with a couple of problems:

* script1 needs to expose something in the global namespace or script2 won't be able to see script1
* you are forced to load script1 synchronously or script2 may be executed BEFORE and won't see its dependency

For example, you can do:

    <script src="script1.js"></script>
    <script src="script2.js" async></script>

But you can't do this (it will fail sometimes):

    <script src="script1.js" async></script>
    <script src="script2.js" async></script>

Using asyncDefine
=================
asyncDefine wraps your scripts and insure the execution order without polluting the global namespace.
This will be script1.js

    defineAsync('script1', function (){ // script1 will be the name of this bundle
      // I am exposing the functionalities through the object "obj"
      return obj;
    });

This will be script2.js

    defineAsync(['script1'], function (script1){ // the array lists the dependencies
      // I execute the code and script1 will be defined
    });

Syntax
======
The syntax resemble a lot AMD (http://requirejs.org/docs/api.html#define). There is only a function:

    defineAsync(name, [array of dependencies], func);

The name and the list of dependencies are optionals. The function will be executed and it will receive the dependencies as arguments.

What is NOT
===========
AsyncDefine is not a module definition system, it doesn't trigger the download of the dependencies, it doesn't require, include or enforce any kind of package manager.

How to use with browserify
==========================
AsyncDefine is compatible with plain javascript, browserify and ES2015 modules. Here's an example with Browserify.
The first bundle will contain jquery:

    var $ = require('jquery');
    var asyncDefine = require('../lib/asyncDefine');

    asyncDefine('jquery', function (){
      return $;
    });

The second bundle will contain react:

    var React = require('react');
    var asyncDefine = require('../lib/asyncDefine');

    asyncDefine('react', function (){
      return React;
    });

The third bundle will contain react-dom:

    var ReactDOM = require('react-dom');
    var asyncDefine = require('../lib/asyncDefine');

    asyncDefine('react-dom', function (){
      return ReactDOM;
    });

The main file will depend on the others:

    var asyncDefine = require('../lib/asyncDefine');

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

Then you can put in the html:

    <script async src="dist/main.js"></script>
    <script async src="dist/react.js"></script>
    <script async src="dist/react-dom.js"></script>
    <script async src="dist/jquery.js"></script>

All will be downloaded asynchronously with the maximum performances!
