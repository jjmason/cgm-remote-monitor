define(['react', 'jsx!components/clock', 'jsx!components/toolbox', 'jsx!components/status'],
function(React, Clock, Toolbox, Status){
    return React.createClass({
        displayName: 'Header',

        render: function(){
            return <div className="header">
                <Clock ref='clock' {...this.props}/>
                <Status ref='status' {...this.props}/>
            </div>
        }
    });
});