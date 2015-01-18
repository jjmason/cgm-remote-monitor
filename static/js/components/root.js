var React = require('react'),
    Header = require('./header'),
    TitleBar = require('./titlebar'),
    chart = require('../chart');

var Root = React.createClass({
    displayName: 'Root',

    render: function () {
        return <div className="root">
            <TitleBar {...this.props}/>
            <Header ref="header" {...this.props}/>
            <div className="chart" ref="chart"></div>
        </div>;
    },

    componentDidMount: function () {
        this.props.app.chart = chart.create(this.refs.chart.getDOMNode());
        this.props.app.header = this.refs.header.getDOMNode();
    }
});

Root.create = function(app, container){
    React.render(<Root app={app}/>, container);
};