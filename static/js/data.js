define(['radio', 'moment'], function(radio, moment){

    // this is our `this` object.
    var scope = {
        loaded: false,
        raw: [],
        treatments: null,
        sgvs: null,
        serverPredictions: null,
        mbgs: null,
        lastUpdatedAt: null
    };

    // our exported object
    var mod =  {
        loaded: function(){ return scope.loaded; },
        lastUpdatedAt: function(){
            return scope.lastUpdatedAt;
        }
    };

    radio('socket:sgv').subscribe(function(data){
        scope.lastUpdatedAt = new Date();
        if(!scope.loaded){
            scope.loaded = true;
            radio('data:loaded').broadcast(mod);
        }
        radio('data:changed').broadcast(mod);
    });

    return mod;
});