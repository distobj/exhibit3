/**
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @fileOverview Base for Exhibit utilities and native datatype modifications.
 */

/**
 * @namespace For Exhibit utility classes and methods.
 */
Exhibit.Util = {};

/**
 * Round a number n to the nearest multiple of precision (any positive value),
 * such as 5000, 0.1 (one decimal), 1e-12 (twelve decimals), or 1024 (if you'd
 * want "to the nearest kilobyte" -- so round(66000, 1024) == "65536"). You are
 * also guaranteed to get the precision you ask for, so round(0, 0.1) == "0.0".
 *
 * @static
 * @param {Number} n Original number.
 * @param {Number} [precision] Rounding bucket, by default 1.
 * @returns {String} Rounded number into the nearest bucket at the bucket's
 *                   precision, in a form readable by users.
 */
Exhibit.Util.round = function(n, precision) {
    var lg;
    precision = precision || 1;
    lg = Math.floor( Math.log(precision) / Math.log(10) );
    n = (Math.round(n / precision) * precision).toString();
    if (lg >= 0) {
        return parseInt(n, 10).toString();
    }

    lg = -lg;
    return parseFloat(n).toFixed(lg);
};

/**
 * Modify the native String type.
 */
(function() {
    if (typeof String.prototype.trim === "undefined") {
        /**
         * Removes leading and trailing spaces.
         *
         * @returns {String} Trimmed string.
         */
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    if (typeof String.prototype.startsWith === "undefined") {
        /**
         * Test if a string begins with a prefix.
         *
         * @param {String} prefix Prefix to check.
         * @returns {Boolean} True if string starts with prefix, false if not.
         */
        String.prototype.startsWith = function(prefix) {
            return this.length >= prefix.length && this.substr(0, prefix.length) === prefix;
        };
    }

    if (typeof String.prototype.endsWith === "undefined") {
        /**
         * Test if a string ends with a suffix.
         *
         * @param {String} suffix Suffix to check.
         * @returns {Boolean} True if string ends with suffix, false if not.
         */
        String.prototype.endsWith = function(suffix) {
            return this.length >= suffix.length && this.substr(this.length - suffix.length) === suffix;
        };
    }

    if (typeof String.substitute === "undefined") {
        /**
         * Interpolate a string with one or several substrings of the form
         * '%N' where N is an integer with 0 <= N <= 9, with the Nth entry
         * in an array of objects.  Values of N greater than available
         * objects or not a number will result in the %N expression being
         * rendered as is.  Use '\\%' to escape interpolation of a percent
         * character.
         * 
         * @static
         * @param {String} s Text containing '%N' substrings.
         * @param {Array} objects Array of values to interpolate with.
         * @returns {String} Interpolated string.
         * @example
         * var text = 'The %0 and the %1, the %3 jumped over the %2 \\%3%5.';
         * var subs = ['cat', 'fiddle', 'moon', 'cow'];
         * var news = String.substitute(text, subs);
         * news === "The cat and the fiddle, the cow jumped over the moon %3%5.";
         */
        String.substitute = function(s, objects) {
            var result = "", start = 0, percent, n;
            while (start < s.length - 1) {
                percent = s.indexOf("%", start);
                if (percent < 0 || percent === s.length - 1) {
                    break;
                } else if (percent > start && s.charAt(percent - 1) === "\\") {
                    result += s.substring(start, percent - 1) + "%";
                    start = percent + 1;
                } else {
                    n = parseInt(s.charAt(percent + 1), 10);
                    if (isNaN(n) || n >= objects.length) {
                        result += s.substring(start, percent + 2);
                    } else {
                        result += s.substring(start, percent) + objects[n].toString();
                    }
                    start = percent + 2;
                }
            }
    
            if (start < s.length) {
                result += s.substring(start);
            }
            return result;
        };
    }
}());
