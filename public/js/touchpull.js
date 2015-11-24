define("common/utils/touchPull.js", function(dataAndEvents, deepDataAndEvents, module) {
  !function($, w) {
    /** @type {Document} */
    var d = w.document;
    var KEY = {
      NONE : 0,
      NOOP : 1,
      UP : 2,
      RIGHT : 3,
      DOWN : 4,
      LEFT : 5,
      LEFT_RIGHT : 6
    };
    var defaults = {
      con : "",
      minDistance : 4,
      /**
       * @return {undefined}
       */
      onPullStart : function() {
      },
      /**
       * @return {undefined}
       */
      onMove : function() {
      },
      /**
       * @return {undefined}
       */
      onPullEnd : function() {
      }
    };
    /**
     * @param {?} options
     * @return {undefined}
     */
    var init = function(options) {
      if ("string" == typeof options.con) {
        /** @type {(Element|null)} */
        options.con = d.querySelector(options.con);
      }
      this.options = $.extend({}, defaults, options);
      /** @type {boolean} */
      this.hasTouch = false;
      /** @type {number} */
      this.direction = KEY.NONE;
      /** @type {number} */
      this.distanceX = this.startY = this.startX = 0;
      /** @type {boolean} */
      this.isPull = false;
      this.initEvent();
    };
    init.prototype = {
      /**
       * @return {undefined}
       */
      initEvent : function() {
        var mockPlugin = this;
        /**
         * @param {Array} e
         * @return {undefined}
         */
        this._touchStart = function(e) {
          mockPlugin.__start(e);
        };
        /**
         * @param {Event} e
         * @return {undefined}
         */
        this._touchMove = function(e) {
          mockPlugin.__move(e);
        };
        /**
         * @param {Event} e
         * @return {undefined}
         */
        this._touchEnd = function(e) {
          mockPlugin.__end(e);
        };
        this.options.con.addEventListener("touchstart", this._touchStart, false);
        this.options.con.addEventListener("touchmove", this._touchMove, false);
        this.options.con.addEventListener("touchend", this._touchEnd, false);
      },
      /**
       * @return {undefined}
       */
      detachEvent : function() {
        this.options.con.removeEventListener("touchstart", this._touchStart, false);
        this.options.con.removeEventListener("touchmove", this._touchMove, false);
        this.options.con.removeEventListener("touchend", this._touchEnd, false);
      },
      /**
       * @param {Array} e
       * @return {undefined}
       */
      __start : function(e) {
        e = e.targetTouches;
        if (1 === e.length) {
          this.startX = e[0].pageX;
          this.startY = e[0].pageY;
          /** @type {number} */
          this.direction = KEY.NONE;
          /** @type {number} */
          this.distanceX = 0;
          /** @type {boolean} */
          this.hasTouch = true;
          /** @type {number} */
          this.startScrollY = w.scrollY;
        }
      },
      /**
       * @param {Event} e
       * @return {undefined}
       */
      __move : function(e) {
        if (this.hasTouch) {
          if (this.direction === KEY.UP) {
            return;
          }
          var touch = e.targetTouches[0];
          if (this.direction === KEY.NONE) {
            /** @type {number} */
            this.distanceX = touch.pageX - this.startX;
            /** @type {number} */
            this.distanceY = touch.pageY - this.startY;
            /** @type {number} */
            var absY = Math.abs(this.distanceY);
            /** @type {number} */
            var absX = Math.abs(this.distanceX);
            if (absX + absY > this.options.minDistance) {
              /** @type {number} */
              this.direction = absX > 1.73 * absY ? KEY.LEFT_RIGHT : absY > 1.73 * absX ? this.distanceY < 0 ? KEY.UP : KEY.DOWN : KEY.NOOP;
              if (this.startScrollY < 10) {
                if (this.distanceY > 0) {
                  /** @type {number} */
                  this.direction = KEY.DOWN;
                }
              }
            }
            if (this.startScrollY < 10) {
              if (this.direction === KEY.DOWN) {
                if (this.distanceY > this.options.minDistance) {
                  /** @type {boolean} */
                  this.isPull = true;
                  this.options.onPullStart(e, this.distanceY);
                }
              }
            }
          }
          if (this.isPull) {
            if (this.direction === KEY.DOWN) {
              /** @type {number} */
              this.distanceY = touch.pageY - this.startY;
              /** @type {number} */
              this.refreshY = parseInt(this.distanceY * this.options.pullRatio);
              this.options.onMove(e, this.distanceY);
            }
          }
        }
      },
      /**
       * @param {Event} e
       * @return {undefined}
       */
      __end : function(e) {
        if (!!this.hasTouch) {
          if (!(KEY.LEFT_RIGHT !== this.direction && KEY.DOWN !== this.direction)) {
            if (this.direction === KEY.LEFT_RIGHT) {
              e.preventDefault();
              this.options.onPullEnd(e, this.distanceX, KEY.LEFT_RIGHT);
            }
            if (this.direction === KEY.DOWN) {
              if (this.isPull) {
                e.preventDefault();
                this.options.onPullEnd(e, this.distanceY, KEY.DOWN);
              }
            }
          }
        }
        /** @type {boolean} */
        this.hasTouch = false;
        /** @type {boolean} */
        this.isPull = false;
      }
    };
    w.TouchPull = {
      /**
       * @param {?} allBindingsAccessor
       * @return {?}
       */
      init : function(options) {
        return new init(options);
      },
      DIRECTION : KEY
    };
  }(window.jQuery || window.Zepto, window);
  module.exports = TouchPull;
});