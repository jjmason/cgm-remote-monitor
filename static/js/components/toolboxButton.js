var React = require('react');

/**
 * A button that lives in the toolbox.
 *
 * It consists of a clickable icon, specified by the `icon` property.
 *
 * When the button is clicked, it will call the function given by the
 * `onClick` property.
 *
 * CSS:
 *  a.toolbox-button: the link element (which is the root of this component)
 *  i.toolbox-button-icon: the icon for the button.
 *
 * BROADCASTS:
 *  nothing
 */
module.exports = React.createClass({
    displayName: 'ToolboxButton',

    render: function () {
        return <a href='#' className='toolbox-button' onClick={this.handleClick}>
            <i className={'icon-' + this.props.icon + ' toolbox-button-icon'}></i>
        </a>;
    },

    handleClick: function (event) {
        if (this.props.onClick) {
            this.props.onClick(event);
        } else {
            console.error("onClick not set for ToolboxButton (" + this.props.icon + ")");
        }
        return false;
    }
});