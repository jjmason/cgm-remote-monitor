define(['react', 'radio', 'jsx!components/root', 'settings', 'socket'], function(React, radio, Root, settings, Socket){
    var app = {}

    var create = function(container){
        app.container = container;
        React.render(
            <Root app={app}/>,
            container
        );
        return app;
    };

    var currentTheme = 'default';

    app.setTheme = function(theme){
        if(theme != currentTheme){
            $(app.container)
                .removeClass('theme-' + currentTheme)
                .addClass('theme-' + theme);
            currentTheme = theme;
        }
    };

    radio('settings:change').subscribe(function(settings){
        app.setTheme(settings.theme());
    });

    app.setTheme(settings.theme());

    app.socket = new Socket();

    return {create: create};
});