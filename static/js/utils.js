var utils = module.exports = {};

/**
 * bg in mg/dl (which we work with internally) * MGDL_TO_MMOL = bg in mmol / L.
 * @type {number}
 */
utils.MGDL_TO_MMOL = 0.0555; // XXX is this enough precision? I just grabbed the first google result.

var fakeSetImmediate = function (callback) {
    return setTimeout(callback, 0);
};

/**
 * Shim for browsers that don't support setImmediate.
 * @param fn {function}
 * @return {number}
 */ 
utils.setImmediate = (typeof window.setImmediate === 'function') ? window.setImmediate :
    fakeSetImmediate;

/**
 * String helpers
 */

/**
 * Change the first letter of the string to uppercase
 * @param str
 * @returns {string}
 */
utils.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
};

/**
 * Change a snake_case_string to a camelCaseString
 * @param str
 * @returns {string}
 */
utils.toCamelCase = function (str) {
    return str.replace(/^([A-Z])|_(\w)/g, function (_, p1, p2) {
        if (p2) {
            return p2.toUpperCase();
        }
        return p1.toLowerCase();
    });
};

/**
 *  Type checking helpers.  Yes, I am full aware that "instanceof is considered harmful".
 *
 *  If you use  iframes, document.write, or any other 90s style javascript that involves multiple
 *  js contexts (basically, a case of window.[[Array]] or whatever having multiple values),
 *  these will break. So, don't do that!
 */
utils.isArray = (typeof Array.isArray === 'function') ? Array.isArray : function (o) {
    return (o instanceof Array);
};

/**
 * returns true if the value is not undefined or null.  Note that
 * isDefined(false) == true and isDefined(0) == true, but not
 * isDefined(null) or isDefined(undefined).
 */

utils.isDefined = function (o) {
    return !((o === undefined) || (o === null));
};

utils.isFunction = function (o) {
    return (o instanceof Function);
};

/** 
 * returns true iff o is an actual object, that is,
 * Object.prototype is in it's prototype chain. So
 * isObject([]) == true, isObject(function(){}) == true,
 *  and isObject({}) == true, but isObject(3) == false.
 */
utils.isObject = function (o) {
    return o instanceof Object;
};


/**
 * The identity function.  Returns its argument.
 * @param value {*}
 * @returns {*}
 * @nosideeffects
 */
utils.id = function (value) {
    return value;
};

/**
 * Return a function that multiples its argument by factor.
 * @param factor {Number}
 * @returns {function(Number): Number}
 * @nosideeffects
 */
utils.scale = function (factor) {
    return function (value) {
        return factor * value;
    };
};

/**
 * Perform a standard merge operation.   Given two arguments, it will assign all properties
 * not defined on the first argument and defined on the second to the first argument.
 * 
 * Additional arguments are treated the same, and the arguments are merged in order of appearance.
 * 
 * Examples:
 *   var dst = { foo: 1 };
 *   utils.merge( dst, {foo:2, bar:3} );
 *   // dst is now { foo: 1, bar: 3 }
 *   var o = {};
 *   utils.merge(o, { a: 1 }, {a: 4});
 *   // o.a is now 1
 *     
 *  
 *  
 * @param dest {Object} all remaining arguments are merged into this one.
 */
utils.merge = function (dest/*, src1, src2, ...*/) {
    var sources = utils.rest(arguments, 1),
        i, j, sl = sources.length, kl, src, keys, key;
    for (i = 0; i < sl; i++) {
        src = sources[i];
        keys = Object.keys(src);
        kl = keys.length;
        for (j = 0; j < kl; j++) {
            key = keys[j];
            if (utils.isDefined(src[key])) {
                dest[key] = src[key];
            }
        }
    }
    return dest;
};

/**
 * Extracts an array from `args` (which can be an `arguments` object) as an array ,skiping
 * `skip` elements.
 * @param args {Array|arguments} 
 * @param skip {Integer}
 */
utils.rest = function (args, skip) {
    if (!utils.isDefined(skip)) {
        skip = 0;
    }
    return [].slice.call(args, skip);
};

/**
 * Some bg related helpers.  I wonder if these should live somewhere else?
 */

/**
 * Converts a "raw" or "mg/dl" value to "mg/dl" or "mmol/L" depending on the value
 * of 'units', which must be "mgdl" or "mmol".
 */
utils.scaleBg = function (units, value) {
    if (units == 'mgdl') {
        return value;
    }

    if (units == 'mmol') {
        return utils.MGDL_TO_MMOL * value;
    }

    errorHandler("Unkown unit: " + units + ", returning unchanged bg");
    return value;
};

/**
 * Return a function that can be passed to Array.sort that sorts by comparing
 * values of as property with the given name.
 */
utils.propertySorter = function (propertyName) {
    return function (a, b) {
        var ap = a[propertyName],
            bp = b[propertyName];
        return ap < bp ? -1 : bp < ap ? 1 : 0;
    }
};

    