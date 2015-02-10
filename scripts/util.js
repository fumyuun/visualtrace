define(function () {
    'use strict';

    var util = {};

    util.createClass = function (parent, constructor) {
        var thisClass;
        // class constructor
        thisClass = function () {
            this.parent = parent;
            if (arguments.length > 0) {
                parent.apply(this, arguments);
                if (constructor !== undefined) {
                    constructor.apply(this, arguments);
                }
            }
        };
        // inheritance
        thisClass.prototype = Object.create(parent.prototype);
        return thisClass;
    };

    util.forEach = function (obj, cb) {
        var name;
        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                cb.call(this, obj[name], name);
            }
        }
    };

    util.contains = function (a, obj) {
        var i;
        for (i = 0; i < a.length; i += 1) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    };

    util.extend = function (obj1, obj2) {
        var attr;
        for (attr in obj1) {
            if (obj1.hasOwnProperty(attr) && !obj2.hasOwnProperty(attr)) {
                obj2[attr] = obj1[attr];
            }
        }
        return obj2;
    };

    util.clone = function (obj) {
        var attr, copy;
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        copy = obj.constructor();
        for (attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = util.clone(obj[attr]);
            }
        }
        return copy;
    };

    util.avarage = function (ar) {
        var sum = 0;
        util.forEach(ar, function (v) {
            sum += v;
        });
        return sum / ar.length;
    }

    util.minmax = function (ar) {
        var min = ar[0],
            max = ar[0];
        util.forEach(ar, function (v) {
            if (v < min) {
                min = v;
            }
            if (v > max) {
                max = v;
            }
        });
        return {min: min, max: max};
    }

    return util;
});