define([], function(){
    /**
     * In the future this could be a function that throws exceptions in development mode
     * or sends errors to some sort of analytics, but for now we just log errors to the console.
     */
    return function(err){
        console.error(err);
    };


});