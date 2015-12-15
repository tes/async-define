var asyncDefine = require('../lib/asyncDefine');

asyncDefine(['jquery', 'react', 'react-dom'], function ($, React, ReactDOM){
  var $node = $('<div />').appendTo(document.body);
  var node = $node.get(0);

  var Hello = React.createClass({displayName: "hello", render: function (){
    return React.createElement('div', {className: 'helloworld'}, 'Hello World!');
  }});

  ReactDOM.render(
    React.createElement(Hello, null),
    node
  );

});
