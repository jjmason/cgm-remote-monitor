// require data so it can subscribe to our event streams before
// we connect
define(['socket.io', 'data', 'radio'], function(io,data, radio){
    function addListeners(socket){
        socket.on('')
    }

    var Socket = function(app){
        this.app = app;
        this.socket = io.connect();

    };

    return function(app){
        return new Socket(app);
    }
});