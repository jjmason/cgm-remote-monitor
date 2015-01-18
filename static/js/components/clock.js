define(['react', 'radio', 'moment', 'data'], function (React, radio, moment, data) {
        var FORMAT_12 = "h:mm",
        FORMAT_24 = "H:mm";

    /**
     * The Clock component displays the current time, and how long it's been since
     * the last data change.
     *
     * CSS:
     *   div.clock -> the container for the clock component
     *   div.time-ago -> contains text like "4 minutes ago"
     *   div.time-current -> contains text like "12:43 PM" or "19:12"
     *
     * TODO: change presentation when in retro mode and when the last received time is too old.
     */
    return React.createClass({
        displayName: 'Clock',

        getInitialState: function () {
            return {
                now: new Date(),
                format: FORMAT_12,
                latest: data.lastUpdatedAt()
            };
        },

        componentDidMount: function(){
            // listen for settings changes
            radio('settings:changed').subscribe([function(settings){
                var format = settings.timeFormat() == '24' ? FORMAT_24 : FORMAT_12;
                this.setState({ format: format });
            }, this]);

            // and for data changes
            radio('data:changed').subscribe([function(data){
                this.setState({latest: data.lastUpdatedAt()});
            }, this]);

            radio('socket:now').subscribe([function(now){
                this.setState({now: new Date(now)});
            }, this]);
        },

        getCurrentText: function(){
            return this.state.now ? moment(this.state.now).format(this.state.format) : ' -- ';
        },

        getTimeAgoText: function(){
            return this.state.latest ? moment(this.state.latest).fromNow() : ' -- ';
        },

        isLatestToOld: function(){
            if(!this.state.latest){
                return false;
            }

            return this.state.latest < moment().subtract(30, 'minutes').toDate();
        },

        extraTimeAgoClass: function(){
           return this.isLatestToOld() ? 'old' : '';
        },

        render: function () {
            return <div className="clock">
                <div className="time-current">
                    { this.getCurrentText() }
                </div>
                <div className={'time-ago ' + this.extraTimeAgoClass()}>
                    { this.getTimeAgoText() }
                </div>
            </div>;
        }
    });
});