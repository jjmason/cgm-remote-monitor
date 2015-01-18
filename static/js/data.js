define(['radio', 'utils', 'settings', 'errorHandler'], function(radio, u, settings, errorHandler){

    // models
    function Sgv(raw){
        // allow use as a factory.
        if(!(this instanceof Sgv)){ return new Sgv(raw); }
        this.direction = raw.direction;
        this.date = new Date(raw.x);
        this.sgv = raw.y;
        this.urgency = 0; // TODO implement urgency
    }

    function ServerForcast(raw){
        if(!(this instanceof ServerForcast)){ return new ServerForcast(raw); }
        this.sgv = raw.y;
        this.date = new Date(raw.x);
    }

    function Mgb(raw){
        if(!(this instanceof Mgb)){ return new Mgb(raw); }
        this.date = new Date(raw.x);
        this.sgv  = raw.y;
    }

    function Treatment(raw){
        if(!(this instanceof Treatment)){ return new Treatment(raw); }
        u.merge(this, raw, {created_at: new Date( raw.created_at )})
        // for consistency with other models:
        this.date = this.created_at;
    }



    /**
     * Data object.  This is a singleton, and
     * we only export it via 'data.constructor' for testing
     * purposes.  It provides access to it's internal state via
     * accessors named according to the 'name() setName()' convention.
     * It does not have a prototype, and since only a single instance is
     * created we create all methods in the constructor and bind them to
     * this.
     */
    function Data(){

        /**
         * Internal state of this Data instance
         */
        var loaded = false,
            sgvs = [],
            mbgs = [],
            treatments = [],
            serverForcasts = [],
            lastErrorCode = null,
            lastUpdatedAt = null;

        /**
         * Return the current array of SGV data.  The
         * elements of the array are Sgv instances.  The array
         * should NOT be modified.
         * @returns {Array}
         */
        this.sgvs = function(){
            return sgvs;
        }.bind(this);

        /**
         * Convenience method to obtain the latest sgv value returned
         * from the server.  May return undefined if no SGVs have been
         * received yet.
         * @returns {Sgv|null}
         */
        this.latestSgv = function(){
            return sgvs[sgvs.length - 1];
        }.bind(this);

        /**
         * Wether or not we have any data from the server yet.  Other components
         * should check this before attempting to update based on our state.
         *
         * When this value becomes true, we'll broadcast a "data:loaded" message.
         */
        this.loaded = function(){
            return loaded;
        }.bind(this);

        /**
         * Returns the time at which we received the latest sgv data.  If we haven't received any yet,
         * we return null.
         */
        this.lastUpdatedAt = function(){
            var latest = this.latestSgv();
            if(u.isDefined(latest)){
                return latest.date;
            }
            return null;
        }.bind(this);


        /**
         * Return the latest server sent error.  When an error is set, we broadcast a 'data:error' message.
         */


        /**
         * Exposed for testing purposes, very much a private method.
         *
         * This is the function you should modify in response to changes in the
         * server sent data format.  You will also posibly have to change the implementation
         * of the "model" constructors, which perform a small amount of manipulation on the
         * items within each data series.
         *
         * @private
         */
        this._setData = function(data){
            var dateSorter = u.propertySorter('date');

            /**
                Note that we use this.{model} instead of the scope values, so that
                models can be stubbed or replaced during testing.
             */
            sgvs           = data[0].map(this.Sgv).sort(dateSorter);
            serverForcasts = data[1].map(this.ServerForcast).sort(dateSorter);
            mbgs           = data[2].map(this.Mgb).sort(dateSorter);
            treatments     = data[3].map(this.Treatment).sort(dateSorter);
            lastErrorCode  = data[4];
        }.bind(this);

        /**
         * Subscribe to 'sgv' messages sent from the server.
         */
        radio('socket:sgv').subscribe(function(data){
            this._setData(data);

            lastUpdatedAt = new Date();
            if(!loaded){
                radio('data:loaded').broadcast(this);
            }

            if(lastErrorCode){
                radio('data:error').broadcast(this);
            }

            radio('data:changed').broadcast(this);
        }.bind(this));

        /**
         * Set the model classes so that they're available for testing.
         */
        this.Sgv = Sgv;
        this.Mgb = Mgb;
        this.Treatment = Treatment;
        this.ServerForcast = ServerForcast;
    }

    return new Data();
});