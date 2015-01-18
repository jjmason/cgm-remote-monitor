define(['react', 'radio', 'jsx!components/toolbox', 'settings'], function(React, radio, Toolbox, settings){
    /**
     * This is the bar that appears at the top of the screen.  It displays
     * the value of the user's customTitle, and and the toolbox buttons.
     *
     * CSS:
     *  div.title-bar the root element for this component
     *  span.custom-title the element displaying the custom title
     *  span.custom-title.visible/hidden - visible and hidden states for the custom
     *  title.
     */
    return React.createClass({
        displayName: 'Titlebar',

        getInitialState: function(){
            return {
                customTitle: settings.customTitle()
            };
        },

        componentDidMount: function(){
            radio('settings:changed').subscribe(function(settings){
                this.setState({customTitle: settings.customTitle()});
            }.bind(this));
        },

        customTitleClass: function(){
            if(this.state.customTitle && this.state.customTitle != ''){
                return 'visible';
            }else{
                return 'hidden';
            }
        },


        render: function(){
            return <div className='title-bar'>
                <span className={'custom-title ' + this.customTitleClass()}>{this.state.customTitle}</span>
                <Toolbox/>
            </div>;
        }
    });
});