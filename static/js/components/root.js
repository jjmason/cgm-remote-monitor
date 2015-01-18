define(['react', 'jsx!components/header', 'jsx!components/titlebar', 'chart'], function(React, Header, TitleBar, chart) {
    return React.createClass({
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
});