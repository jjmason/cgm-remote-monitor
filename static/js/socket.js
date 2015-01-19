// require data so it can subscribe to our event streams before
// we connect
var io = require('socket.io'),
    radio = require('radio'),
    u = require('./utils'),
    data = require('./data');
/**
 * Messages our socket sends. Note that radio will broadcast camelCase
 * variants, so for example, when the socket receives an "urgent_alarm" message,
 * we broadcast "socket:urgentAlarm".
 * @type {string[]}
 */
var SOCKET_MESSAGES = [
    'sgv', // sent with new sgv data
    'now', // sent to indicate that the time should be updated (data is a unix timestamp)d
    'alarm',   // ALARM! ALARM!
    'urgent_alarm', // Even moar ALARM!
    'clear_alarm' // Settle down there, it's under control.
];

function addListener(socket, name) {
    socket.on(name, function () {
        var channel = radio('socket:' + u.toCamelCase(name));
        channel.broadcast.apply(channel, arguments);
    });
}

function addListeners(socket) {
    for (var i = 0; i < SOCKET_MESSAGES.length; i++) {
        addListener(socket, SOCKET_MESSAGES[i]);
    }
}

var Socket = function () {
    this.socket = io.connect();
    this.connected = false;
    this.connectionListeners = [];
    this.socket.on('connect', function () {
        this.connected = true;
        while (this.connectionListeners.length > 0) {
            this.connectionListeners.shift()(this);
        }
        radio('socket:connect').broadcast(this);
    }.bind(this));
    addListeners(this.socket);
};

Socket.prototype.onConnect = function (obj, callback) {
    var fn = u.isFunction(obj) ?
        obj : callback.bind(obj);
    if (this.connected) {
        fn(this);
    } else {
        this.connectionListeners.push(fn);
    }
};

module.exports = function () {
    return new Socket();
};