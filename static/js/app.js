var React = require('react'),
    radio = require('radio'),
    Root  = require('./components/root');

var app = {}

app.create = function(container){
   Root.create(app, container);
};

document.addEventListener('load', function(){
   app.create(document.body);
});

