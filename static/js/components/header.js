
var React = require('react'),
    Clock = require('./clock'),
    Status = require('./status');

module.exports =  React.createClass({
    displayName: 'Header',

    render: function(){
        return <div className="header">
            <Clock ref='clock' {...this.props}/>
            <Status ref='status' {...this.props}/>
        </div>
    }
});