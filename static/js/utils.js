/** Various helpers, and access to helper libraries */
define([], function(){
    var utils = {};

    var fakeSetImmediate = function(callback){
        setTimeout(callback, 0);
    };

    var _setImmediate = (typeof window.setImmediate === 'function') ? window.setImmediate :
        fakeSetImmediate;

    utils.setImmediate = _setImmediate;

    utils.capitalize = function(str){
        return str.charAt(0).toUpperCase() + str.substr(1);
    };

    return utils;
});