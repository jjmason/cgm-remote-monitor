define(['react', 'jsx!components/header', 'chart'], function(React, Header, chart) {
    return React.createClass({
        displayName: 'Root',

        render: function () {
            return <div className="root">
                <Header ref="header" {...this.props}/>
                <div className="chart" ref="chart"></div>
            </div>;
        },

        componentDidMount: function () {
            this.props.context.chart = chart.create(this.refs.chart.getDOMNode());
            this.props.context.header = this.refs.header.getDOMNode();
        }
    });
});