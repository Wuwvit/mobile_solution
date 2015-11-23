define("_util.js", function(require, exports, module) {
    /**
     * @return {undefined}
     */
    function resize() {
        /** @type {number} */
        exports.font = 16 * (exports.rem = (exports.size = document.documentElement.getBoundingClientRect()).width / 375);
        /** @type {number} */
        exports.w = exports.width = exports.size.width;
        /** @type {number} */
        exports.h = exports.height = exports.size.height;
    }
    /**
     * @param {?} rect
     * @param {number} size
     * @return {?}
     */
    function update(rect, size) {
        var w = rect.width;
        var h = rect.height;
        resize();
        size = size || exports.size;
        var width = size.width;
        /** @type {number} */
        var scale = (size.height, width / w);
        return {
            w: width,
            h: h * scale,
            x: scale
        };
    }
    /**
     * @param {Function} style
     * @param {string} extra
     * @return {?}
     */

    var tref;
    window.addEventListener("resize", function() {
        clearTimeout(tref);
        /** @type {number} */
        tref = setTimeout(resize, 300);
    }, false);
    /** @type {function (): undefined} */
    exports.resize = resize;
    resize();

    /** @type {function (?, number): ?} */
    exports.r2a = update;
    /** @type {string} */

    /** @type {boolean} */
    exports.isTmallApp = !!~navigator.userAgent.indexOf("AliApp(TM");
    /** @type {boolean} */
    exports.isInAliApp = !!~navigator.userAgent.indexOf("AliApp(");
    /** @type {boolean} */
    exports.ignoreHead = true;
});
