define(['react', 'radio', 'settings', 'data', 'utils', 'jsx!components/statusDetails'],
    function(React, radio, settings, data, u, StatusDetails){
    /**
     * The Status component displays the current bg value and trend, along with
     * any details we're electing to show, such as IOB/COB or BGI.
     */
    return React.createClass({
        displayName: 'Status',

        getInitialState: function(){
            return {
                currentBg: null,
                currentTrend: null,
                units: settings.units()
            }
        },

        componentDidMount: function(){
            radio('data:changed').subscribe([this.handleDataChanged, this]);
            radio('settings:changed').subscribe([this.handleSettingsChanged, this]);
        },

        handleDataChanged: function(){
            var latest = data.latestSgv();
            if(u.isDefined(latest)){
                this.setState({currentBg: latest.sgv, currentTrend: latest.direction});
            }else{
                // this could happen with a brand new database, but it's worth showing
                // a warning to help diagnose bugs that cause this in other circumstances.
                console.warn("data changed, but sgv data is empty!");
                this.setState({currentBg:null, currentTrend:null});
            }
        },

        handleSettingsChanged: function(){
            this.setState({
                units: settings.units()
            });
        },

        getStatusClass: function(){
           return 'current-status'; // TODO add classes for urgency, alarms, etc.
        },

        getCurrentBg: function(){
            return u.isDefined(this.state.currentBg) ?
                Math.round(u.scaleBg(this.state.units, this.state.currentBg))
                : '--';
        },

        getCurrentTrend: function(){
            return u.isDefined(this.state.currentTrend) ?
                this.state.currentTrend : '--';
        },

        handleClick: function(){
           radio('status:click').broadcast();
        },

        render: function(){
            return <div className={this.getStatusClass()} onClick={this.handleClick}>
                <span className='current-bg'>{this.getCurrentBg()}</span>
                <span className='current-trend'>{this.getCurrentTrend()}</span>
                <StatusDetails />
            </div>;
        }
    });
});