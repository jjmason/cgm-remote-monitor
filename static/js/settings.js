define(['jquery', 'radio', 'utils', 'jquery-storage'], function($, radio, u){
    var defaultSettings = {
        timeFormat: '12',
        customTitle: 'Nightscout',
        theme: 'default',
        units: 'mgdl'
    };

    var MGDL_TO_MMOL =  u.MGDL_TO_MMOL;

    var broadCastScheduled = false;

    function scheduleBroadcast(settings){
        if(!broadCastScheduled){
            broadCastScheduled = true;
            u.setImmediate(function(){
               broadCastScheduled = false;
                radio('settings:changed').broadcast(settings);
            });
        }
    }

    function Settings(storage){
        this.storage  = storage;
        this._cache = {};
    }

    Settings.prototype = {
        get: function(name, defaultValue){
            if(u.isDefined(this._cache[name])){
                return this._cache[name];
            }
            if(!defaultValue || this.storage.isSet(name)){
                return this.storage.get(name);
            }
            this.set(name, defaultValue);
            return defaultValue;
        },

        set: function(name, value){
            var old = this.storage.get(name);
            if(old != value){
                this.storage.set(name, value);
                scheduleBroadcast(this);
                if(u.isDefined(this._cache[name])){
                    delete this._cache[name];
                }
            }

        },

        restoreDefaults: function(){
            var key, value;

            for(key in defaultSettings){
                if(defaultSettings.hasOwnProperty(key)){
                    value = defaultSettings[key];
                    this.set(key, value);
                }
            }
        },

        scaleBg: function(v){
            var units = this.units();
            if(units !== 'mgdl'){
                return MGDL_TO_MMOL * v;
            }else{
                return v;
            }
        }
    };

    (function(){
        var k,v,sp=Settings.prototype,
            defineGetter = function(key, def){
                return function(){
                    return this.get(key, def);
                }
            },
            defineSetter = function(key){
               return function(value){
                   this.set(key, value);
               }
            },
            setterName = function(prop){
                return "set" + u.capitalize(prop);
            };
        for(k in defaultSettings){
            if(defaultSettings.hasOwnProperty(k)){
                v = defaultSettings[k];
                sp[k] = defineGetter(k,v);
                sp[setterName(k)] = defineSetter(k);
            }
        }
    })();

    var settings = new Settings($.localStorage);
    settings.restoreDefaults();
    return settings;
});