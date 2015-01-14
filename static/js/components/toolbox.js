define(['react', 'radio', 'jsx!components/toolboxButton'], function(React, radio, ToolboxButton){
    /**
     * A toolbox containing buttons to perform actions such as testing
     * alarms or showing various drawers.
     *
     * CSS:
     *  div.toolbox - the root element of this component.
     *
     * BROADCASTS:
     *  toolbox:alarms - when the alarms button is clicked
     *  toolbox:settings - when the settings button is clicked
     *  toolbox:treatments - when the treatments button is clicked
     *
     * TODO:
     *  * hide the treatments button when careportal isn't enabled.
     *  * show tooltips
     */
   return React.createClass({
       displayName: 'Toolbox',

       clickHandler: function(name){
           return function(){
               radio('toolbox:' + name).broadcast();
           }
       },

       render: function(){
           return <div className="toolbox">
               <ToolboxButton icon='volume' onClick={this.clickHandler('alarms')}/>
               <ToolboxButton icon='cog' onClick={this.clickHandler('settings')}/>
               <ToolboxButton icon='plus' onClick={this.clickHandler('treatments')}/>
           </div>;
       }
   })
});