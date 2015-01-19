var radio = require('radio'),
    u = require('./utils'),
    store = require('store');

var defaultSettings = {
    timeFormat: '12',
    customTitle: 'Nightscout',
    theme: 'default',
    units: 'mgdl'
};

var broadCastScheduled = false;

function scheduleBroadcast(settings) {
    if (!broadCastScheduled) {
        broadCastScheduled = true;
        u.setImmediate(function () {
            broadCastScheduled = false;
            radio('settings:changed').broadcast(settings);
        });
    }
}

function namespace(key) {
    return 'nightscout-settings:' + key;
}

function cached(cache, fn) {
    return function (key, defVal) {
        if (cache.hasOwnProperty(key)) {
            return cache[key];
        } else {
            return fn(key, defVal);
        }
    }
}

function nsget(cache, key, defval) {
    key = namespace(key);
    if (key in cache && cache[key]) {
        return cache[key];
    }
    return store.get(key, defval);
}

function nsset(cache, key, val) {
    key = namespace(key);
    cache[key] = val;
    store.set(key, val);
}

function Settings() {

    var cache = this._cache = {},
        self = this, k;

    this.set = function (key, value) {
        var current = self.get(key);
        if(current !== value){
            scheduleBroadcast(self);
        }
        nsset(cache, key, value);
    };
    this.get = function (key, defval) {
        return nsget(cache, key, defval);
    };
    
    this.restoreDefaults = function () {
        var key;
        for (key in defaultSettings) {
            self.set(key, defaultSettings[key]);
        }
    };

    function getter(key, def) {
        return function () {
            return self.get(key, def);
        };
    }

    function setter(key) {
        return function (value) {
            self.set(key, value);
        };
    }

    function setterName(prop) {
        return 'set' + u.capitalize(prop);
    }

    for (k in defaultSettings) {
        if (defaultSettings.hasOwnProperty(k)) {
            self[k] = getter(k, defaultSettings[k]);
            self[setterName(k)] = setter(k);
        }
    }
}

(function () {
    var k, v, sp = Settings.prototype,
        defineGetter = function (key, def) {
            return function () {
                return this.get(key, def);
            }
        },
        defineSetter = function (key) {
            return function (value) {
                this.set(key, value);
            }
        },
        setterName = function (prop) {
            return "set" + u.capitalize(prop);
        };
    for (k in defaultSettings) {
        if (defaultSettings.hasOwnProperty(k)) {
            v = defaultSettings[k];
            sp[k] = defineGetter(k, v);
            sp[setterName(k)] = defineSetter(k);
        }
    }
})();
module.exports = new Settings();