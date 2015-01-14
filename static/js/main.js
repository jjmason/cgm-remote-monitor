/**
 *
 *
 <script src="/bower_components/d3/d3.min.js"></script>
 <script src="/bower_components/jquery/dist/jquery.min.js"></script>
 <script src="/bower_components/jQuery-Storage-API/jquery.storageapi.min.js"></script>
 <script src="/bower_components/tipsy-jmalonzo/src/javascripts/jquery.tipsy.js"></script>
 */

requirejs.config({
    baseUrl: '/js',
    paths: {
        react: 'vendor/react-with-addons',
        JSXTransformer: 'vendor/JSXTransformer',
        jsx: 'vendor/jsx',
        text: 'vendor/text'
    }
});

require(['jsx!app'], function(app){
    app.create(document.body);
});