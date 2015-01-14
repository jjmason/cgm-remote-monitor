define(['react', 'jsx!components/root'], function(React, Root){
    var module = {},
        context = module.context = {};

    module.create = function(container){
        React.render(
            <Root context={context}/>,
            container
        );
    };

    return module;
});