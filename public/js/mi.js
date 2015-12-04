define("insert-css", function(dataAndEvents, deepDataAndEvents, module) {
  var natives = {};
  /**
   * @param {string} str
   * @return {undefined}
   */
  module.exports = function(str) {
    if (!natives[str]) {
      /** @type {boolean} */
      natives[str] = true;
      /** @type {Element} */
      var el = document.createElement("style");
      el.setAttribute("type", "text/css");
      if ("textContent" in el) {
        /** @type {string} */
        el.textContent = str;
      } else {
        /** @type {string} */
        el.styleSheet.cssText = str;
      }
      var id = document.getElementsByTagName("head")[0];
      id.appendChild(el);
    }
  };
});
define("cookie", function(require, dataAndEvents, module) {
  var $ = require("zepto");
  module.exports = $.cookie;
});
define("vue", function(dataAndEvents, arg, module) {
  !function() {
    /**
     * @param {string} path
     * @param {Object} parent
     * @param {(Function|string)} orig
     * @return {?}
     */
    function require(path, parent, orig) {
      /**
       * @return {undefined}
       */
      function callback() {
        orig = orig || path;
        parent = parent || "root";
        /** @type {Error} */
        var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
        throw err.path = orig, err.parent = parent, err.require = true, err;
      }
      var resolved = require.resolve(path);
      if (null == resolved) {
        return void callback();
      }
      var module = require.modules[resolved];
      if (!module._resolving && !module.exports) {
        var mod = {};
        mod.exports = {};
        /** @type {boolean} */
        mod.client = mod.component = true;
        /** @type {boolean} */
        module._resolving = true;
        module.call(this, mod.exports, require.relative(resolved), mod);
        delete module._resolving;
        module.exports = mod.exports;
      }
      return module.exports;
    }
    require.modules = {};
    require.aliases = {};
    /** @type {Array} */
    require.exts = ["", ".js", ".json", "/index.js", "/index.json"];
    /**
     * @param {string} path
     * @return {?}
     */
    require.resolve = function(path) {
      if ("/" === path.charAt(0)) {
        path = path.slice(1);
      }
      /** @type {number} */
      var i = 0;
      for (;5 > i;i++) {
        var index = path + require.exts[i];
        if (require.modules.hasOwnProperty(index)) {
          return index;
        }
        if (require.aliases.hasOwnProperty(index)) {
          return require.aliases[index];
        }
      }
    };
    /**
     * @param {string} curr
     * @param {string} path
     * @return {?}
     */
    require.normalize = function(curr, path) {
      /** @type {Array} */
      var segs = [];
      if ("." != path.charAt(0)) {
        return path;
      }
      curr = curr.split("/");
      path = path.split("/");
      /** @type {number} */
      var i = 0;
      for (;i < path.length;++i) {
        if (".." === path[i]) {
          curr.pop();
        } else {
          if ("." != path[i]) {
            if ("" != path[i]) {
              segs.push(path[i]);
            }
          }
        }
      }
      return curr.concat(segs).join("/");
    };
    /**
     * @param {string} path
     * @param {Function} fn
     * @return {undefined}
     */
    require.register = function(path, fn) {
      /** @type {Function} */
      require.modules[path] = fn;
    };
    /**
     * @param {string} from
     * @param {string} to
     * @return {?}
     */
    require.alias = function(from, to) {
      /**
       * @return {?}
       */
      function parseError() {
        throw new Error('Failed to alias "' + from + '", it does not exist');
      }
      return require.modules.hasOwnProperty(from) ? void(require.aliases[to] = from) : void parseError();
    };
    /**
     * @param {string} parent
     * @return {?}
     */
    require.relative = function(parent) {
      /**
       * @param {string} path
       * @return {?}
       */
      function localRequire(path) {
        var resolved = localRequire.resolve(path);
        return require(resolved, parent, path);
      }
      var p = require.normalize(parent, "..");
      return localRequire.resolve = function(path) {
        var inputStr = path.charAt(0);
        if ("/" === inputStr) {
          return path.slice(1);
        }
        if ("." === inputStr) {
          return require.normalize(p, path);
        }
        var split = parent.split("/");
        var i = split.length;
        for (;i-- && "deps" !== split[i];) {
        }
        return path = split.slice(0, i + 2).join("/") + "/deps/" + path;
      }, localRequire.exists = function(path) {
        return require.modules.hasOwnProperty(localRequire.resolve(path));
      }, localRequire;
    };
    require.register("vue/src/main.js", function(dataAndEvents, require, mod) {
      /**
       * @param {Object} o
       * @return {?}
       */
      function create(o) {
        var parent = this;
        if (o.data) {
          o.defaultData = o.data;
          delete o.data;
        }
        if (parent !== exports) {
          o = extend(o, parent.options, true);
        }
        self.processOptions(o);
        /**
         * @param {Error} params
         * @param {?} value
         * @return {undefined}
         */
        var options = function(params, value) {
          if (!value) {
            params = extend(params, o, true);
          }
          parent.call(this, params, true);
        };
        /** @type {Object} */
        var conf = options.prototype = Object.create(parent.prototype);
        return self.defProtected(conf, "constructor", options), options.extend = create, options.super = parent, options.options = o, injectableTypes.forEach(function(key) {
          options[key] = exports[key];
        }), options.use = exports.use, options.require = exports.require, options;
      }
      /**
       * @param {Object} target
       * @param {Object} obj
       * @param {boolean} dataAndEvents
       * @return {?}
       */
      function extend(target, obj, dataAndEvents) {
        if (target = target || {}, !obj) {
          return target;
        }
        var key;
        for (key in obj) {
          if ("el" !== key) {
            var value = target[key];
            var val = obj[key];
            if (dataAndEvents && ("function" == typeof value && val)) {
              /** @type {Array} */
              target[key] = [value];
              if (Array.isArray(val)) {
                target[key] = target[key].concat(val);
              } else {
                target[key].push(val);
              }
            } else {
              if (!dataAndEvents || (!self.isTrueObject(value) && !self.isTrueObject(val) || val instanceof exports)) {
                if (void 0 === value) {
                  target[key] = val;
                }
              } else {
                target[key] = extend(value, val);
              }
            }
          }
        }
        return target;
      }
      var o = require("./config");
      var exports = require("./viewmodel");
      var self = require("./utils");
      var anchor = self.hash;
      /** @type {Array} */
      var injectableTypes = ["directive", "filter", "partial", "effect", "component"];
      require("./observer");
      require("./transition");
      exports.options = o.globalAssets = {
        directives : require("./directives"),
        filters : require("./filters"),
        partials : anchor(),
        effects : anchor(),
        components : anchor()
      };
      injectableTypes.forEach(function(name) {
        /**
         * @param {?} propertyName
         * @param {Text} property
         * @return {?}
         */
        exports[name] = function(propertyName, property) {
          var item = this.options[name + "s"];
          return item || (item = this.options[name + "s"] = anchor()), property ? ("partial" === name ? property = self.toFragment(property) : "component" === name ? property = self.toConstructor(property) : "filter" === name && self.checkFilter(property), item[propertyName] = property, this) : item[propertyName];
        };
      });
      /**
       * @param {?} opts
       * @param {number} val
       * @return {?}
       */
      exports.config = function(opts, val) {
        if ("string" == typeof opts) {
          if (void 0 === val) {
            return o[opts];
          }
          /** @type {number} */
          o[opts] = val;
        } else {
          self.extend(o, opts);
        }
        return this;
      };
      /**
       * @param {Function} path
       * @return {?}
       */
      exports.use = function(path) {
        if ("string" == typeof path) {
          try {
            path = require(path);
          } catch (i) {
            return void self.warn("Cannot find plugin: " + path);
          }
        }
        /** @type {Array.<?>} */
        var p = [].slice.call(arguments, 1);
        return p.unshift(this), "function" == typeof path.install ? path.install.apply(path, p) : path.apply(null, p), this;
      };
      /**
       * @param {string} file
       * @return {?}
       */
      exports.require = function(file) {
        return require("./" + file);
      };
      /** @type {function (Object): ?} */
      exports.extend = create;
      exports.nextTick = self.nextTick;
      mod.exports = exports;
    });
    require.register("vue/src/emitter.js", function(dataAndEvents, deepDataAndEvents, module) {
      /**
       * @param {Object} keepData
       * @return {undefined}
       */
      function constructor(keepData) {
        this._ctx = keepData || this;
      }
      /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
      var __slice = [].slice;
      var proto = constructor.prototype;
      /**
       * @param {string} event
       * @param {Function} fn
       * @return {?}
       */
      proto.on = function(event, fn) {
        return this._cbs = this._cbs || {}, (this._cbs[event] = this._cbs[event] || []).push(fn), this;
      };
      /**
       * @param {string} event
       * @param {Object} fn
       * @return {?}
       */
      proto.once = function(event, fn) {
        /**
         * @return {undefined}
         */
        function on() {
          self.off(event, on);
          fn.apply(this, arguments);
        }
        var self = this;
        return this._cbs = this._cbs || {}, on.fn = fn, this.on(event, on), this;
      };
      /**
       * @param {string} event
       * @param {Function} callback
       * @return {?}
       */
      proto.off = function(event, callback) {
        if (this._cbs = this._cbs || {}, !arguments.length) {
          return this._cbs = {}, this;
        }
        var callbacks = this._cbs[event];
        if (!callbacks) {
          return this;
        }
        if (1 === arguments.length) {
          return delete this._cbs[event], this;
        }
        var c;
        /** @type {number} */
        var i = 0;
        for (;i < callbacks.length;i++) {
          if (c = callbacks[i], c === callback || c.fn === callback) {
            callbacks.splice(i, 1);
            break;
          }
        }
        return this;
      };
      /**
       * @param {string} name
       * @param {string} data
       * @param {string} value
       * @param {boolean} capture
       * @return {?}
       */
      proto.emit = function(name, data, value, capture) {
        this._cbs = this._cbs || {};
        var listeners = this._cbs[name];
        if (listeners) {
          listeners = listeners.slice(0);
          /** @type {number} */
          var i = 0;
          var l = listeners.length;
          for (;l > i;i++) {
            listeners[i].call(this._ctx, data, value, capture);
          }
        }
        return this;
      };
      /**
       * @param {?} name
       * @return {?}
       */
      proto.applyEmit = function(name) {
        this._cbs = this._cbs || {};
        var args;
        var listeners = this._cbs[name];
        if (listeners) {
          listeners = listeners.slice(0);
          /** @type {Array.<?>} */
          args = __slice.call(arguments, 1);
          /** @type {number} */
          var i = 0;
          var l = listeners.length;
          for (;l > i;i++) {
            listeners[i].apply(this._ctx, args);
          }
        }
        return this;
      };
      /** @type {function (Object): undefined} */
      module.exports = constructor;
    });
    require.register("vue/src/config.js", function(dataAndEvents, require, module) {
      var should = require("./text-parser");
      module.exports = {
        prefix : "v",
        debug : false,
        silent : false,
        enterClass : "v-enter",
        leaveClass : "v-leave",
        interpolate : true
      };
      Object.defineProperty(module.exports, "delimiters", {
        /**
         * @return {?}
         */
        get : function() {
          return should.delimiters;
        },
        /**
         * @param {?} elements
         * @return {undefined}
         */
        set : function(elements) {
          should.setDelimiters(elements);
        }
      });
    });
    require.register("vue/src/utils.js", function(dataAndEvents, matches, module) {
      /**
       * @param {string} s
       * @return {?}
       */
      function fn(s) {
        return s.indexOf("[") < 0 ? s : s.replace(rSlash, ".$1").replace(r20, ".$1");
      }
      /**
       * @return {undefined}
       */
      function patchConsole() {
        /**
         * @param {string} fmt
         * @return {undefined}
         */
        self.log = function(fmt) {
          if (options.debug) {
            if (console) {
              console.log(fmt);
            }
          }
        };
        /**
         * @param {string} message
         * @return {undefined}
         */
        self.warn = function(message) {
          if (!options.silent) {
            if (console) {
              console.warn(message);
              if (options.debug) {
                if (console.trace) {
                  console.trace();
                }
              }
            }
          }
        };
      }
      var found;
      var options = matches("./config");
      /** @type {function (this:*): string} */
      var ostring = {}.toString;
      /** @type {Window} */
      var global = window;
      /** @type {(Console|null)} */
      var console = global.console;
      /** @type {function (Object, string, Object): Object} */
      var defineProperty = Object.defineProperty;
      /** @type {string} */
      var object = "object";
      /** @type {RegExp} */
      var rhtml = /[^\w]this[^\w]/;
      /** @type {RegExp} */
      var rSlash = /\['([^']+)'\]/g;
      /** @type {RegExp} */
      var r20 = /\["([^"]+)"\]/g;
      /** @type {boolean} */
      var hasClassListProperty = "classList" in document.documentElement;
      /** @type {function (this:Window, function (number): ?, (Element|null)=): number} */
      var nextTick = global.requestAnimationFrame || (global.webkitRequestAnimationFrame || global.setTimeout);
      var self = module.exports = {
        toFragment : matches("./fragment"),
        /**
         * @param {number} obj
         * @param {string} key
         * @return {?}
         */
        get : function(obj, key) {
          if (key = fn(key), key.indexOf(".") < 0) {
            return obj[key];
          }
          var codeSegments = key.split(".");
          /** @type {number} */
          var i = -1;
          var charLen = codeSegments.length;
          for (;++i < charLen && null != obj;) {
            obj = obj[codeSegments[i]];
          }
          return obj;
        },
        /**
         * @param {?} obj
         * @param {string} key
         * @param {?} value
         * @return {?}
         */
        set : function(obj, key, value) {
          if (key = fn(key), key.indexOf(".") < 0) {
            return void(obj[key] = value);
          }
          var codeSegments = key.split(".");
          /** @type {number} */
          var i = -1;
          /** @type {number} */
          var charLen = codeSegments.length - 1;
          for (;++i < charLen;) {
            if (null == obj[codeSegments[i]]) {
              obj[codeSegments[i]] = {};
            }
            obj = obj[codeSegments[i]];
          }
          obj[codeSegments[i]] = value;
        },
        /**
         * @param {string} set
         * @return {?}
         */
        baseKey : function(set) {
          return set.indexOf(".") > 0 ? set.split(".")[0] : set;
        },
        /**
         * @return {?}
         */
        hash : function() {
          return Object.create(null);
        },
        /**
         * @param {Element} elem
         * @param {string} name
         * @return {?}
         */
        attr : function(elem, name) {
          /** @type {string} */
          var attr = options.prefix + "-" + name;
          var getter = elem.getAttribute(attr);
          return null !== getter && elem.removeAttribute(attr), getter;
        },
        /**
         * @param {Object} o
         * @param {string} name
         * @param {Function} x
         * @param {boolean} enumerable
         * @param {?} writable
         * @return {undefined}
         */
        defProtected : function(o, name, x, enumerable, writable) {
          defineProperty(o, name, {
            /** @type {Function} */
            value : x,
            enumerable : enumerable,
            writable : writable,
            configurable : true
          });
        },
        /**
         * @param {string} obj
         * @return {?}
         */
        isObject : function(obj) {
          return typeof obj === object && (obj && !Array.isArray(obj));
        },
        /**
         * @param {?} it
         * @return {?}
         */
        isTrueObject : function(it) {
          return "[object Object]" === ostring.call(it);
        },
        /**
         * @param {string} type
         * @param {Function} callback
         * @return {?}
         */
        bind : function(type, callback) {
          return function(tx) {
            return type.call(callback, tx);
          };
        },
        /**
         * @param {?} arg
         * @return {?}
         */
        guard : function(arg) {
          return null == arg ? "" : "object" == typeof arg ? JSON.stringify(arg) : arg;
        },
        /**
         * @param {number} val
         * @return {?}
         */
        checkNumber : function(val) {
          return isNaN(val) || (null === val || "boolean" == typeof val) ? val : Number(val);
        },
        /**
         * @param {?} obj
         * @param {?} obj2
         * @return {?}
         */
        extend : function(obj, obj2) {
          var name;
          for (name in obj2) {
            if (obj[name] !== obj2[name]) {
              obj[name] = obj2[name];
            }
          }
          return obj;
        },
        /**
         * @param {Array} array
         * @return {?}
         */
        unique : function(array) {
          var method;
          var collection = self.hash();
          var i = array.length;
          /** @type {Array} */
          var results = [];
          for (;i--;) {
            method = array[i];
            if (!collection[method]) {
              /** @type {number} */
              collection[method] = 1;
              results.push(method);
            }
          }
          return results;
        },
        /**
         * @param {string} prop
         * @return {?}
         */
        toConstructor : function(prop) {
          return found = found || matches("./viewmodel"), self.isObject(prop) ? found.extend(prop) : "function" == typeof prop ? prop : null;
        },
        /**
         * @param {Object} p
         * @return {undefined}
         */
        checkFilter : function(p) {
          if (rhtml.test(p.toString())) {
            /** @type {boolean} */
            p.computed = true;
          }
        },
        /**
         * @param {Object} options
         * @return {undefined}
         */
        processOptions : function(options) {
          var i;
          var r = options.components;
          var obj = options.partials;
          var template = options.template;
          var filters = options.filters;
          if (r) {
            for (i in r) {
              r[i] = self.toConstructor(r[i]);
            }
          }
          if (obj) {
            for (i in obj) {
              obj[i] = self.toFragment(obj[i]);
            }
          }
          if (filters) {
            for (i in filters) {
              self.checkFilter(filters[i]);
            }
          }
          if (template) {
            options.template = self.toFragment(template);
          }
        },
        /**
         * @param {Function} fn
         * @return {undefined}
         */
        nextTick : function(fn) {
          nextTick(fn, 0);
        },
        /**
         * @param {Element} element
         * @param {Object} className
         * @return {undefined}
         */
        addClass : function(element, className) {
          if (hasClassListProperty) {
            element.classList.add(className);
          } else {
            /** @type {string} */
            var targetClass = " " + element.className + " ";
            if (targetClass.indexOf(" " + className + " ") < 0) {
              /** @type {string} */
              element.className = (targetClass + className).trim();
            }
          }
        },
        /**
         * @param {Element} element
         * @param {Error} className
         * @return {undefined}
         */
        removeClass : function(element, className) {
          if (hasClassListProperty) {
            element.classList.remove(className);
          } else {
            /** @type {string} */
            var text = " " + element.className + " ";
            /** @type {string} */
            var cx = " " + className + " ";
            for (;text.indexOf(cx) >= 0;) {
              /** @type {string} */
              text = text.replace(cx, " ");
            }
            /** @type {string} */
            element.className = text.trim();
          }
        },
        /**
         * @param {Object} object
         * @return {?}
         */
        objectToArray : function(object) {
          var value;
          var method;
          /** @type {Array} */
          var list = [];
          var name;
          for (name in object) {
            value = object[name];
            method = self.isObject(value) ? value : {
              $value : value
            };
            /** @type {string} */
            method.$key = name;
            list.push(method);
          }
          return list;
        }
      };
      patchConsole();
    });
    require.register("vue/src/fragment.js", function(dataAndEvents, deepDataAndEvents, module) {
      var wrapMap = {
        legend : [1, "<fieldset>", "</fieldset>"],
        tr : [2, "<table><tbody>", "</tbody></table>"],
        col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        _default : [0, "", ""]
      };
      /** @type {Array} */
      wrapMap.td = wrapMap.th = [3, "<table><tbody><tr>", "</tr></tbody></table>"];
      /** @type {Array} */
      wrapMap.option = wrapMap.optgroup = [1, '<select multiple="multiple">', "</select>"];
      /** @type {Array} */
      wrapMap.thead = wrapMap.tbody = wrapMap.colgroup = wrapMap.caption = wrapMap.tfoot = [1, "<table>", "</table>"];
      /** @type {Array} */
      wrapMap.text = wrapMap.circle = wrapMap.ellipse = wrapMap.line = wrapMap.path = wrapMap.polygon = wrapMap.polyline = wrapMap.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', "</svg>"];
      /** @type {RegExp} */
      var quickExpr = /<([\w:]+)/;
      /**
       * @param {string} str
       * @return {?}
       */
      module.exports = function(str) {
        if ("string" != typeof str) {
          return str;
        }
        if ("#" === str.charAt(0)) {
          /** @type {(HTMLElement|null)} */
          var state = document.getElementById(str.slice(1));
          if (!state) {
            return;
          }
          if ("TEMPLATE" === state.tagName && state.content) {
            return state.content;
          }
          /** @type {string} */
          str = state.innerHTML;
        }
        /** @type {DocumentFragment} */
        var result = document.createDocumentFragment();
        /** @type {(Array.<string>|null)} */
        var json = quickExpr.exec(str);
        if (!json) {
          return result.appendChild(document.createTextNode(str)), result;
        }
        /** @type {string} */
        var tag = json[1];
        var args = wrapMap[tag] || wrapMap._default;
        var pageY = args[0];
        var name = args[1];
        var value = args[2];
        /** @type {Element} */
        var node = document.createElement("div");
        /** @type {string} */
        node.innerHTML = name + str.trim() + value;
        for (;pageY--;) {
          /** @type {(Node|null)} */
          node = node.lastChild;
        }
        if (node.firstChild === node.lastChild) {
          return result.appendChild(node.firstChild), result;
        }
        var child;
        for (;child = node.firstChild;) {
          if (1 === node.nodeType) {
            result.appendChild(child);
          }
        }
        return result;
      };
    });
    require.register("vue/src/compiler.js", function(dataAndEvents, require, module) {
      /**
       * @param {Object} node
       * @param {Object} context
       * @return {undefined}
       */
      function init(node, context) {
        var key;
        var i;
        var self = this;
        /** @type {boolean} */
        self.init = true;
        /** @type {boolean} */
        self.destroyed = false;
        context = self.options = context || {};
        options.processOptions(context);
        callback(self, context.compilerOptions);
        self.repeat = self.repeat || false;
        self.expCache = self.expCache || {};
        var el = self.el = self.setupElement(context);
        options.log("\nnew VM instance: " + el.tagName + "\n");
        self.vm = el.vue_vm = node;
        self.bindings = options.hash();
        /** @type {Array} */
        self.dirs = [];
        /** @type {Array} */
        self.deferred = [];
        /** @type {Array} */
        self.computed = [];
        /** @type {Array} */
        self.children = [];
        self.emitter = new Node(node);
        node.$ = {};
        node.$el = el;
        /** @type {Object} */
        node.$options = context;
        node.$compiler = self;
        /** @type {null} */
        node.$event = null;
        var obj = context.parent;
        if (obj && (self.parent = obj.$compiler, obj.$compiler.children.push(self), node.$parent = obj, "lazy" in context || (context.lazy = self.parent.options.lazy)), node.$root = freeze(self).vm, self.setupObserver(), context.methods) {
          for (key in context.methods) {
            self.createBinding(key);
          }
        }
        if (context.computed) {
          for (key in context.computed) {
            self.createBinding(key);
          }
        }
        var object = self.data = context.data || {};
        var iterable = context.defaultData;
        if (iterable) {
          for (key in iterable) {
            if (!hasOwnProperty.call(object, key)) {
              object[key] = iterable[key];
            }
          }
        }
        var attrs = context.paramAttributes;
        if (attrs) {
          i = attrs.length;
          for (;i--;) {
            object[attrs[i]] = options.checkNumber(self.eval(el.getAttribute(attrs[i])));
          }
        }
        callback(node, object);
        node.$data = object;
        self.execHook("created");
        object = self.data = node.$data;
        var value;
        for (key in node) {
          value = node[key];
          if ("$" !== key.charAt(0)) {
            if (object[key] !== value) {
              if ("function" != typeof value) {
                object[key] = value;
              }
            }
          }
        }
        self.observeData(object);
        if (context.template) {
          this.resolveContent();
        }
        self.compile(el, true);
        /** @type {number} */
        i = self.deferred.length;
        for (;i--;) {
          self.bindDirective(self.deferred[i]);
        }
        /** @type {null} */
        self.deferred = null;
        if (this.computed.length) {
          Base.parse(this.computed);
        }
        /** @type {boolean} */
        self.init = false;
        self.execHook("ready");
      }
      /**
       * @param {Object} object
       * @return {?}
       */
      function freeze(object) {
        for (;object.parent;) {
          object = object.parent;
        }
        return object;
      }
      var errors;
      var Node = require("./emitter");
      var _ = require("./observer");
      var settings = require("./config");
      var options = require("./utils");
      var Response = require("./binding");
      var model = require("./directive");
      var $ = require("./text-parser");
      var Base = require("./deps-parser");
      var jQuery = require("./exp-parser");
      /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
      var test = [].slice;
      var callback = options.extend;
      /** @type {function (this:Object, *): boolean} */
      var hasOwnProperty = {}.hasOwnProperty;
      /** @type {function (Object, string, Object): Object} */
      var setDescriptor = Object.defineProperty;
      /** @type {Array} */
      var tokenized = ["created", "ready", "beforeDestroy", "afterDestroy", "attached", "detached"];
      /** @type {Array} */
      var rawParams = ["if", "repeat", "view", "component"];
      var context = init.prototype;
      /**
       * @param {Object} self
       * @return {?}
       */
      context.setupElement = function(self) {
        var f;
        var newEl;
        var i;
        var attr;
        var attrs;
        var el = "string" == typeof self.el ? document.querySelector(self.el) : self.el || document.createElement(self.tagName || "div");
        var node = self.template;
        if (node) {
          if (el.hasChildNodes()) {
            /** @type {Element} */
            this.rawContent = document.createElement("div");
            for (;f = el.firstChild;) {
              this.rawContent.appendChild(f);
            }
          }
          if (self.replace && node.firstChild === node.lastChild) {
            if (newEl = node.firstChild.cloneNode(true), el.parentNode && (el.parentNode.insertBefore(newEl, el), el.parentNode.removeChild(el)), el.hasAttributes()) {
              i = el.attributes.length;
              for (;i--;) {
                attr = el.attributes[i];
                newEl.setAttribute(attr.name, attr.value);
              }
            }
            el = newEl;
          } else {
            el.appendChild(node.cloneNode(true));
          }
        }
        if (self.id && (el.id = self.id), self.className && (el.className = self.className), attrs = self.attributes) {
          for (attr in attrs) {
            el.setAttribute(attr, attrs[attr]);
          }
        }
        return el;
      };
      /**
       * @return {undefined}
       */
      context.resolveContent = function() {
        /**
         * @param {Node} node
         * @param {Array} values
         * @return {undefined}
         */
        function fn(node, values) {
          var pn = node.parentNode;
          /** @type {number} */
          var id = 0;
          var valuesLen = values.length;
          for (;valuesLen > id;id++) {
            pn.insertBefore(values[id], node);
          }
          pn.removeChild(node);
        }
        var item;
        var selector;
        var i;
        var ilen;
        var val;
        /** @type {Array.<?>} */
        var items = test.call(this.el.getElementsByTagName("content"));
        var context = this.rawContent;
        if (i = items.length) {
          for (;i--;) {
            item = items[i];
            if (context) {
              selector = item.getAttribute("select");
              if (selector) {
                /** @type {Array.<?>} */
                item.content = test.call(context.querySelectorAll(selector));
              } else {
                val = item;
              }
            } else {
              /** @type {Array.<?>} */
              item.content = test.call(item.childNodes);
            }
          }
          /** @type {number} */
          i = 0;
          /** @type {number} */
          ilen = items.length;
          for (;ilen > i;i++) {
            item = items[i];
            if (item !== val) {
              fn(item, item.content);
            }
          }
          if (context) {
            if (val) {
              fn(val, test.call(context.childNodes));
            }
          }
        }
        /** @type {null} */
        this.rawContent = null;
      };
      /**
       * @return {undefined}
       */
      context.setupObserver = function() {
        /**
         * @param {string} type
         * @return {undefined}
         */
        function fn(type) {
          Event(type);
          Base.catcher.emit("get", special[type]);
        }
        /**
         * @param {string} type
         * @param {string} val
         * @param {string} bytes
         * @return {undefined}
         */
        function update(type, val, bytes) {
          self.emit("change:" + type, val, bytes);
          Event(type);
          special[type].update(val);
        }
        /**
         * @param {string} method
         * @param {Function} fn
         * @return {undefined}
         */
        function serialize(method, fn) {
          self.on("hook:" + method, function() {
            fn.call(_this.vm);
          });
        }
        /**
         * @param {string} channel
         * @return {undefined}
         */
        function init(channel) {
          var tokenized = _this.children;
          if (tokenized) {
            var self;
            var index = tokenized.length;
            for (;index--;) {
              self = tokenized[index];
              if (self.el.parentNode) {
                /** @type {string} */
                channel = "hook:" + (channel ? "attached" : "detached");
                self.observer.emit(channel);
                self.emitter.emit(channel);
              }
            }
          }
        }
        /**
         * @param {string} type
         * @return {undefined}
         */
        function Event(type) {
          if (!special[type]) {
            _this.createBinding(type);
          }
        }
        var _this = this;
        var special = _this.bindings;
        var options = _this.options;
        var self = _this.observer = new Node(_this.vm);
        self.proxies = {};
        self.on("get", fn).on("set", update).on("mutate", update);
        var i;
        var key;
        var value;
        /** @type {number} */
        var index = tokenized.length;
        for (;index--;) {
          if (key = tokenized[index], value = options[key], Array.isArray(value)) {
            i = value.length;
            for (;i--;) {
              serialize(key, value[i]);
            }
          } else {
            if (value) {
              serialize(key, value);
            }
          }
        }
        self.on("hook:attached", function() {
          init(1);
        }).on("hook:detached", function() {
          init(0);
        });
      };
      /**
       * @param {string} val
       * @return {undefined}
       */
      context.observeData = function(val) {
        /**
         * @param {string} signal_eof
         * @return {undefined}
         */
        function next(signal_eof) {
          if ("$data" !== signal_eof) {
            fn();
          }
        }
        /**
         * @return {undefined}
         */
        function fn() {
          scope.update(self.data);
          data.emit("change:$data", self.data);
        }
        var self = this;
        var data = self.observer;
        _.observe(val, "", data);
        var scope = self.bindings.$data = new Response(self, "$data");
        scope.update(val);
        setDescriptor(self.vm, "$data", {
          /**
           * @return {?}
           */
          get : function() {
            return self.observer.emit("get", "$data"), self.data;
          },
          /**
           * @param {Function} obj
           * @return {undefined}
           */
          set : function(obj) {
            var value = self.data;
            _.unobserve(value, "", data);
            /** @type {Function} */
            self.data = obj;
            _.copyPaths(obj, value);
            _.observe(obj, "", data);
            fn();
          }
        });
        data.on("set", next).on("mutate", next);
      };
      /**
       * @param {Node} elem
       * @param {boolean} deepDataAndEvents
       * @return {undefined}
       */
      context.compile = function(elem, deepDataAndEvents) {
        var nodeType = elem.nodeType;
        if (1 === nodeType && "SCRIPT" !== elem.tagName) {
          this.compileElement(elem, deepDataAndEvents);
        } else {
          if (3 === nodeType) {
            if (settings.interpolate) {
              this.compileTextNode(elem);
            }
          }
        }
      };
      /**
       * @param {string} name
       * @param {Element} elem
       * @param {boolean} deepDataAndEvents
       * @return {?}
       */
      context.checkPriorityDir = function(name, elem, deepDataAndEvents) {
        var ret;
        var element;
        var value;
        return "component" === name && (deepDataAndEvents !== true && (value = this.resolveComponent(elem, void 0, true))) ? (element = this.parseDirective(name, "", elem), element.Ctor = value) : (ret = options.attr(elem, name), element = ret && this.parseDirective(name, ret, elem)), element ? deepDataAndEvents === true ? void options.warn("Directive v-" + name + " cannot be used on an already instantiated VM's root node. Use it from the parent's template instead.") : (this.deferred.push(element),
        true) : void 0;
      };
      /**
       * @param {Element} elem
       * @param {boolean} deepDataAndEvents
       * @return {undefined}
       */
      context.compileElement = function(elem, deepDataAndEvents) {
        if ("TEXTAREA" === elem.tagName && (elem.value && (elem.value = this.eval(elem.value))), elem.hasAttributes() || elem.tagName.indexOf("-") > -1) {
          if (null !== options.attr(elem, "pre")) {
            return;
          }
          var i;
          var len;
          var right;
          var left;
          /** @type {number} */
          i = 0;
          /** @type {number} */
          len = rawParams.length;
          for (;len > i;i++) {
            if (this.checkPriorityDir(rawParams[i], elem, deepDataAndEvents)) {
              return;
            }
          }
          elem.vue_trans = options.attr(elem, "transition");
          elem.vue_anim = options.attr(elem, "animation");
          elem.vue_effect = this.eval(options.attr(elem, "effect"));
          var group;
          var k;
          var u;
          var camelKey;
          var node;
          var data;
          var hash;
          /** @type {string} */
          var prefix = settings.prefix + "-";
          var classes = this.options.paramAttributes;
          if (deepDataAndEvents) {
            var step = options.attr(elem, "with");
            if (step) {
              node = this.parseDirective("with", step, elem, true);
              /** @type {number} */
              right = 0;
              left = node.length;
              for (;left > right;right++) {
                this.bindDirective(node[right], this.parent);
              }
            }
          }
          /** @type {Array.<?>} */
          var groups = test.call(elem.attributes);
          /** @type {number} */
          i = 0;
          /** @type {number} */
          len = groups.length;
          for (;len > i;i++) {
            if (group = groups[i], k = group.name, u = false, 0 === k.indexOf(prefix)) {
              /** @type {boolean} */
              u = true;
              hash = k.slice(prefix.length);
              node = this.parseDirective(hash, group.value, elem, true);
              /** @type {number} */
              right = 0;
              left = node.length;
              for (;left > right;right++) {
                this.bindDirective(node[right]);
              }
            } else {
              if (settings.interpolate) {
                camelKey = $.parseAttr(group.value);
                if (camelKey) {
                  data = this.parseDirective("attr", camelKey, elem);
                  data.arg = k;
                  if (classes && classes.indexOf(k) > -1) {
                    this.bindDirective(data, this.parent);
                  } else {
                    this.bindDirective(data);
                  }
                }
              }
            }
            if (u) {
              if ("cloak" !== hash) {
                elem.removeAttribute(k);
              }
            }
          }
        }
        if (elem.hasChildNodes()) {
          test.call(elem.childNodes).forEach(this.compile, this);
        }
      };
      /**
       * @param {Node} element
       * @return {undefined}
       */
      context.compileTextNode = function(element) {
        var checkSet = $.parse(element.nodeValue);
        if (checkSet) {
          var ret;
          var match;
          var result;
          /** @type {number} */
          var i = 0;
          var l = checkSet.length;
          for (;l > i;i++) {
            match = checkSet[i];
            /** @type {null} */
            result = null;
            if (match.key) {
              if (">" === match.key.charAt(0)) {
                /** @type {Comment} */
                ret = document.createComment("ref");
                result = this.parseDirective("partial", match.key.slice(1), ret);
              } else {
                if (match.html) {
                  /** @type {Comment} */
                  ret = document.createComment(settings.prefix + "-html");
                  result = this.parseDirective("html", match.key, ret);
                } else {
                  /** @type {Text} */
                  ret = document.createTextNode("");
                  result = this.parseDirective("text", match.key, ret);
                }
              }
            } else {
              /** @type {Text} */
              ret = document.createTextNode(match);
            }
            element.parentNode.insertBefore(ret, element);
            this.bindDirective(result);
          }
          element.parentNode.removeChild(element);
        }
      };
      /**
       * @param {Object} type
       * @param {string} value
       * @param {Element} second
       * @param {boolean} dataAndEvents
       * @return {?}
       */
      context.parseDirective = function(type, value, second, dataAndEvents) {
        /**
         * @param {Object} options
         * @return {?}
         */
        function iterator(options) {
          return new model(type, options, q, data_priv, second);
        }
        var data_priv = this;
        var q = data_priv.getOption("directives", type);
        if (q) {
          var obj = model.parse(value);
          return dataAndEvents ? obj.map(iterator) : iterator(obj[0]);
        }
      };
      /**
       * @param {Object} v
       * @param {Object} host
       * @return {?}
       */
      context.bindDirective = function(v, host) {
        if (v) {
          if (this.dirs.push(v), v.isEmpty || v.isLiteral) {
            return void(v.bind && v.bind());
          }
          var m;
          var self = host || this;
          var key = v.key;
          if (v.isExp) {
            m = self.createBinding(key, v);
          } else {
            for (;self && !self.hasKey(key);) {
              self = self.parent;
            }
            self = self || this;
            m = self.bindings[key] || self.createBinding(key);
          }
          m.dirs.push(v);
          v.binding = m;
          var click = m.val();
          if (v.bind) {
            v.bind(click);
          }
          v.$update(click, true);
        }
      };
      /**
       * @param {string} key
       * @param {boolean} h
       * @return {?}
       */
      context.createBinding = function(key, h) {
        options.log("  created binding: " + key);
        var self = this;
        var m = self.options.methods;
        var status = h && h.isExp;
        var s = h && h.isFn || m && m[key];
        var cache = self.bindings;
        var escaped = self.options.computed;
        var res = new Response(self, key, status, s);
        if (status) {
          self.defineExp(key, res, h);
        } else {
          if (s) {
            cache[key] = res;
            self.defineVmProp(key, res, m[key]);
          } else {
            if (cache[key] = res, res.root) {
              if (escaped && escaped[key]) {
                self.defineComputed(key, res, escaped[key]);
              } else {
                if ("$" !== key.charAt(0)) {
                  self.defineDataProp(key, res);
                } else {
                  self.defineVmProp(key, res, self.data[key]);
                  delete self.data[key];
                }
              }
            } else {
              if (escaped && escaped[options.baseKey(key)]) {
                self.defineExp(key, res);
              } else {
                _.ensurePath(self.data, key);
                var k = key.slice(0, key.lastIndexOf("."));
                if (!cache[k]) {
                  self.createBinding(k);
                }
              }
            }
          }
        }
        return res;
      };
      /**
       * @param {string} key
       * @param {Attr} args
       * @return {undefined}
       */
      context.defineDataProp = function(key, args) {
        var params = this;
        var o = params.data;
        var f = o.__emitter__;
        if (!hasOwnProperty.call(o, key)) {
          o[key] = void 0;
        }
        if (f) {
          if (!hasOwnProperty.call(f.values, key)) {
            _.convertKey(o, key);
          }
        }
        args.value = o[key];
        setDescriptor(params.vm, key, {
          /**
           * @return {?}
           */
          get : function() {
            return params.data[key];
          },
          /**
           * @param {?} value
           * @return {undefined}
           */
          set : function(value) {
            params.data[key] = value;
          }
        });
      };
      /**
       * @param {string} key
       * @param {Attr} o
       * @param {Function} i
       * @return {undefined}
       */
      context.defineVmProp = function(key, o, i) {
        var self = this.observer;
        /** @type {Function} */
        o.value = i;
        setDescriptor(this.vm, key, {
          /**
           * @return {?}
           */
          get : function() {
            return _.shouldGet && self.emit("get", key), o.value;
          },
          /**
           * @param {?} value
           * @return {undefined}
           */
          set : function(value) {
            self.emit("set", key, value);
          }
        });
      };
      /**
       * @param {string} selector
       * @param {(Object|string)} els
       * @param {string} object
       * @return {undefined}
       */
      context.defineExp = function(selector, els, object) {
        var data = object && object.computedKey;
        var unlock = data ? object.expression : selector;
        var cache = this.expCache[unlock];
        if (!cache) {
          cache = this.expCache[unlock] = jQuery.parse(data || selector, this);
        }
        if (cache) {
          this.markComputed(els, cache);
        }
      };
      /**
       * @param {string} key
       * @param {(Object|string)} o
       * @param {Object} walkers
       * @return {undefined}
       */
      context.defineComputed = function(key, o, walkers) {
        this.markComputed(o, walkers);
        setDescriptor(this.vm, key, {
          get : o.value.$get,
          set : o.value.$set
        });
      };
      /**
       * @param {(Object|string)} o
       * @param {Object} obj
       * @return {undefined}
       */
      context.markComputed = function(o, obj) {
        /** @type {boolean} */
        o.isComputed = true;
        if (o.isFn) {
          /** @type {Object} */
          o.value = obj;
        } else {
          if ("function" == typeof obj) {
            obj = {
              $get : obj
            };
          }
          o.value = {
            $get : options.bind(obj.$get, this.vm),
            $set : obj.$set ? options.bind(obj.$set, this.vm) : void 0
          };
        }
        this.computed.push(o);
      };
      /**
       * @param {string} key
       * @param {string} name
       * @param {string} deepDataAndEvents
       * @return {?}
       */
      context.getOption = function(key, name, deepDataAndEvents) {
        var buttons = this.options;
        var jQuery = this.parent;
        var _cache = settings.globalAssets;
        var o = buttons[key] && buttons[key][name] || (jQuery ? jQuery.getOption(key, name, deepDataAndEvents) : _cache[key] && _cache[key][name]);
        return o || (deepDataAndEvents || ("string" != typeof name || options.warn("Unknown " + key.slice(0, -1) + ": " + name))), o;
      };
      /**
       * @param {string} event
       * @return {undefined}
       */
      context.execHook = function(event) {
        /** @type {string} */
        event = "hook:" + event;
        this.observer.emit(event);
        this.emitter.emit(event);
      };
      /**
       * @param {string} key
       * @return {?}
       */
      context.hasKey = function(key) {
        var index = options.baseKey(key);
        return hasOwnProperty.call(this.data, index) || hasOwnProperty.call(this.vm, index);
      };
      /**
       * @param {?} s
       * @param {string} name
       * @return {?}
       */
      context.eval = function(s, name) {
        var code = $.parseAttr(s);
        return code ? jQuery.eval(code, this, name) : s;
      };
      /**
       * @param {Element} elem
       * @param {Object} name
       * @param {boolean} dataAndEvents
       * @return {?}
       */
      context.resolveComponent = function(elem, name, dataAndEvents) {
        errors = errors || require("./viewmodel");
        var ret = options.attr(elem, "component");
        var key = elem.tagName;
        var err = this.eval(ret, name);
        var err2 = key.indexOf("-") > 0 && key.toLowerCase();
        var components = this.getOption("components", err || err2, true);
        return err && (!components && options.warn("Unknown component: " + err)), dataAndEvents ? "" === ret ? errors : components : components || errors;
      };
      /**
       * @param {boolean} dataAndEvents
       * @return {undefined}
       */
      context.destroy = function(dataAndEvents) {
        if (!this.destroyed) {
          var i;
          var index;
          var k;
          var arg;
          var list;
          var _ref;
          var self = this;
          var vm = self.vm;
          var el = self.el;
          var rules = self.dirs;
          var result = self.computed;
          var bindings = self.bindings;
          var children = self.children;
          var parent = self.parent;
          self.execHook("beforeDestroy");
          _.unobserve(self.data, "", self.observer);
          i = children.length;
          for (;i--;) {
            children[i].destroy(true);
          }
          i = rules.length;
          for (;i--;) {
            arg = rules[i];
            if (arg.binding) {
              if (arg.binding.compiler !== self) {
                list = arg.binding.dirs;
                if (list) {
                  index = list.indexOf(arg);
                  if (index > -1) {
                    list.splice(index, 1);
                  }
                }
              }
            }
            arg.$unbind();
          }
          i = result.length;
          for (;i--;) {
            result[i].unbind();
          }
          for (k in bindings) {
            _ref = bindings[k];
            if (_ref) {
              _ref.unbind();
            }
          }
          if (parent) {
            index = parent.children.indexOf(self);
            if (index > -1) {
              parent.children.splice(index, 1);
            }
          }
          if (!dataAndEvents) {
            if (el === document.body) {
              /** @type {string} */
              el.innerHTML = "";
            } else {
              vm.$remove();
            }
          }
          /** @type {null} */
          el.vue_vm = null;
          /** @type {boolean} */
          self.destroyed = true;
          self.execHook("afterDestroy");
          self.observer.off();
          self.emitter.off();
        }
      };
      /** @type {function (Object, Object): undefined} */
      module.exports = init;
    });
    require.register("vue/src/viewmodel.js", function(dataAndEvents, extend, module) {
      /**
       * @param {string} id
       * @return {undefined}
       */
      function state(id) {
        new con(this, id);
      }
      /**
       * @param {(Element|string)} arg
       * @return {?}
       */
      function encode(arg) {
        return "string" == typeof arg ? document.querySelector(arg) : arg;
      }
      var con = extend("./compiler");
      var context = extend("./utils");
      var s = extend("./transition");
      var oldconfig = extend("./batcher");
      /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
      var __slice = [].slice;
      var node = context.defProtected;
      var j = context.nextTick;
      var destroyedRecords = new oldconfig;
      /** @type {number} */
      var rightId = 1;
      var sb = state.prototype;
      node(sb, "$get", function(url) {
        var request = context.get(this, url);
        return void 0 === request && this.$parent ? this.$parent.$get(url) : request;
      });
      node(sb, "$set", function(factory, result) {
        context.set(this, factory, result);
      });
      node(sb, "$watch", function(testNumber, fn) {
        /**
         * @return {undefined}
         */
        function load() {
          /** @type {Array.<?>} */
          var newArgs = __slice.call(arguments);
          destroyedRecords.push({
            id : id,
            override : true,
            /**
             * @return {undefined}
             */
            execute : function() {
              fn.apply(that, newArgs);
            }
          });
        }
        /** @type {number} */
        var id = rightId++;
        var that = this;
        /** @type {function (): undefined} */
        fn._fn = load;
        that.$compiler.observer.on("change:" + testNumber, load);
      });
      node(sb, "$unwatch", function(dataAndEvents, operation) {
        /** @type {Array} */
        var newArguments = ["change:" + dataAndEvents];
        var Events = this.$compiler.observer;
        if (operation) {
          newArguments.push(operation._fn);
        }
        Events.off.apply(Events, newArguments);
      });
      node(sb, "$destroy", function() {
        this.$compiler.destroy();
      });
      node(sb, "$broadcast", function() {
        var item;
        var items = this.$compiler.children;
        var count = items.length;
        for (;count--;) {
          item = items[count];
          item.emitter.applyEmit.apply(item.emitter, arguments);
          item.vm.$broadcast.apply(item.vm, arguments);
        }
      });
      node(sb, "$dispatch", function() {
        var parameters = this.$compiler;
        var emitter = parameters.emitter;
        var options = parameters.parent;
        emitter.applyEmit.apply(emitter, arguments);
        if (options) {
          options.vm.$dispatch.apply(options.vm, arguments);
        }
      });
      ["emit", "on", "off", "once"].forEach(function(value) {
        var eventName = "emit" === value ? "applyEmit" : value;
        node(sb, "$" + value, function() {
          var c = this.$compiler.emitter;
          c[eventName].apply(c, arguments);
        });
      });
      node(sb, "$appendTo", function(d, sqlt) {
        d = encode(d);
        var el = this.$el;
        s(el, 1, function() {
          d.appendChild(el);
          if (sqlt) {
            j(sqlt);
          }
        }, this.$compiler);
      });
      node(sb, "$remove", function(sqlt) {
        var el = this.$el;
        s(el, -1, function() {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
          if (sqlt) {
            j(sqlt);
          }
        }, this.$compiler);
      });
      node(sb, "$before", function(d, sqlt) {
        d = encode(d);
        var el = this.$el;
        s(el, 1, function() {
          d.parentNode.insertBefore(el, d);
          if (sqlt) {
            j(sqlt);
          }
        }, this.$compiler);
      });
      node(sb, "$after", function(d, sqlt) {
        d = encode(d);
        var el = this.$el;
        s(el, 1, function() {
          if (d.nextSibling) {
            d.parentNode.insertBefore(el, d.nextSibling);
          } else {
            d.parentNode.appendChild(el);
          }
          if (sqlt) {
            j(sqlt);
          }
        }, this.$compiler);
      });
      /** @type {function (string): undefined} */
      module.exports = state;
    });
    require.register("vue/src/binding.js", function(dataAndEvents, require, module) {
      /**
       * @param {Object} reviver
       * @param {string} key
       * @param {?} execResult
       * @param {boolean} embed_tokens
       * @return {undefined}
       */
      function parse(reviver, key, execResult, embed_tokens) {
        /** @type {number} */
        this.id = _id++;
        this.value = void 0;
        /** @type {boolean} */
        this.isExp = !!execResult;
        /** @type {boolean} */
        this.isFn = embed_tokens;
        /** @type {boolean} */
        this.root = !this.isExp && -1 === key.indexOf(".");
        /** @type {Object} */
        this.compiler = reviver;
        /** @type {string} */
        this.key = key;
        /** @type {Array} */
        this.dirs = [];
        /** @type {Array} */
        this.subs = [];
        /** @type {Array} */
        this.deps = [];
        /** @type {boolean} */
        this.unbound = false;
      }
      var Collection = require("./batcher");
      var ret = new Collection;
      /** @type {number} */
      var _id = 1;
      var that = parse.prototype;
      /**
       * @param {Function} val
       * @return {undefined}
       */
      that.update = function(val) {
        if ((!this.isComputed || this.isFn) && (this.value = val), this.dirs.length || this.subs.length) {
          var that = this;
          ret.push({
            id : this.id,
            /**
             * @return {undefined}
             */
            execute : function() {
              if (!that.unbound) {
                that._update();
              }
            }
          });
        }
      };
      /**
       * @return {undefined}
       */
      that._update = function() {
        var i = this.dirs.length;
        var udataCur = this.val();
        for (;i--;) {
          this.dirs[i].$update(udataCur);
        }
        this.pub();
      };
      /**
       * @return {?}
       */
      that.val = function() {
        return this.isComputed && !this.isFn ? this.value.$get() : this.value;
      };
      /**
       * @return {undefined}
       */
      that.pub = function() {
        var i = this.subs.length;
        for (;i--;) {
          this.subs[i].update();
        }
      };
      /**
       * @return {undefined}
       */
      that.unbind = function() {
        /** @type {boolean} */
        this.unbound = true;
        var i = this.dirs.length;
        for (;i--;) {
          this.dirs[i].$unbind();
        }
        i = this.deps.length;
        var set;
        for (;i--;) {
          set = this.deps[i].subs;
          var index = set.indexOf(this);
          if (index > -1) {
            set.splice(index, 1);
          }
        }
      };
      /** @type {function (Object, string, ?, boolean): undefined} */
      module.exports = parse;
    });
    require.register("vue/src/observer.js", function(dataAndEvents, require, Alarm) {
      /**
       * @param {string} method
       * @return {undefined}
       */
      function next(method) {
        request(test, method, function() {
          var pdataCur;
          var objects;
          /** @type {Array.<?>} */
          var args = __slice.call(arguments);
          var a = Array.prototype[method].apply(this, args);
          return "push" === method || "unshift" === method ? pdataCur = args : "pop" === method || "shift" === method ? objects = [a] : "splice" === method && (pdataCur = args.slice(2), objects = a), change(this, pdataCur), include(this, objects), this.__emitter__.emit("mutate", "", this, {
            method : method,
            args : args,
            result : a,
            inserted : pdataCur,
            removed : objects
          }), a;
        }, !original);
      }
      /**
       * @param {Object} el
       * @param {Array} data
       * @return {undefined}
       */
      function change(el, data) {
        if (data) {
          var d;
          var excludes;
          var n = data.length;
          for (;n--;) {
            d = data[n];
            if (scale(d)) {
              if (!d.__emitter__) {
                set(d);
                isObject(d);
              }
              excludes = d.__emitter__.owners;
              if (excludes.indexOf(el) < 0) {
                excludes.push(el);
              }
            }
          }
        }
      }
      /**
       * @param {?} path
       * @param {Array} objects
       * @return {undefined}
       */
      function include(path, objects) {
        if (objects) {
          var object;
          var i = objects.length;
          for (;i--;) {
            if (object = objects[i], object && object.__emitter__) {
              var files = object.__emitter__.owners;
              if (files) {
                files.splice(files.indexOf(path));
              }
            }
          }
        }
      }
      /**
       * @param {boolean} data
       * @return {?}
       */
      function scale(data) {
        return "object" == typeof data && (data && !data.$compiler);
      }
      /**
       * @param {string} step
       * @return {?}
       */
      function set(step) {
        if (step.__emitter__) {
          return true;
        }
        var ret = new Collection;
        return request(step, "__emitter__", ret), ret.on("set", function(dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
          if (ignoreMethodDoesntExist) {
            go(step);
          }
        }).on("mutate", function() {
          go(step);
        }), ret.values = L.hash(), ret.owners = [], false;
      }
      /**
       * @param {string} step
       * @return {undefined}
       */
      function go(step) {
        var tokenized = step.__emitter__.owners;
        var index = tokenized.length;
        for (;index--;) {
          tokenized[index].__emitter__.emit("set", "", "", true);
        }
      }
      /**
       * @param {?} arg
       * @return {undefined}
       */
      function isObject(arg) {
        if (isArray(arg)) {
          array(arg);
        } else {
          add(arg);
        }
      }
      /**
       * @param {Object} value
       * @param {Object} a
       * @return {undefined}
       */
      function cb(value, a) {
        if (original) {
          /** @type {Object} */
          value.__proto__ = a;
        } else {
          var prefix;
          for (prefix in a) {
            request(value, prefix, a[prefix]);
          }
        }
      }
      /**
       * @param {Object} value
       * @return {undefined}
       */
      function add(value) {
        cb(value, url);
        var k;
        for (k in value) {
          find(value, k);
        }
      }
      /**
       * @param {Object} val
       * @return {undefined}
       */
      function array(val) {
        cb(val, test);
        change(val, val);
      }
      /**
       * @param {Object} results
       * @param {string} key
       * @param {boolean} store
       * @return {undefined}
       */
      function find(results, key, store) {
        /**
         * @param {string} value
         * @param {boolean} msg
         * @return {undefined}
         */
        function cb(value, msg) {
          /** @type {string} */
          flags[key] = value;
          self.emit("set", key, value, msg);
          if (isArray(value)) {
            self.emit("set", key + ".length", value.length, msg);
          }
          init(value, key, self);
        }
        var code = key.charAt(0);
        if ("$" !== code && "_" !== code) {
          var self = results.__emitter__;
          var flags = self.values;
          cb(results[key], store);
          _Object_defineProperty(results, key, {
            enumerable : true,
            configurable : true,
            /**
             * @return {?}
             */
            get : function() {
              var value = flags[key];
              return support.shouldGet && self.emit("get", key), value;
            },
            /**
             * @param {string} value
             * @return {undefined}
             */
            set : function(value) {
              var el = flags[key];
              fn(el, key, self);
              register(value, el);
              cb(value, true);
            }
          });
        }
      }
      /**
       * @param {Object} result
       * @return {undefined}
       */
      function func(result) {
        var self = result && result.__emitter__;
        if (self) {
          if (isArray(result)) {
            self.emit("set", "length", result.length);
          } else {
            var k;
            var b;
            for (k in result) {
              b = result[k];
              self.emit("set", k, b);
              func(b);
            }
          }
        }
      }
      /**
       * @param {Object} target
       * @param {Object} obj
       * @return {undefined}
       */
      function register(target, obj) {
        if ($(target) && $(obj)) {
          var key;
          var val;
          var value;
          for (key in obj) {
            if (!__hasProp.call(target, key)) {
              val = obj[key];
              if (isArray(val)) {
                /** @type {Array} */
                target[key] = [];
              } else {
                if ($(val)) {
                  value = target[key] = {};
                  register(value, val);
                } else {
                  target[key] = void 0;
                }
              }
            }
          }
        }
      }
      /**
       * @param {Object} parent
       * @param {string} arg
       * @return {undefined}
       */
      function process(parent, arg) {
        var key;
        var tmp_keys = arg.split(".");
        /** @type {number} */
        var i = 0;
        /** @type {number} */
        var l = tmp_keys.length - 1;
        for (;l > i;i++) {
          key = tmp_keys[i];
          if (!parent[key]) {
            parent[key] = {};
            if (parent.__emitter__) {
              find(parent, key);
            }
          }
          parent = parent[key];
        }
        if ($(parent)) {
          key = tmp_keys[i];
          if (!__hasProp.call(parent, key)) {
            parent[key] = void 0;
            if (parent.__emitter__) {
              find(parent, key);
            }
          }
        }
      }
      /**
       * @param {string} d
       * @param {string} data
       * @param {Object} client
       * @return {undefined}
       */
      function init(d, data, client) {
        if (scale(d)) {
          /** @type {string} */
          var key = data ? data + "." : "";
          var center = set(d);
          var s = d.__emitter__;
          client.proxies = client.proxies || {};
          var self = client.proxies[key] = {
            /**
             * @param {number} name
             * @return {undefined}
             */
            get : function(name) {
              client.emit("get", key + name);
            },
            /**
             * @param {?} type
             * @param {string} callback
             * @param {?} v
             * @return {undefined}
             */
            set : function(type, callback, v) {
              if (type) {
                client.emit("set", key + type, callback);
              }
              if (data) {
                if (v) {
                  client.emit("set", data, d, true);
                }
              }
            },
            /**
             * @param {?} val
             * @param {string} message
             * @param {Object} callback
             * @return {undefined}
             */
            mutate : function(val, message, callback) {
              var d = val ? key + val : data;
              client.emit("mutate", d, message, callback);
              var method = callback.method;
              if ("sort" !== method) {
                if ("reverse" !== method) {
                  client.emit("set", d + ".length", message.length);
                }
              }
            }
          };
          s.on("get", self.get).on("set", self.set).on("mutate", self.mutate);
          if (center) {
            func(d);
          } else {
            isObject(d);
          }
        }
      }
      /**
       * @param {Object} view
       * @param {boolean} key
       * @param {?} connection
       * @return {undefined}
       */
      function fn(view, key, connection) {
        if (view && view.__emitter__) {
          /** @type {string} */
          key = key ? key + "." : "";
          var binding = connection.proxies[key];
          if (binding) {
            view.__emitter__.off("get", binding.get).off("set", binding.set).off("mutate", binding.mutate);
            /** @type {null} */
            connection.proxies[key] = null;
          }
        }
      }
      var Collection = require("./emitter");
      var L = require("./utils");
      var request = L.defProtected;
      var $ = L.isObject;
      /** @type {function (*): boolean} */
      var isArray = Array.isArray;
      /** @type {function (this:Object, *): boolean} */
      var __hasProp = {}.hasOwnProperty;
      /** @type {function (Object, string, Object): Object} */
      var _Object_defineProperty = Object.defineProperty;
      /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
      var __slice = [].slice;
      /** @type {(Object|null)} */
      var original = {}.__proto__;
      /** @type {Object} */
      var test = Object.create(Array.prototype);
      ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(next);
      request(test, "$set", function(i, x) {
        return this.splice(i, 1, x)[0];
      }, !original);
      request(test, "$remove", function(i) {
        return "number" != typeof i && (i = this.indexOf(i)), i > -1 ? this.splice(i, 1)[0] : void 0;
      }, !original);
      /** @type {Object} */
      var url = Object.create(Object.prototype);
      request(url, "$add", function(key, value) {
        if (!__hasProp.call(this, key)) {
          this[key] = value;
          find(this, key, true);
        }
      }, !original);
      request(url, "$delete", function(k) {
        if (__hasProp.call(this, k)) {
          this[k] = void 0;
          delete this[k];
          this.__emitter__.emit("delete", k);
        }
      }, !original);
      var support = Alarm.exports = {
        shouldGet : false,
        /** @type {function (string, string, Object): undefined} */
        observe : init,
        /** @type {function (Object, boolean, ?): undefined} */
        unobserve : fn,
        /** @type {function (Object, string): undefined} */
        ensurePath : process,
        /** @type {function (Object, Object): undefined} */
        copyPaths : register,
        /** @type {function (?): undefined} */
        watch : isObject,
        /** @type {function (string): ?} */
        convert : set,
        /** @type {function (Object, string, boolean): undefined} */
        convertKey : find
      };
    });
    require.register("vue/src/directive.js", function(dataAndEvents, require, module) {
      /**
       * @param {string} path
       * @param {Object} data
       * @param {Object} attrs
       * @param {Object} context
       * @param {Object} obj
       * @return {?}
       */
      function bind(path, data, attrs, context, obj) {
        /** @type {number} */
        this.id = _id++;
        /** @type {string} */
        this.name = path;
        /** @type {Object} */
        this.compiler = context;
        this.vm = context.vm;
        /** @type {Object} */
        this.el = obj;
        /** @type {boolean} */
        this.computeFilters = false;
        this.key = data.key;
        this.arg = data.arg;
        this.expression = data.expression;
        /** @type {boolean} */
        var enable = "" === this.expression;
        if ("function" == typeof attrs) {
          /** @type {Object} */
          this[enable ? "bind" : "update"] = attrs;
        } else {
          var attr;
          for (attr in attrs) {
            this[attr] = attrs[attr];
          }
        }
        if (enable || this.isEmpty) {
          return void(this.isEmpty = true);
        }
        if (helper.Regex.test(this.key)) {
          this.key = context.eval(this.key);
          if (this.isLiteral) {
            this.expression = this.key;
          }
        }
        var fn;
        var k;
        var target;
        var queueLen;
        var isExp;
        var queue = data.filters;
        if (queue) {
          /** @type {Array} */
          this.filters = [];
          /** @type {number} */
          target = 0;
          queueLen = queue.length;
          for (;queueLen > target;target++) {
            fn = queue[target];
            k = this.compiler.getOption("filters", fn.name);
            if (k) {
              fn.apply = k;
              this.filters.push(fn);
              if (k.computed) {
                /** @type {boolean} */
                isExp = true;
              }
            }
          }
        }
        if (!(this.filters && this.filters.length)) {
          /** @type {null} */
          this.filters = null;
        }
        if (isExp) {
          this.computedKey = bind.inlineFilters(this.key, this.filters);
          /** @type {null} */
          this.filters = null;
        }
        /** @type {boolean} */
        this.isExp = isExp || (!rhtml.test(this.key) || reWhitespace.test(this.key));
      }
      /**
       * @param {string} ret
       * @return {?}
       */
      function fn(ret) {
        return ret.indexOf('"') > -1 ? ret.replace(rreturn, "'") : ret;
      }
      /** @type {number} */
      var _id = 1;
      /** @type {RegExp} */
      var rchecked = /^[\w\$-]+$/;
      /** @type {RegExp} */
      var core_rnotwhite = /[^\s'"]+|'[^']+'|"[^"]+"/g;
      /** @type {RegExp} */
      var reWhitespace = /^\$(parent|root)\./;
      /** @type {RegExp} */
      var rhtml = /^[\w\.$]+$/;
      /** @type {RegExp} */
      var rreturn = /"/g;
      var helper = require("./text-parser");
      var elemProto = bind.prototype;
      /**
       * @param {Function} value
       * @param {(Function|string)} deepDataAndEvents
       * @return {undefined}
       */
      elemProto.$update = function(value, deepDataAndEvents) {
        if (!this.$lock) {
          if (deepDataAndEvents || (value !== this.value || value && "object" == typeof value)) {
            /** @type {Function} */
            this.value = value;
            if (this.update) {
              this.update(this.filters && !this.computeFilters ? this.$applyFilters(value) : value, deepDataAndEvents);
            }
          }
        }
      };
      /**
       * @param {Function} computed
       * @return {?}
       */
      elemProto.$applyFilters = function(computed) {
        var listener;
        /** @type {Function} */
        var result = computed;
        /** @type {number} */
        var i = 0;
        var l = this.filters.length;
        for (;l > i;i++) {
          listener = this.filters[i];
          result = listener.apply.apply(this.vm, [result].concat(listener.args));
        }
        return result;
      };
      /**
       * @return {undefined}
       */
      elemProto.$unbind = function() {
        if (this.el) {
          if (this.vm) {
            if (this.unbind) {
              this.unbind();
            }
            /** @type {null} */
            this.vm = this.el = this.binding = this.compiler = null;
          }
        }
      };
      /**
       * @param {string} text
       * @return {?}
       */
      bind.parse = function(text) {
        /**
         * @return {undefined}
         */
        function process() {
          self.expression = text.slice(start, i).trim();
          if (void 0 === self.key) {
            self.key = text.slice(last, i).trim();
          } else {
            if (pos !== start) {
              add();
            }
          }
          if (0 === i || self.key) {
            found.push(self);
          }
        }
        /**
         * @return {undefined}
         */
        function add() {
          var obj;
          var value = text.slice(pos, i).trim();
          if (value) {
            obj = {};
            var parts = value.match(core_rnotwhite);
            obj.name = parts[0];
            obj.args = parts.length > 1 ? parts.slice(1) : null;
          }
          if (obj) {
            (self.filters = self.filters || []).push(obj);
          }
          pos = i + 1;
        }
        var value;
        var chr;
        /** @type {boolean} */
        var bEven = false;
        /** @type {boolean} */
        var perm = false;
        /** @type {number} */
        var program = 0;
        /** @type {number} */
        var inverse = 0;
        /** @type {number} */
        var doubleQuotedValue = 0;
        /** @type {number} */
        var start = 0;
        /** @type {number} */
        var last = 0;
        /** @type {Array} */
        var found = [];
        var self = {};
        /** @type {number} */
        var pos = 0;
        /** @type {number} */
        var i = 0;
        var l = text.length;
        for (;l > i;i++) {
          chr = text.charAt(i);
          if (bEven) {
            if ("'" === chr) {
              /** @type {boolean} */
              bEven = !bEven;
            }
          } else {
            if (perm) {
              if ('"' === chr) {
                /** @type {boolean} */
                perm = !perm;
              }
            } else {
              if ("," !== chr || (doubleQuotedValue || (program || inverse))) {
                if (":" !== chr || (self.key || self.arg)) {
                  if ("|" === chr && ("|" !== text.charAt(i + 1) && "|" !== text.charAt(i - 1))) {
                    if (void 0 === self.key) {
                      /** @type {number} */
                      pos = i + 1;
                      self.key = text.slice(last, i).trim();
                    } else {
                      add();
                    }
                  } else {
                    if ('"' === chr) {
                      /** @type {boolean} */
                      perm = true;
                    } else {
                      if ("'" === chr) {
                        /** @type {boolean} */
                        bEven = true;
                      } else {
                        if ("(" === chr) {
                          doubleQuotedValue++;
                        } else {
                          if (")" === chr) {
                            doubleQuotedValue--;
                          } else {
                            if ("[" === chr) {
                              inverse++;
                            } else {
                              if ("]" === chr) {
                                inverse--;
                              } else {
                                if ("{" === chr) {
                                  program++;
                                } else {
                                  if ("}" === chr) {
                                    program--;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } else {
                  value = text.slice(start, i).trim();
                  if (rchecked.test(value)) {
                    /** @type {number} */
                    last = i + 1;
                    self.arg = value;
                  }
                }
              } else {
                process();
                self = {};
                /** @type {number} */
                start = last = pos = i + 1;
              }
            }
          }
        }
        return(0 === i || start !== i) && process(), found;
      };
      /**
       * @param {string} g
       * @param {Array} tokens
       * @return {?}
       */
      bind.inlineFilters = function(g, tokens) {
        var b;
        var token;
        /** @type {number} */
        var i = 0;
        var nTokens = tokens.length;
        for (;nTokens > i;i++) {
          token = tokens[i];
          /** @type {string} */
          b = token.args ? ',"' + token.args.map(fn).join('","') + '"' : "";
          /** @type {string} */
          g = 'this.$compiler.getOption("filters", "' + token.name + '").call(this,' + g + b + ")";
        }
        return g;
      };
      /** @type {function (string, Object, Object, Object, Object): ?} */
      module.exports = bind;
    });
    require.register("vue/src/exp-parser.js", function(a, Event) {
      /**
       * @param {string} string
       * @return {?}
       */
      function stringToArray(string) {
        return string = string.replace(rclass, "").replace(rreturn, ",").replace(baseEntitiesRegex, "").replace(rSlash, "").replace(badChars, ""), string ? string.split(/,+/) : [];
      }
      /**
       * @param {string} key
       * @param {Object} context
       * @param {number} node
       * @return {?}
       */
      function parse(key, context, node) {
        /** @type {string} */
        var resp = "";
        /** @type {number} */
        var r = 0;
        /** @type {Object} */
        var scope = context;
        if (node && void 0 !== self.get(node, key)) {
          return "$temp.";
        }
        for (;context && !context.hasKey(key);) {
          context = context.parent;
          r++;
        }
        if (context) {
          for (;r--;) {
            resp += "$parent.";
          }
          if (!context.bindings[key]) {
            if (!("$" === key.charAt(0))) {
              context.createBinding(key);
            }
          }
        } else {
          scope.createBinding(key);
        }
        return resp;
      }
      /**
       * @param {string} obj
       * @param {string} str
       * @return {?}
       */
      function print(obj, str) {
        var content;
        try {
          /** @type {Function} */
          content = new Function(obj);
        } catch (n) {
          self.warn("Error parsing expression: " + str);
        }
        return content;
      }
      /**
       * @param {?} s
       * @return {?}
       */
      function val(s) {
        return "$" === s.charAt(0) ? "\\" + s : s;
      }
      var self = Event("./utils");
      /** @type {RegExp} */
      var r20 = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
      /** @type {RegExp} */
      var cx = /"(\d+)"/g;
      /** @type {RegExp} */
      var rCRLF = /\n/g;
      /** @type {RegExp} */
      var escapable = new RegExp("constructor".split("").join("['\"+, ]*"));
      /** @type {RegExp} */
      var spaceRe = /\\u\d\d\d\d/;
      /** @type {string} */
      var messageFormat = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,undefined,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,Math";
      /** @type {RegExp} */
      var baseEntitiesRegex = new RegExp(["\\b" + messageFormat.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g");
      /** @type {RegExp} */
      var rclass = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+|[\{,]\s*[\w\$_]+\s*:/g;
      /** @type {RegExp} */
      var rreturn = /[^\w$]+/g;
      /** @type {RegExp} */
      var rSlash = /\b\d[^,]*/g;
      /** @type {RegExp} */
      var badChars = /^,+|,+$/g;
      /**
       * @param {string} string
       * @param {Object} parent
       * @param {?} template
       * @return {?}
       */
      a.parse = function(string, parent, template) {
        /**
         * @param {string} val
         * @return {?}
         */
        function encode(val) {
          /** @type {number} */
          var index = tokenized.length;
          return tokenized[index] = val.replace(rCRLF, "\\n"), '"' + index + '"';
        }
        /**
         * @param {string} url
         * @return {?}
         */
        function next(url) {
          var localBase = url.charAt(0);
          url = url.slice(1);
          /** @type {string} */
          var filePath = "this." + parse(url, parent, template) + url;
          return urlFetched[url] || (optsData += filePath + ";", urlFetched[url] = 1), localBase + filePath;
        }
        /**
         * @param {?} id
         * @param {number} index
         * @return {?}
         */
        function text(id, index) {
          return tokenized[index];
        }
        if (spaceRe.test(string) || escapable.test(string)) {
          return void self.warn("Unsafe expression: " + string);
        }
        var array = stringToArray(string);
        if (!array.length) {
          return print("return " + string, string);
        }
        array = self.unique(array);
        /** @type {string} */
        var optsData = "";
        var urlFetched = self.hash();
        /** @type {Array} */
        var tokenized = [];
        /** @type {RegExp} */
        var rclass = new RegExp("[^$\\w\\.](" + array.map(val).join("|") + ")[$\\w\\.]*\\b", "g");
        /** @type {string} */
        var result = (" " + string).replace(r20, encode).replace(rclass, next).replace(cx, text);
        return result = optsData + "return " + result, print(result, string);
      };
      /**
       * @param {string} code
       * @param {Object} options
       * @param {string} callback
       * @return {?}
       */
      a.eval = function(code, options, callback) {
        var r;
        var fn = a.parse(code, options, callback);
        return fn && (options.vm.$temp = callback, r = fn.call(options.vm), delete options.vm.$temp), r;
      };
    });
    require.register("vue/src/text-parser.js", function(options, fail) {
      /**
       * @return {?}
       */
      function wrapError() {
        var padding = regExpEscape(p);
        var tmp = regExpEscape(part);
        return new RegExp(padding + padding + padding + "?(.+?)" + tmp + "?" + tmp + tmp);
      }
      /**
       * @param {string} s
       * @return {?}
       */
      function regExpEscape(s) {
        return s.replace(rSlash, "\\$&");
      }
      /**
       * @param {Array} name
       * @return {undefined}
       */
      function fetch(name) {
        p = name[0];
        part = name[1];
        /** @type {Array} */
        options.delimiters = name;
        options.Regex = wrapError();
      }
      /**
       * @param {string} value
       * @return {?}
       */
      function parse(value) {
        if (!options.Regex.test(value)) {
          return null;
        }
        var match;
        var index;
        var key;
        var flags;
        /** @type {Array} */
        var keys = [];
        for (;match = value.match(options.Regex);) {
          index = match.index;
          if (index > 0) {
            keys.push(value.slice(0, index));
          }
          key = {
            key : match[1].trim()
          };
          flags = match[0];
          /** @type {boolean} */
          key.html = flags.charAt(2) === p && flags.charAt(flags.length - 3) === part;
          keys.push(key);
          value = value.slice(index + match[0].length);
        }
        return value.length && keys.push(value), keys;
      }
      /**
       * @param {string} value
       * @return {?}
       */
      function ok(value) {
        self = self || fail("./directive");
        var tokens = parse(value);
        if (!tokens) {
          return null;
        }
        if (1 === tokens.length) {
          return tokens[0].key;
        }
        var item;
        /** @type {Array} */
        var tagNameArr = [];
        /** @type {number} */
        var _i = 0;
        var nTokens = tokens.length;
        for (;nTokens > _i;_i++) {
          item = tokens[_i];
          tagNameArr.push(item.key ? callback(item.key) : '"' + item + '"');
        }
        return tagNameArr.join("+");
      }
      /**
       * @param {string} text
       * @return {?}
       */
      function callback(text) {
        if (text.indexOf("|") > -1) {
          var code = self.parse(text);
          var obj = code && code[0];
          if (obj) {
            if (obj.filters) {
              text = self.inlineFilters(obj.key, obj.filters);
            }
          }
        }
        return "(" + text + ")";
      }
      var self;
      /** @type {string} */
      var p = "{";
      /** @type {string} */
      var part = "}";
      /** @type {RegExp} */
      var rSlash = /[-.*+?^${}()|[\]\/\\]/g;
      options.Regex = wrapError();
      /** @type {function (string): ?} */
      options.parse = parse;
      /** @type {function (string): ?} */
      options.parseAttr = ok;
      /** @type {function (Array): undefined} */
      options.setDelimiters = fetch;
      /** @type {Array} */
      options.delimiters = [p, part];
    });
    require.register("vue/src/deps-parser.js", function(dataAndEvents, require, module) {
      /**
       * @param {Object} obj
       * @return {undefined}
       */
      function remove(obj) {
        if (!obj.isFn) {
          core.log("\n- " + obj.key);
          var scope = core.hash();
          /** @type {Array} */
          obj.deps = [];
          map.on("get", function(data) {
            var i = scope[data.key];
            if (!(i && i.compiler === data.compiler)) {
              if (!(data.compiler.repeat && !cb(data.compiler, obj.compiler))) {
                /** @type {Object} */
                scope[data.key] = data;
                core.log("  - " + data.key);
                obj.deps.push(data);
                data.subs.push(obj);
              }
            }
          });
          obj.value.$get();
          map.off("get");
        }
      }
      /**
       * @param {?} x
       * @param {?} s
       * @return {?}
       */
      function cb(x, s) {
        for (;s;) {
          if (x === s) {
            return true;
          }
          s = s.parent;
        }
      }
      var SourceMapGenerator = require("./emitter");
      var core = require("./utils");
      var Block = require("./observer");
      var map = new SourceMapGenerator;
      module.exports = {
        catcher : map,
        /**
         * @param {?} input
         * @return {undefined}
         */
        parse : function(input) {
          core.log("\nparsing dependencies...");
          /** @type {boolean} */
          Block.shouldGet = true;
          input.forEach(remove);
          /** @type {boolean} */
          Block.shouldGet = false;
          core.log("\ndone.");
        }
      };
    });
    require.register("vue/src/filters.js", function(dataAndEvents, fun, module) {
      /**
       * @param {Object} obj
       * @param {?} key
       * @return {?}
       */
      function callback(obj, key) {
        if (exports.isObject(obj)) {
          var i;
          for (i in obj) {
            if (callback(obj[i], key)) {
              return true;
            }
          }
        } else {
          if (null != obj) {
            return obj.toString().toLowerCase().indexOf(key) > -1;
          }
        }
      }
      /**
       * @param {number} name
       * @return {?}
       */
      function test(name) {
        return rparentsprev.test(name) ? name.slice(1, -1) : void 0;
      }
      var exports = fun("./utils");
      var safe_add = exports.get;
      /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
      var __slice = [].slice;
      /** @type {RegExp} */
      var rparentsprev = /^'.*'$/;
      var data = module.exports = exports.hash();
      /**
       * @param {Object} value
       * @return {?}
       */
      data.capitalize = function(value) {
        return value || 0 === value ? (value = value.toString(), value.charAt(0).toUpperCase() + value.slice(1)) : "";
      };
      /**
       * @param {boolean} value
       * @return {?}
       */
      data.uppercase = function(value) {
        return value || 0 === value ? value.toString().toUpperCase() : "";
      };
      /**
       * @param {boolean} value
       * @return {?}
       */
      data.lowercase = function(value) {
        return value || 0 === value ? value.toString().toLowerCase() : "";
      };
      /**
       * @param {number} v
       * @param {string} end
       * @return {?}
       */
      data.currency = function(v, end) {
        if (!v && 0 !== v) {
          return "";
        }
        end = end || "$";
        /** @type {string} */
        var split = Math.floor(v).toString();
        /** @type {number} */
        var j = split.length % 3;
        /** @type {string} */
        var st = j > 0 ? split.slice(0, j) + (split.length > 3 ? "," : "") : "";
        var s = "." + v.toFixed(2).slice(-2);
        return end + st + split.slice(j).replace(/(\d{3})(?=\d)/g, "$1,") + s;
      };
      /**
       * @param {number} n
       * @return {?}
       */
      data.pluralize = function(n) {
        /** @type {Array.<?>} */
        var args = __slice.call(arguments, 1);
        return args.length > 1 ? args[n - 1] || args[args.length - 1] : args[n - 1] || args[0] + "s";
      };
      var keys = {
        enter : 13,
        tab : 9,
        "delete" : 46,
        up : 38,
        left : 37,
        right : 39,
        down : 40,
        esc : 27
      };
      /**
       * @param {Function} callback
       * @param {?} index
       * @return {?}
       */
      data.key = function(callback, index) {
        if (callback) {
          var c = keys[index];
          return c || (c = parseInt(index, 10)), function(e) {
            return e.keyCode === c ? callback.call(this, e) : void 0;
          };
        }
      };
      /**
       * @param {Object} variables
       * @param {number} obj
       * @param {(number|string)} scope
       * @param {(number|string)} prop
       * @return {?}
       */
      data.filterBy = function(variables, obj, scope, prop) {
        if (scope) {
          if ("in" !== scope) {
            /** @type {(number|string)} */
            prop = scope;
          }
        }
        var key = test(obj) || this.$get(obj);
        return key ? (key = key.toLowerCase(), prop = prop && (test(prop) || this.$get(prop)), Array.isArray(variables) || (variables = exports.objectToArray(variables)), variables.filter(function(b) {
          return prop ? callback(safe_add(b, prop), key) : callback(b, key);
        })) : variables;
      };
      /** @type {boolean} */
      data.filterBy.computed = true;
      /**
       * @param {Object} variables
       * @param {number} obj
       * @param {number} prop
       * @return {?}
       */
      data.orderBy = function(variables, obj, prop) {
        var olda = test(obj) || this.$get(obj);
        if (!olda) {
          return variables;
        }
        if (!Array.isArray(variables)) {
          variables = exports.objectToArray(variables);
        }
        /** @type {number} */
        var elemW = 1;
        return prop && ("-1" === prop ? elemW = -1 : "!" === prop.charAt(0) ? (prop = prop.slice(1), elemW = this.$get(prop) ? 1 : -1) : elemW = this.$get(prop) ? -1 : 1), variables.slice().sort(function(a, b) {
          return a = safe_add(a, olda), b = safe_add(b, olda), a === b ? 0 : a > b ? elemW : -elemW;
        });
      };
      /** @type {boolean} */
      data.orderBy.computed = true;
    });
    require.register("vue/src/transition.js", function(dataAndEvents, require, module) {
      /**
       * @param {HTMLElement} el
       * @param {number} event
       * @param {Function} item
       * @param {boolean} key
       * @return {?}
       */
      function fn(el, event, item, key) {
        if (!params.trans) {
          return item(), data.CSS_SKIP;
        }
        var fn;
        var classList = el.classList;
        var start = el.vue_trans_cb;
        var group = node.enterClass;
        var className = node.leaveClass;
        var name = key ? params.anim : params.trans;
        return start && (el.removeEventListener(name, start), classList.remove(group), classList.remove(className), el.vue_trans_cb = null), event > 0 ? (classList.add(group), item(), key ? (fn = function(event) {
          if (event.target === el) {
            el.removeEventListener(name, fn);
            /** @type {null} */
            el.vue_trans_cb = null;
            classList.remove(group);
          }
        }, el.addEventListener(name, fn), el.vue_trans_cb = fn) : tests.push({
          /**
           * @return {undefined}
           */
          execute : function() {
            classList.remove(group);
          }
        }), data.CSS_E) : (el.offsetWidth || el.offsetHeight ? (classList.add(className), fn = function(event) {
          if (event.target === el) {
            el.removeEventListener(name, fn);
            /** @type {null} */
            el.vue_trans_cb = null;
            item();
            classList.remove(className);
          }
        }, el.addEventListener(name, fn), el.vue_trans_cb = fn) : item(), data.CSS_L);
      }
      /**
       * @param {string} obj
       * @param {number} set
       * @param {Function} value
       * @param {string} name
       * @param {Object} options
       * @return {?}
       */
      function add(obj, set, value, name, options) {
        /**
         * @param {?} onFailed
         * @param {?} time
         * @return {undefined}
         */
        function start(onFailed, time) {
          /** @type {number} */
          var key = oldTimeout(function() {
            onFailed();
            attrs.splice(attrs.indexOf(key), 1);
            if (!attrs.length) {
              /** @type {null} */
              obj.vue_timeouts = null;
            }
          }, time);
          attrs.push(key);
        }
        var player = options.getOption("effects", name);
        if (!player) {
          return value(), data.JS_SKIP;
        }
        var group = player.enter;
        var fn = player.leave;
        var attrs = obj.vue_timeouts;
        if (attrs) {
          var i = attrs.length;
          for (;i--;) {
            escape(attrs[i]);
          }
        }
        return attrs = obj.vue_timeouts = [], set > 0 ? "function" != typeof group ? (value(), data.JS_SKIP_E) : (group(obj, value, start), data.JS_E) : "function" != typeof fn ? (value(), data.JS_SKIP_L) : (fn(obj, value, start), data.JS_L);
      }
      /**
       * @return {?}
       */
      function init() {
        /** @type {Element} */
        var popup = document.createElement("vue");
        /** @type {string} */
        var string = "transitionend";
        var opts = {
          webkitTransition : "webkitTransitionEnd",
          transition : string,
          mozTransition : string
        };
        var self = {};
        var name;
        for (name in opts) {
          if (void 0 !== popup.style[name]) {
            self.trans = opts[name];
            break;
          }
        }
        return self.anim = "" === popup.style.animation ? "animationend" : "webkitAnimationEnd", self;
      }
      var params = init();
      var node = require("./config");
      var Block = require("./batcher");
      var tests = new Block;
      /** @type {function (this:Window, (Function|null|string), number, ...[*]): number} */
      var oldTimeout = window.setTimeout;
      /** @type {function (this:Window, (null|number|undefined)): ?} */
      var escape = window.clearTimeout;
      var data = {
        CSS_E : 1,
        CSS_L : 2,
        JS_E : 3,
        JS_L : 4,
        CSS_SKIP : -1,
        JS_SKIP : -2,
        JS_SKIP_E : -3,
        JS_SKIP_L : -4,
        INIT : -5,
        SKIP : -6
      };
      /**
       * @return {undefined}
       */
      tests._preFlush = function() {
        document.body.offsetHeight;
      };
      /** @type {function (string, number, ?, Object): ?} */
      var self = module.exports = function(style, key, actual, proto) {
        /**
         * @return {undefined}
         */
        var match = function() {
          actual();
          proto.execHook(key > 0 ? "attached" : "detached");
        };
        if (proto.init) {
          return match(), data.INIT;
        }
        /** @type {boolean} */
        var thisp = "" === style.vue_trans;
        /** @type {boolean} */
        var arr = "" === style.vue_anim;
        var length = style.vue_effect;
        return length ? add(style, key, match, length, proto) : thisp || arr ? fn(style, key, match, arr) : (match(), data.SKIP);
      };
      self.codes = data;
      /** @type {function (): ?} */
      self.sniff = init;
    });
    require.register("vue/src/batcher.js", function(dataAndEvents, fun, module) {
      /**
       * @return {undefined}
       */
      function constructor() {
        this.reset();
      }
      var exports = fun("./utils");
      var proto = constructor.prototype;
      /**
       * @param {Object} obj
       * @return {undefined}
       */
      proto.push = function(obj) {
        if (obj.id && this.has[obj.id]) {
          if (obj.override) {
            var event = this.has[obj.id];
            /** @type {boolean} */
            event.cancelled = true;
            this.queue.push(obj);
            /** @type {Object} */
            this.has[obj.id] = obj;
          }
        } else {
          this.queue.push(obj);
          /** @type {Object} */
          this.has[obj.id] = obj;
          if (!this.waiting) {
            /** @type {boolean} */
            this.waiting = true;
            exports.nextTick(exports.bind(this.flush, this));
          }
        }
      };
      /**
       * @return {undefined}
       */
      proto.flush = function() {
        if (this._preFlush) {
          this._preFlush();
        }
        /** @type {number} */
        var i = 0;
        for (;i < this.queue.length;i++) {
          var q = this.queue[i];
          if (!q.cancelled) {
            q.execute();
          }
        }
        this.reset();
      };
      /**
       * @return {undefined}
       */
      proto.reset = function() {
        this.has = exports.hash();
        /** @type {Array} */
        this.queue = [];
        /** @type {boolean} */
        this.waiting = false;
      };
      /** @type {function (): undefined} */
      module.exports = constructor;
    });
    require.register("vue/src/directives/index.js", function(dataAndEvents, $, module) {
      var self = $("../utils");
      var related = $("../config");
      var update = $("../transition");
      var options = module.exports = self.hash();
      options.component = {
        isLiteral : true,
        /**
         * @return {undefined}
         */
        bind : function() {
          if (!this.el.vue_vm) {
            this.childVM = new this.Ctor({
              el : this.el,
              parent : this.vm
            });
          }
        },
        /**
         * @return {undefined}
         */
        unbind : function() {
          if (this.childVM) {
            this.childVM.$destroy();
          }
        }
      };
      options.attr = {
        /**
         * @return {undefined}
         */
        bind : function() {
          var excludes = this.vm.$options.paramAttributes;
          this.isParam = excludes && excludes.indexOf(this.arg) > -1;
        },
        /**
         * @param {boolean} value
         * @return {undefined}
         */
        update : function(value) {
          if (value || 0 === value) {
            this.el.setAttribute(this.arg, value);
          } else {
            this.el.removeAttribute(this.arg);
          }
          if (this.isParam) {
            this.vm[this.arg] = self.checkNumber(value);
          }
        }
      };
      options.text = {
        /**
         * @return {undefined}
         */
        bind : function() {
          /** @type {string} */
          this.attr = 3 === this.el.nodeType ? "nodeValue" : "textContent";
        },
        /**
         * @param {string} html
         * @return {undefined}
         */
        update : function(html) {
          this.el[this.attr] = self.guard(html);
        }
      };
      /**
       * @param {boolean} value
       * @return {undefined}
       */
      options.show = function(value) {
        var e = this.el;
        /** @type {string} */
        var disp = value ? "" : "none";
        /**
         * @return {undefined}
         */
        var callback = function() {
          /** @type {string} */
          e.style.display = disp;
        };
        update(e, value ? 1 : -1, callback, this.compiler);
      };
      /**
       * @param {boolean} value
       * @return {undefined}
       */
      options["class"] = function(value) {
        if (this.arg) {
          self[value ? "addClass" : "removeClass"](this.el, this.arg);
        } else {
          if (this.lastVal) {
            self.removeClass(this.el, this.lastVal);
          }
          if (value) {
            self.addClass(this.el, value);
            /** @type {boolean} */
            this.lastVal = value;
          }
        }
      };
      options.cloak = {
        isEmpty : true,
        /**
         * @return {undefined}
         */
        bind : function() {
          var el = this.el;
          this.compiler.observer.once("hook:ready", function() {
            el.removeAttribute(related.prefix + "-cloak");
          });
        }
      };
      options.ref = {
        isLiteral : true,
        /**
         * @return {undefined}
         */
        bind : function() {
          var e = this.expression;
          if (e) {
            this.vm.$parent.$[e] = this.vm;
          }
        },
        /**
         * @return {undefined}
         */
        unbind : function() {
          var e = this.expression;
          if (e) {
            delete this.vm.$parent.$[e];
          }
        }
      };
      options.on = $("./on");
      options.repeat = $("./repeat");
      options.model = $("./model");
      options["if"] = $("./if");
      options["with"] = $("./with");
      options.html = $("./html");
      options.style = $("./style");
      options.partial = $("./partial");
      options.view = $("./view");
    });
    require.register("vue/src/directives/if.js", function(dataAndEvents, Event, $) {
      var self = Event("../utils");
      $.exports = {
        /**
         * @return {undefined}
         */
        bind : function() {
          this.parent = this.el.parentNode;
          /** @type {Comment} */
          this.ref = document.createComment("vue-if");
          this.Ctor = this.compiler.resolveComponent(this.el);
          this.parent.insertBefore(this.ref, this.el);
          this.parent.removeChild(this.el);
          if (self.attr(this.el, "view")) {
            self.warn("Conflict: v-if cannot be used together with v-view. Just set v-view's binding value to empty string to empty it.");
          }
          if (self.attr(this.el, "repeat")) {
            self.warn("Conflict: v-if cannot be used together with v-repeat. Use `v-show` or the `filterBy` filter instead.");
          }
        },
        /**
         * @param {string} val
         * @return {undefined}
         */
        update : function(val) {
          if (val) {
            if (!this.childVM) {
              this.childVM = new this.Ctor({
                el : this.el.cloneNode(true),
                parent : this.vm
              });
              if (this.compiler.init) {
                this.parent.insertBefore(this.childVM.$el, this.ref);
              } else {
                this.childVM.$before(this.ref);
              }
            }
          } else {
            this.unbind();
          }
        },
        /**
         * @return {undefined}
         */
        unbind : function() {
          if (this.childVM) {
            this.childVM.$destroy();
            /** @type {null} */
            this.childVM = null;
          }
        }
      };
    });
    require.register("vue/src/directives/repeat.js", function(dataAndEvents, fun, $) {
      /**
       * @param {Array} a
       * @param {?} list
       * @return {?}
       */
      function getIndex(a, list) {
        var obj;
        /** @type {number} */
        var i = 0;
        var l = a.length;
        for (;l > i;i++) {
          if (obj = a[i], !obj.$reused && obj.$value === list) {
            return i;
          }
        }
        return-1;
      }
      var exports = fun("../utils");
      var clone = fun("../config");
      $.exports = {
        /**
         * @return {undefined}
         */
        bind : function() {
          /** @type {string} */
          this.identifier = "$r" + this.id;
          this.expCache = exports.hash();
          var el = this.el;
          var d = this.container = el.parentNode;
          this.childId = this.compiler.eval(exports.attr(el, "ref"));
          /** @type {Comment} */
          this.ref = document.createComment(clone.prefix + "-repeat-" + this.key);
          d.insertBefore(this.ref, el);
          d.removeChild(el);
          /** @type {null} */
          this.collection = null;
          /** @type {null} */
          this.vms = null;
        },
        /**
         * @param {string} a
         * @return {undefined}
         */
        update : function(a) {
          if (!Array.isArray(a)) {
            if (exports.isObject(a)) {
              a = exports.objectToArray(a);
            } else {
              exports.warn("v-repeat only accepts Array or Object values.");
            }
          }
          this.oldVMs = this.vms;
          this.oldCollection = this.collection;
          a = this.collection = a || [];
          var c = a[0] && exports.isObject(a[0]);
          this.vms = this.oldCollection ? this.diff(a, c) : this.init(a, c);
          if (this.childId) {
            this.vm.$[this.childId] = this.vms;
          }
        },
        /**
         * @param {Array} a
         * @param {?} context
         * @return {?}
         */
        init : function(a, context) {
          var v;
          /** @type {Array} */
          var ret = [];
          /** @type {number} */
          var url = 0;
          var al = a.length;
          for (;al > url;url++) {
            v = this.build(a[url], url, context);
            ret.push(v);
            if (this.compiler.init) {
              this.container.insertBefore(v.$el, this.ref);
            } else {
              v.$before(this.ref);
            }
          }
          return ret;
        },
        /**
         * @param {Array} array
         * @param {Function} v
         * @return {?}
         */
        diff : function(array, v) {
          var i;
          var _len;
          var item;
          var node;
          var index;
          var options;
          var resolve;
          var ref;
          var parent = this.container;
          var b = this.oldVMs;
          /** @type {Array} */
          var result = [];
          result.length = array.length;
          /** @type {number} */
          i = 0;
          _len = array.length;
          for (;_len > i;i++) {
            item = array[i];
            if (v) {
              /** @type {number} */
              item.$index = i;
              if (item.__emitter__ && item.__emitter__[this.identifier]) {
                /** @type {boolean} */
                item.$reused = true;
              } else {
                result[i] = this.build(item, i, v);
              }
            } else {
              index = getIndex(b, item);
              if (index > -1) {
                /** @type {boolean} */
                b[index].$reused = true;
                /** @type {number} */
                b[index].$data.$index = i;
              } else {
                result[i] = this.build(item, i, v);
              }
            }
          }
          /** @type {number} */
          i = 0;
          _len = b.length;
          for (;_len > i;i++) {
            node = b[i];
            item = this.arg ? node.$data[this.arg] : node.$data;
            if (item.$reused) {
              /** @type {boolean} */
              node.$reused = true;
              delete item.$reused;
            }
            if (node.$reused) {
              node.$index = item.$index;
              if (item.$key) {
                if (item.$key !== node.$key) {
                  node.$key = item.$key;
                }
              }
              result[node.$index] = node;
            } else {
              if (item.__emitter__) {
                delete item.__emitter__[this.identifier];
              }
              node.$destroy();
            }
          }
          i = result.length;
          for (;i--;) {
            if (node = result[i], item = node.$data, options = result[i + 1], node.$reused) {
              ref = node.$el.nextSibling;
              for (;!ref.vue_vm && ref !== this.ref;) {
                ref = ref.nextSibling;
              }
              if (resolve = ref.vue_vm, resolve !== options) {
                if (options) {
                  ref = options.$el;
                  for (;!ref.parentNode;) {
                    options = result[ref.vue_vm.$index + 1];
                    ref = options ? options.$el : this.ref;
                  }
                  parent.insertBefore(node.$el, ref);
                } else {
                  parent.insertBefore(node.$el, this.ref);
                }
              }
              delete node.$reused;
              delete item.$index;
              delete item.$key;
            } else {
              node.$before(options ? options.$el : this.ref);
            }
          }
          return result;
        },
        /**
         * @param {Object} item
         * @param {Function} idx
         * @param {Function} obj
         * @return {?}
         */
        build : function(item, idx, obj) {
          var result;
          var propertyName;
          var arg = !obj || this.arg;
          if (arg) {
            /** @type {Object} */
            result = item;
            propertyName = this.arg || "$value";
            item = {};
            item[propertyName] = result;
          }
          /** @type {Function} */
          item.$index = idx;
          var name = this.el.cloneNode(true);
          var Component = this.compiler.resolveComponent(name, item);
          var dummyComponent = new Component({
            el : name,
            data : item,
            parent : this.vm,
            compilerOptions : {
              repeat : true,
              expCache : this.expCache
            }
          });
          return obj && ((result || item).__emitter__[this.identifier] = true), dummyComponent;
        },
        /**
         * @return {undefined}
         */
        unbind : function() {
          if (this.childId && delete this.vm.$[this.childId], this.vms) {
            var i = this.vms.length;
            for (;i--;) {
              this.vms[i].$destroy();
            }
          }
        }
      };
    });
    require.register("vue/src/directives/on.js", function(dataAndEvents, require, Class) {
      var utils = require("../utils");
      Class.exports = {
        isFn : true,
        /**
         * @return {undefined}
         */
        bind : function() {
          if (this.context = this.binding.isExp ? this.vm : this.binding.compiler.vm, "IFRAME" === this.el.tagName && "load" !== this.arg) {
            var self = this;
            /**
             * @return {undefined}
             */
            this.iframeBind = function() {
              self.el.contentWindow.addEventListener(self.arg, self.handler);
            };
            this.el.addEventListener("load", this.iframeBind);
          }
        },
        /**
         * @param {Function} fn
         * @return {?}
         */
        update : function(fn) {
          if ("function" != typeof fn) {
            return void utils.warn('Directive "v-on:' + this.expression + '" expects a method.');
          }
          this.reset();
          var fix = this.vm;
          var that = this.context;
          /**
           * @param {?} e
           * @return {?}
           */
          this.handler = function(e) {
            e.targetVM = fix;
            that.$event = e;
            var div = fn.call(that, e);
            return that.$event = null, div;
          };
          if (this.iframeBind) {
            this.iframeBind();
          } else {
            this.el.addEventListener(this.arg, this.handler);
          }
        },
        /**
         * @return {undefined}
         */
        reset : function() {
          var el = this.iframeBind ? this.el.contentWindow : this.el;
          el.removeEventListener(this.arg, this.handler);
        },
        /**
         * @return {undefined}
         */
        unbind : function() {
          this.reset();
          this.el.removeEventListener("load", this.iframeBind);
        }
      };
    });
    require.register("vue/src/directives/model.js", function(dataAndEvents, Event, Class) {
      /**
       * @param {Element} c
       * @return {?}
       */
      function addClass(c) {
        return f.call(c.options, function(pane) {
          return pane.selected;
        }).map(function(selectedOption) {
          return selectedOption.value || selectedOption.text;
        });
      }
      var self = Event("../utils");
      /** @type {boolean} */
      var s = navigator.userAgent.indexOf("MSIE 9.0") > 0;
      /** @type {function (this:(Array.<T>|string|{length: number}), (function (this:S, T, number, Array.<T>): ?|null), S=): Array.<T>} */
      var f = [].filter;
      Class.exports = {
        /**
         * @return {undefined}
         */
        bind : function() {
          var _this = this;
          var element = _this.el;
          var value = element.type;
          var tag = element.tagName;
          /** @type {boolean} */
          _this.lock = false;
          _this.ownerVM = _this.binding.compiler.vm;
          /** @type {string} */
          _this.event = _this.compiler.options.lazy || ("SELECT" === tag || ("checkbox" === value || "radio" === value)) ? "change" : "input";
          /** @type {string} */
          _this.attr = "checkbox" === value ? "checked" : "INPUT" === tag || ("SELECT" === tag || "TEXTAREA" === tag) ? "value" : "innerHTML";
          if ("SELECT" === tag) {
            if (element.hasAttribute("multiple")) {
              /** @type {boolean} */
              this.multi = true;
            }
          }
          /** @type {boolean} */
          var o = false;
          /**
           * @return {undefined}
           */
          _this.cLock = function() {
            /** @type {boolean} */
            o = true;
          };
          /**
           * @return {undefined}
           */
          _this.cUnlock = function() {
            /** @type {boolean} */
            o = false;
          };
          element.addEventListener("compositionstart", this.cLock);
          element.addEventListener("compositionend", this.cUnlock);
          /** @type {function (): undefined} */
          _this.set = _this.filters ? function() {
            if (!o) {
              var pos;
              try {
                pos = element.selectionStart;
              } catch (n) {
              }
              _this._set();
              self.nextTick(function() {
                if (void 0 !== pos) {
                  element.setSelectionRange(pos, pos);
                }
              });
            }
          } : function() {
            if (!o) {
              /** @type {boolean} */
              _this.lock = true;
              _this._set();
              self.nextTick(function() {
                /** @type {boolean} */
                _this.lock = false;
              });
            }
          };
          element.addEventListener(_this.event, _this.set);
          if (s) {
            /**
             * @return {undefined}
             */
            _this.onCut = function() {
              self.nextTick(function() {
                _this.set();
              });
            };
            /**
             * @param {?} event
             * @return {undefined}
             */
            _this.onDel = function(event) {
              if (46 === event.keyCode || 8 === event.keyCode) {
                _this.set();
              }
            };
            element.addEventListener("cut", _this.onCut);
            element.addEventListener("keyup", _this.onDel);
          }
        },
        /**
         * @return {undefined}
         */
        _set : function() {
          this.ownerVM.$set(this.key, this.multi ? addClass(this.el) : this.el[this.attr]);
        },
        /**
         * @param {string} value
         * @param {Function} deepDataAndEvents
         * @return {?}
         */
        update : function(value, deepDataAndEvents) {
          if (deepDataAndEvents && void 0 === value) {
            return this._set();
          }
          if (!this.lock) {
            var elem = this.el;
            if ("SELECT" === elem.tagName) {
              /** @type {number} */
              elem.selectedIndex = -1;
              if (this.multi && Array.isArray(value)) {
                value.forEach(this.updateSelect, this);
              } else {
                this.updateSelect(value);
              }
            } else {
              if ("radio" === elem.type) {
                /** @type {boolean} */
                elem.checked = value == elem.value;
              } else {
                if ("checkbox" === elem.type) {
                  /** @type {boolean} */
                  elem.checked = !!value;
                } else {
                  elem[this.attr] = self.guard(value);
                }
              }
            }
          }
        },
        /**
         * @param {string} aValue
         * @return {undefined}
         */
        updateSelect : function(aValue) {
          var options = this.el.options;
          var i = options.length;
          for (;i--;) {
            if (options[i].value == aValue) {
              /** @type {boolean} */
              options[i].selected = true;
              break;
            }
          }
        },
        /**
         * @return {undefined}
         */
        unbind : function() {
          var element = this.el;
          element.removeEventListener(this.event, this.set);
          element.removeEventListener("compositionstart", this.cLock);
          element.removeEventListener("compositionend", this.cUnlock);
          if (s) {
            element.removeEventListener("cut", this.onCut);
            element.removeEventListener("keyup", this.onDel);
          }
        }
      };
    });
    require.register("vue/src/directives/with.js", function(dataAndEvents, require, $) {
      var util = require("../utils");
      $.exports = {
        /**
         * @return {?}
         */
        bind : function() {
          var data = this;
          var name = data.arg;
          var key = data.key;
          var element = data.compiler;
          var container = data.binding.compiler;
          return element === container ? void(this.alone = true) : void(name && (element.bindings[name] || element.createBinding(name), element.observer.on("change:" + name, function(newValue) {
            if (!element.init) {
              if (!data.lock) {
                /** @type {boolean} */
                data.lock = true;
                util.nextTick(function() {
                  /** @type {boolean} */
                  data.lock = false;
                });
              }
              container.vm.$set(key, newValue);
            }
          })));
        },
        /**
         * @param {string} newValue
         * @return {undefined}
         */
        update : function(newValue) {
          if (!this.alone) {
            if (!this.lock) {
              if (this.arg) {
                this.vm.$set(this.arg, newValue);
              } else {
                if (this.vm.$data !== newValue) {
                  /** @type {string} */
                  this.vm.$data = newValue;
                }
              }
            }
          }
        }
      };
    });
    require.register("vue/src/directives/html.js", function(dataAndEvents, topic, $) {
      var out = topic("../utils");
      /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
      var _slice = [].slice;
      $.exports = {
        /**
         * @return {undefined}
         */
        bind : function() {
          if (8 === this.el.nodeType) {
            /** @type {Array} */
            this.nodes = [];
          }
        },
        /**
         * @param {string} html
         * @return {undefined}
         */
        update : function(html) {
          html = out.guard(html);
          if (this.nodes) {
            this.swap(html);
          } else {
            /** @type {string} */
            this.el.innerHTML = html;
          }
        },
        /**
         * @param {string} content
         * @return {undefined}
         */
        swap : function(content) {
          var parent = this.el.parentNode;
          var nodes = this.nodes;
          var i = nodes.length;
          for (;i--;) {
            parent.removeChild(nodes[i]);
          }
          var c = out.toFragment(content);
          /** @type {Array.<?>} */
          this.nodes = _slice.call(c.childNodes);
          parent.insertBefore(c, this.el);
        }
      };
    });
    require.register("vue/src/directives/style.js", function(dataAndEvents, deepDataAndEvents, $) {
      /** @type {Array} */
      var prefixes = ["-webkit-", "-moz-", "-ms-"];
      $.exports = {
        /**
         * @return {undefined}
         */
        bind : function() {
          var prop = this.arg;
          if (prop) {
            if ("$" === prop.charAt(0)) {
              prop = prop.slice(1);
              /** @type {boolean} */
              this.prefixed = true;
            }
            this.prop = prop;
          }
        },
        /**
         * @param {string} val
         * @return {undefined}
         */
        update : function(val) {
          var prop = this.prop;
          if (prop) {
            /** @type {string} */
            var failureMessage = "!important" === val.slice(-10) ? "important" : "";
            if (failureMessage && (val = val.slice(0, -10).trim()), this.el.style.setProperty(prop, val, failureMessage), this.prefixed) {
              /** @type {number} */
              var len = prefixes.length;
              for (;len--;) {
                this.el.style.setProperty(prefixes[len] + prop, val, failureMessage);
              }
            }
          } else {
            /** @type {string} */
            this.el.style.cssText = val;
          }
        }
      };
    });
    require.register("vue/src/directives/partial.js", function(dataAndEvents, require, module) {
      var utils = require("../utils");
      module.exports = {
        isLiteral : true,
        /**
         * @return {?}
         */
        bind : function() {
          var e = this.expression;
          if (e) {
            var el = this.el;
            var me = this.compiler;
            var div = me.getOption("partials", e);
            if (!div) {
              return void("yield" === e && utils.warn("{{>yield}} syntax has been deprecated. Use <content> tag instead."));
            }
            if (div = div.cloneNode(true), 8 === el.nodeType) {
              /** @type {Array.<?>} */
              var dirs = [].slice.call(div.childNodes);
              var parent = el.parentNode;
              parent.insertBefore(div, el);
              parent.removeChild(el);
              dirs.forEach(me.compile, me);
            } else {
              /** @type {string} */
              el.innerHTML = "";
              el.appendChild(div);
            }
          }
        }
      };
    });
    require.register("vue/src/directives/view.js", function(dataAndEvents, deepDataAndEvents, $) {
      $.exports = {
        /**
         * @return {undefined}
         */
        bind : function() {
          var el = this.raw = this.el;
          var parent = el.parentNode;
          /** @type {Comment} */
          var child = this.ref = document.createComment("v-view");
          parent.insertBefore(child, el);
          parent.removeChild(el);
          var f;
          /** @type {Element} */
          var n = this.inner = document.createElement("div");
          for (;f = el.firstChild;) {
            n.appendChild(f);
          }
        },
        /**
         * @param {string} res
         * @return {undefined}
         */
        update : function(res) {
          this.unbind();
          var json = this.compiler.getOption("components", res);
          if (json) {
            this.childVM = new json({
              el : this.raw.cloneNode(true),
              parent : this.vm,
              compilerOptions : {
                rawContent : this.inner.cloneNode(true)
              }
            });
            this.el = this.childVM.$el;
            if (this.compiler.init) {
              this.ref.parentNode.insertBefore(this.el, this.ref);
            } else {
              this.childVM.$before(this.ref);
            }
          }
        },
        /**
         * @return {undefined}
         */
        unbind : function() {
          if (this.childVM) {
            this.childVM.$destroy();
          }
        }
      };
    });
    require.alias("vue/src/main.js", "vue/index.js");
    if ("object" == typeof arg) {
      module.exports = require("vue");
    } else {
      if ("function" == typeof define && define.amd) {
        define(function() {
          return require("vue");
        });
      } else {
        window.Vue = require("vue");
      }
    }
  }();
});
define("zepto", function(dataAndEvents, deepDataAndEvents, module) {
  var Zepto = function() {
    /**
     * @param {Object} obj
     * @return {?}
     */
    function type(obj) {
      return null == obj ? String(obj) : class2type[core_toString.call(obj)] || "object";
    }
    /**
     * @param {Function} value
     * @return {?}
     */
    function isFunction(value) {
      return "function" == type(value);
    }
    /**
     * @param {Object} obj
     * @return {?}
     */
    function isWindow(obj) {
      return null != obj && obj == obj.window;
    }
    /**
     * @param {Object} obj
     * @return {?}
     */
    function isDocument(obj) {
      return null != obj && obj.nodeType == obj.DOCUMENT_NODE;
    }
    /**
     * @param {?} el
     * @return {?}
     */
    function isObject(el) {
      return "object" == type(el);
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    function isPlainObject(obj) {
      return isObject(obj) && (!isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype);
    }
    /**
     * @param {Function} obj
     * @return {?}
     */
    function likeArray(obj) {
      return "number" == typeof obj.length;
    }
    /**
     * @param {?} array
     * @return {?}
     */
    function compact(array) {
      return filter.call(array, function(dataAndEvents) {
        return null != dataAndEvents;
      });
    }
    /**
     * @param {?} array
     * @return {?}
     */
    function flatten(array) {
      return array.length > 0 ? $.fn.concat.apply([], array) : array;
    }
    /**
     * @param {string} str
     * @return {?}
     */
    function dasherize(str) {
      return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
    }
    /**
     * @param {string} name
     * @return {?}
     */
    function classRE(name) {
      return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
    }
    /**
     * @param {string} name
     * @param {number} value
     * @return {?}
     */
    function maybeAddPx(name, value) {
      return "number" != typeof value || cssNumber[dasherize(name)] ? value : value + "px";
    }
    /**
     * @param {?} nodeName
     * @return {?}
     */
    function defaultDisplay(nodeName) {
      var element;
      var display;
      return elementDisplay[nodeName] || (element = doc.createElement(nodeName), doc.body.appendChild(element), display = getComputedStyle(element, "").getPropertyValue("display"), element.parentNode.removeChild(element), "none" == display && (display = "block"), elementDisplay[nodeName] = display), elementDisplay[nodeName];
    }
    /**
     * @param {Element} element
     * @return {?}
     */
    function children(element) {
      return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(dest) {
        return 1 == dest.nodeType ? dest : void 0;
      });
    }
    /**
     * @param {Object} target
     * @param {Object} source
     * @param {?} deep
     * @return {undefined}
     */
    function extend(target, source, deep) {
      for (key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          if (isPlainObject(source[key])) {
            if (!isPlainObject(target[key])) {
              target[key] = {};
            }
          }
          if (isArray(source[key])) {
            if (!isArray(target[key])) {
              /** @type {Array} */
              target[key] = [];
            }
          }
          extend(target[key], source[key], deep);
        } else {
          if (source[key] !== radio) {
            target[key] = source[key];
          }
        }
      }
    }
    /**
     * @param {?} nodes
     * @param {?} selector
     * @return {?}
     */
    function filtered(nodes, selector) {
      return null == selector ? $(nodes) : $(nodes).filter(selector);
    }
    /**
     * @param {?} context
     * @param {Function} arg
     * @param {?} idx
     * @param {?} payload
     * @return {?}
     */
    function funcArg(context, arg, idx, payload) {
      return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }
    /**
     * @param {Element} node
     * @param {?} name
     * @param {number} value
     * @return {undefined}
     */
    function setAttribute(node, name, value) {
      if (null == value) {
        node.removeAttribute(name);
      } else {
        node.setAttribute(name, value);
      }
    }
    /**
     * @param {Element} element
     * @param {string} value
     * @return {?}
     */
    function className(element, value) {
      var klass = element.className;
      var svg = klass && klass.baseVal !== radio;
      return value === radio ? svg ? klass.baseVal : klass : void(svg ? klass.baseVal = value : element.className = value);
    }
    /**
     * @param {string} value
     * @return {?}
     */
    function deserializeValue(value) {
      var month;
      try {
        return value ? "true" == value || ("false" == value ? false : "null" == value ? null : /^0/.test(value) || isNaN(month = Number(value)) ? /^[\[\{]/.test(value) ? $.parseJSON(value) : value : month) : value;
      } catch (n) {
        return value;
      }
    }
    /**
     * @param {Node} node
     * @param {Function} fun
     * @return {undefined}
     */
    function traverseNode(node, fun) {
      fun(node);
      var key;
      for (key in node.childNodes) {
        traverseNode(node.childNodes[key], fun);
      }
    }
    var radio;
    var key;
    var $;
    var classList;
    var camelize;
    var uniq;
    /** @type {Array} */
    var emptyArray = [];
    /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
    var slice = emptyArray.slice;
    /** @type {function (this:(Array.<T>|string|{length: number}), (function (this:S, T, number, Array.<T>): ?|null), S=): Array.<T>} */
    var filter = emptyArray.filter;
    /** @type {Document} */
    var doc = window.document;
    var elementDisplay = {};
    var classCache = {};
    var cssNumber = {
      "column-count" : 1,
      columns : 1,
      "font-weight" : 1,
      "line-height" : 1,
      opacity : 1,
      "z-index" : 1,
      zoom : 1
    };
    /** @type {RegExp} */
    var fragmentRE = /^\s*<(\w+|!)[^>]*>/;
    /** @type {RegExp} */
    var BEGIN_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    /** @type {RegExp} */
    var matchAll = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
    /** @type {RegExp} */
    var rootNodeRE = /^(?:body|html)$/i;
    /** @type {RegExp} */
    var r20 = /([A-Z])/g;
    /** @type {Array} */
    var methodAttributes = ["val", "css", "html", "text", "data", "width", "height", "offset"];
    /** @type {Array} */
    var adjacencyOperators = ["after", "prepend", "before", "append"];
    /** @type {Element} */
    var table = doc.createElement("table");
    /** @type {Element} */
    var tableRow = doc.createElement("tr");
    var containers = {
      tr : doc.createElement("tbody"),
      tbody : table,
      thead : table,
      tfoot : table,
      td : tableRow,
      th : tableRow,
      "*" : doc.createElement("div")
    };
    /** @type {RegExp} */
    var rxReady = /complete|loaded|interactive/;
    /** @type {RegExp} */
    var simpleSelectorRE = /^[\w-]*$/;
    var class2type = {};
    /** @type {function (this:*): string} */
    var core_toString = class2type.toString;
    var zepto = {};
    /** @type {Element} */
    var tempParent = doc.createElement("div");
    var propMap = {
      tabindex : "tabIndex",
      readonly : "readOnly",
      "for" : "htmlFor",
      "class" : "className",
      maxlength : "maxLength",
      cellspacing : "cellSpacing",
      cellpadding : "cellPadding",
      rowspan : "rowSpan",
      colspan : "colSpan",
      usemap : "useMap",
      frameborder : "frameBorder",
      contenteditable : "contentEditable"
    };
    /** @type {function (*): boolean} */
    var isArray = Array.isArray || function(object) {
      return object instanceof Array;
    };
    return zepto.matches = function(element, selector) {
      if (!selector || (!element || 1 !== element.nodeType)) {
        return false;
      }
      var matchesSelector = element.webkitMatchesSelector || (element.mozMatchesSelector || (element.oMatchesSelector || element.matchesSelector));
      if (matchesSelector) {
        return matchesSelector.call(element, selector);
      }
      var i;
      var parent = element.parentNode;
      /** @type {boolean} */
      var previousStatus = !parent;
      return previousStatus && (parent = tempParent).appendChild(element), i = ~zepto.qsa(parent, selector).indexOf(element), previousStatus && tempParent.removeChild(element), i;
    }, camelize = function(s) {
      return s.replace(/-+(.)?/g, function(dataAndEvents, chr) {
        return chr ? chr.toUpperCase() : "";
      });
    }, uniq = function(array) {
      return filter.call(array, function(item, index) {
        return array.indexOf(item) == index;
      });
    }, zepto.fragment = function(html, name, properties) {
      var sel;
      var nodes;
      var container;
      return BEGIN_TAG_REGEXP.test(html) && (sel = $(doc.createElement(RegExp.$1))), sel || (html.replace && (html = html.replace(matchAll, "<$1></$2>")), name === radio && (name = fragmentRE.test(html) && RegExp.$1), name in containers || (name = "*"), container = containers[name], container.innerHTML = "" + html, sel = $.each(slice.call(container.childNodes), function() {
        container.removeChild(this);
      })), isPlainObject(properties) && (nodes = $(sel), $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) {
          nodes[key](value);
        } else {
          nodes.attr(key, value);
        }
      })), sel;
    }, zepto.Z = function(dom, selector) {
      return dom = dom || [], dom.__proto__ = $.fn, dom.selector = selector || "", dom;
    }, zepto.isZ = function(object) {
      return object instanceof zepto.Z;
    }, zepto.init = function(selector, context) {
      var dom;
      if (!selector) {
        return zepto.Z();
      }
      if ("string" == typeof selector) {
        if (selector = selector.trim(), "<" == selector[0] && fragmentRE.test(selector)) {
          dom = zepto.fragment(selector, RegExp.$1, context);
          /** @type {null} */
          selector = null;
        } else {
          if (context !== radio) {
            return $(context).find(selector);
          }
          dom = zepto.qsa(doc, selector);
        }
      } else {
        if (isFunction(selector)) {
          return $(doc).ready(selector);
        }
        if (zepto.isZ(selector)) {
          return selector;
        }
        if (isArray(selector)) {
          dom = compact(selector);
        } else {
          if (isObject(selector)) {
            /** @type {Array} */
            dom = [selector];
            /** @type {null} */
            selector = null;
          } else {
            if (fragmentRE.test(selector)) {
              dom = zepto.fragment(selector.trim(), RegExp.$1, context);
              /** @type {null} */
              selector = null;
            } else {
              if (context !== radio) {
                return $(context).find(selector);
              }
              dom = zepto.qsa(doc, selector);
            }
          }
        }
      }
      return zepto.Z(dom, selector);
    }, $ = function(selector, context) {
      return zepto.init(selector, context);
    }, $.extend = function(obj) {
      var deep;
      /** @type {Array.<?>} */
      var fns = slice.call(arguments, 1);
      return "boolean" == typeof obj && (deep = obj, obj = fns.shift()), fns.forEach(function(params) {
        extend(obj, params, deep);
      }), obj;
    }, zepto.qsa = function(element, selector) {
      var found;
      /** @type {boolean} */
      var maybeID = "#" == selector[0];
      /** @type {boolean} */
      var maybeClass = !maybeID && "." == selector[0];
      var nameOnly = maybeID || maybeClass ? selector.slice(1) : selector;
      /** @type {boolean} */
      var isSimple = simpleSelectorRE.test(nameOnly);
      return isDocument(element) && (isSimple && maybeID) ? (found = element.getElementById(nameOnly)) ? [found] : [] : 1 !== element.nodeType && 9 !== element.nodeType ? [] : slice.call(isSimple && !maybeID ? maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector) : element.querySelectorAll(selector));
    }, $.contains = function(parent, node) {
      return parent !== node && parent.contains(node);
    }, $.type = type, $.isFunction = isFunction, $.isWindow = isWindow, $.isArray = isArray, $.isPlainObject = isPlainObject, $.isEmptyObject = function(obj) {
      var prop;
      for (prop in obj) {
        return false;
      }
      return true;
    }, $.inArray = function(i, array, elem) {
      return emptyArray.indexOf.call(array, i, elem);
    }, $.camelCase = camelize, $.trim = function(s) {
      return null == s ? "" : String.prototype.trim.call(s);
    }, $.uuid = 0, $.support = {}, $.expr = {}, $.map = function(elements, callback) {
      var value;
      var i;
      var key;
      /** @type {Array} */
      var values = [];
      if (likeArray(elements)) {
        /** @type {number} */
        i = 0;
        for (;i < elements.length;i++) {
          value = callback(elements[i], i);
          if (null != value) {
            values.push(value);
          }
        }
      } else {
        for (key in elements) {
          value = callback(elements[key], key);
          if (null != value) {
            values.push(value);
          }
        }
      }
      return flatten(values);
    }, $.each = function(elements, callback) {
      var i;
      var key;
      if (likeArray(elements)) {
        /** @type {number} */
        i = 0;
        for (;i < elements.length;i++) {
          if (callback.call(elements[i], i, elements[i]) === false) {
            return elements;
          }
        }
      } else {
        for (key in elements) {
          if (callback.call(elements[key], key, elements[key]) === false) {
            return elements;
          }
        }
      }
      return elements;
    }, $.grep = function(elems, callback) {
      return filter.call(elems, callback);
    }, window.JSON && ($.parseJSON = JSON.parse), $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(dataAndEvents, m3) {
      class2type["[object " + m3 + "]"] = m3.toLowerCase();
    }), $.fn = {
      /** @type {function (this:(Array.<T>|string|{length: number}), (function (this:S, T, number, Array.<T>): ?|null), S=): ?} */
      forEach : emptyArray.forEach,
      /** @type {function (this:(Array.<T>|string|{length: number}), (function (?, T, number, Array.<T>): R|null), *=): R} */
      reduce : emptyArray.reduce,
      /** @type {function (this:(Array.<T>|{length: number}), ...[T]): number} */
      push : emptyArray.push,
      /** @type {function (this:(Array.<T>|{length: number}), function (T, T): number=): ?} */
      sort : emptyArray.sort,
      /** @type {function (this:(Array.<T>|string|{length: number}), T, number=): number} */
      indexOf : emptyArray.indexOf,
      /** @type {function (this:*, ...[*]): Array} */
      concat : emptyArray.concat,
      /**
       * @param {Function} callback
       * @return {?}
       */
      map : function(callback) {
        return $($.map(this, function(el, operation) {
          return callback.call(el, operation, el);
        }));
      },
      /**
       * @return {?}
       */
      slice : function() {
        return $(slice.apply(this, arguments));
      },
      /**
       * @param {Function} callback
       * @return {?}
       */
      ready : function(callback) {
        return rxReady.test(doc.readyState) && doc.body ? callback($) : doc.addEventListener("DOMContentLoaded", function() {
          callback($);
        }, false), this;
      },
      /**
       * @param {number} idx
       * @return {?}
       */
      get : function(idx) {
        return idx === radio ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
      },
      /**
       * @return {?}
       */
      toArray : function() {
        return this.get();
      },
      /**
       * @return {?}
       */
      size : function() {
        return this.length;
      },
      /**
       * @return {?}
       */
      remove : function() {
        return this.each(function() {
          if (null != this.parentNode) {
            this.parentNode.removeChild(this);
          }
        });
      },
      /**
       * @param {Function} callback
       * @return {?}
       */
      each : function(callback) {
        return emptyArray.every.call(this, function(el, operation) {
          return callback.call(el, operation, el) !== false;
        }), this;
      },
      /**
       * @param {Function} selector
       * @return {?}
       */
      filter : function(selector) {
        return isFunction(selector) ? this.not(this.not(selector)) : $(filter.call(this, function(element) {
          return zepto.matches(element, selector);
        }));
      },
      /**
       * @param {Object} selector
       * @param {string} context
       * @return {?}
       */
      add : function(selector, context) {
        return $(uniq(this.concat($(selector, context))));
      },
      /**
       * @param {Function} selector
       * @return {?}
       */
      is : function(selector) {
        return this.length > 0 && zepto.matches(this[0], selector);
      },
      /**
       * @param {Function} selector
       * @return {?}
       */
      not : function(selector) {
        /** @type {Array} */
        var out = [];
        if (isFunction(selector) && selector.call !== radio) {
          this.each(function($1) {
            if (!selector.call(this, $1)) {
              out.push(this);
            }
          });
        } else {
          var nv = "string" == typeof selector ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
          this.forEach(function(v) {
            if (nv.indexOf(v) < 0) {
              out.push(v);
            }
          });
        }
        return $(out);
      },
      /**
       * @param {Object} selector
       * @return {?}
       */
      has : function(selector) {
        return this.filter(function() {
          return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
        });
      },
      /**
       * @param {number} recurring
       * @return {?}
       */
      eq : function(recurring) {
        return-1 === recurring ? this.slice(recurring) : this.slice(recurring, +recurring + 1);
      },
      /**
       * @return {?}
       */
      first : function() {
        var el = this[0];
        return el && !isObject(el) ? el : $(el);
      },
      /**
       * @return {?}
       */
      last : function() {
        var el = this[this.length - 1];
        return el && !isObject(el) ? el : $(el);
      },
      /**
       * @param {string} selector
       * @return {?}
       */
      find : function(selector) {
        var e;
        var uniqs = this;
        return e = "object" == typeof selector ? $(selector).filter(function() {
          var related = this;
          return emptyArray.some.call(uniqs, function(target) {
            return $.contains(target, related);
          });
        }) : 1 == this.length ? $(zepto.qsa(this[0], selector)) : this.map(function() {
          return zepto.qsa(this, selector);
        });
      },
      /**
       * @param {Function} selector
       * @param {Object} context
       * @return {?}
       */
      closest : function(selector, context) {
        var node = this[0];
        /** @type {boolean} */
        var collection = false;
        if ("object" == typeof selector) {
          collection = $(selector);
        }
        for (;node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector));) {
          node = node !== context && (!isDocument(node) && node.parentNode);
        }
        return $(node);
      },
      /**
       * @param {?} selector
       * @return {?}
       */
      parents : function(selector) {
        /** @type {Array} */
        var ancestors = [];
        var nodes = this;
        for (;nodes.length > 0;) {
          nodes = $.map(nodes, function(node) {
            return(node = node.parentNode) && (!isDocument(node) && ancestors.indexOf(node) < 0) ? (ancestors.push(node), node) : void 0;
          });
        }
        return filtered(ancestors, selector);
      },
      /**
       * @param {?} selector
       * @return {?}
       */
      parent : function(selector) {
        return filtered(uniq(this.pluck("parentNode")), selector);
      },
      /**
       * @param {?} selector
       * @return {?}
       */
      children : function(selector) {
        return filtered(this.map(function() {
          return children(this);
        }), selector);
      },
      /**
       * @return {?}
       */
      contents : function() {
        return this.map(function() {
          return slice.call(this.childNodes);
        });
      },
      /**
       * @param {?} selector
       * @return {?}
       */
      siblings : function(selector) {
        return filtered(this.map(function(dataAndEvents, el) {
          return filter.call(children(el.parentNode), function(child) {
            return child !== el;
          });
        }), selector);
      },
      /**
       * @return {?}
       */
      empty : function() {
        return this.each(function() {
          /** @type {string} */
          this.innerHTML = "";
        });
      },
      /**
       * @param {string} property
       * @return {?}
       */
      pluck : function(property) {
        return $.map(this, function(to_instance) {
          return to_instance[property];
        });
      },
      /**
       * @return {?}
       */
      show : function() {
        return this.each(function() {
          if ("none" == this.style.display) {
            /** @type {string} */
            this.style.display = "";
          }
          if ("none" == getComputedStyle(this, "").getPropertyValue("display")) {
            this.style.display = defaultDisplay(this.nodeName);
          }
        });
      },
      /**
       * @param {?} newContent
       * @return {?}
       */
      replaceWith : function(newContent) {
        return this.before(newContent).remove();
      },
      /**
       * @param {Function} structure
       * @return {?}
       */
      wrap : function(structure) {
        var func = isFunction(structure);
        if (this[0] && !func) {
          var dom = $(structure).get(0);
          var clone = dom.parentNode || this.length > 1;
        }
        return this.each(function(index) {
          $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
        });
      },
      /**
       * @param {Element} structure
       * @return {?}
       */
      wrapAll : function(structure) {
        if (this[0]) {
          $(this[0]).before(structure = $(structure));
          var children;
          for (;(children = structure.children()).length;) {
            structure = children.first();
          }
          $(structure).append(this);
        }
        return this;
      },
      /**
       * @param {Function} structure
       * @return {?}
       */
      wrapInner : function(structure) {
        var func = isFunction(structure);
        return this.each(function(index) {
          var self = $(this);
          var contents = self.contents();
          var dom = func ? structure.call(this, index) : structure;
          if (contents.length) {
            contents.wrapAll(dom);
          } else {
            self.append(dom);
          }
        });
      },
      /**
       * @return {?}
       */
      unwrap : function() {
        return this.parent().each(function() {
          $(this).replaceWith($(this).children());
        }), this;
      },
      /**
       * @return {?}
       */
      clone : function() {
        return this.map(function() {
          return this.cloneNode(true);
        });
      },
      /**
       * @return {?}
       */
      hide : function() {
        return this.css("display", "none");
      },
      /**
       * @param {boolean} value
       * @return {?}
       */
      toggle : function(value) {
        return this.each(function() {
          var removeButton = $(this);
          if (value === radio ? "none" == removeButton.css("display") : value) {
            removeButton.show();
          } else {
            removeButton.hide();
          }
        });
      },
      /**
       * @param {string} selector
       * @return {?}
       */
      prev : function(selector) {
        return $(this.pluck("previousElementSibling")).filter(selector || "*");
      },
      /**
       * @param {string} selector
       * @return {?}
       */
      next : function(selector) {
        return $(this.pluck("nextElementSibling")).filter(selector || "*");
      },
      /**
       * @param {Function} html
       * @return {?}
       */
      html : function(html) {
        return 0 === arguments.length ? this.length > 0 ? this[0].innerHTML : null : this.each(function(idx) {
          var originHtml = this.innerHTML;
          $(this).empty().append(funcArg(this, html, idx, originHtml));
        });
      },
      /**
       * @param {number} value
       * @return {?}
       */
      text : function(value) {
        return 0 === arguments.length ? this.length > 0 ? this[0].textContent : null : this.each(function() {
          /** @type {string} */
          this.textContent = value === radio ? "" : "" + value;
        });
      },
      /**
       * @param {Element} name
       * @param {string} value
       * @return {?}
       */
      attr : function(name, value) {
        var isLengthProperty;
        return "string" == typeof name && value === radio ? 0 == this.length || 1 !== this[0].nodeType ? radio : "value" == name && "INPUT" == this[0].nodeName ? this.val() : !(isLengthProperty = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : isLengthProperty : this.each(function(idx) {
          if (1 === this.nodeType) {
            if (isObject(name)) {
              for (key in name) {
                setAttribute(this, key, name[key]);
              }
            } else {
              setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
            }
          }
        });
      },
      /**
       * @param {?} name
       * @return {?}
       */
      removeAttr : function(name) {
        return this.each(function() {
          if (1 === this.nodeType) {
            setAttribute(this, name);
          }
        });
      },
      /**
       * @param {Text} name
       * @param {Function} value
       * @return {?}
       */
      prop : function(name, value) {
        return name = propMap[name] || name, value === radio ? this[0] && this[0][name] : this.each(function(idx) {
          this[name] = funcArg(this, value, idx, this[name]);
        });
      },
      /**
       * @param {string} name
       * @param {string} value
       * @return {?}
       */
      data : function(name, value) {
        var val = this.attr("data-" + name.replace(r20, "-$1").toLowerCase(), value);
        return null !== val ? deserializeValue(val) : radio;
      },
      /**
       * @param {Function} value
       * @return {?}
       */
      val : function(value) {
        return 0 === arguments.length ? this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function() {
          return this.selected;
        }).pluck("value") : this[0].value) : this.each(function(idx) {
          this.value = funcArg(this, value, idx, this.value);
        });
      },
      /**
       * @param {Function} coordinates
       * @return {?}
       */
      offset : function(coordinates) {
        if (coordinates) {
          return this.each(function(index) {
            var object = $(this);
            var coords = funcArg(this, coordinates, index, object.offset());
            var parentOffset = object.offsetParent().offset();
            var style = {
              top : coords.top - parentOffset.top,
              left : coords.left - parentOffset.left
            };
            if ("static" == object.css("position")) {
              /** @type {string} */
              style.position = "relative";
            }
            object.css(style);
          });
        }
        if (0 == this.length) {
          return null;
        }
        var obj = this[0].getBoundingClientRect();
        return{
          left : obj.left + window.pageXOffset,
          top : obj.top + window.pageYOffset,
          width : Math.round(obj.width),
          height : Math.round(obj.height)
        };
      },
      /**
       * @param {string} property
       * @param {number} value
       * @return {?}
       */
      css : function(property, value) {
        if (arguments.length < 2) {
          var element = this[0];
          var computedStyle = getComputedStyle(element, "");
          if (!element) {
            return;
          }
          if ("string" == typeof property) {
            return element.style[camelize(property)] || computedStyle.getPropertyValue(property);
          }
          if (isArray(property)) {
            var to_instance = {};
            return $.each(isArray(property) ? property : [property], function(dataAndEvents, property) {
              to_instance[property] = element.style[camelize(property)] || computedStyle.getPropertyValue(property);
            }), to_instance;
          }
        }
        /** @type {string} */
        var css = "";
        if ("string" == type(property)) {
          if (value || 0 === value) {
            /** @type {string} */
            css = dasherize(property) + ":" + maybeAddPx(property, value);
          } else {
            this.each(function() {
              this.style.removeProperty(dasherize(property));
            });
          }
        } else {
          for (key in property) {
            if (property[key] || 0 === property[key]) {
              css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
            } else {
              this.each(function() {
                this.style.removeProperty(dasherize(key));
              });
            }
          }
        }
        return this.each(function() {
          this.style.cssText += ";" + css;
        });
      },
      /**
       * @param {?} element
       * @return {?}
       */
      index : function(element) {
        return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
      },
      /**
       * @param {Object} name
       * @return {?}
       */
      hasClass : function(name) {
        return name ? emptyArray.some.call(this, function(el) {
          return this.test(className(el));
        }, classRE(name)) : false;
      },
      /**
       * @param {boolean} name
       * @return {?}
       */
      addClass : function(name) {
        return name ? this.each(function(idx) {
          /** @type {Array} */
          classList = [];
          var cls = className(this);
          var newName = funcArg(this, name, idx, cls);
          newName.split(/\s+/g).forEach(function(klass) {
            if (!$(this).hasClass(klass)) {
              classList.push(klass);
            }
          }, this);
          if (classList.length) {
            className(this, cls + (cls ? " " : "") + classList.join(" "));
          }
        }) : this;
      },
      /**
       * @param {?} name
       * @return {?}
       */
      removeClass : function(name) {
        return this.each(function(idx) {
          return name === radio ? className(this, "") : (classList = className(this), funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
            classList = classList.replace(classRE(klass), " ");
          }), void className(this, classList.trim()));
        });
      },
      /**
       * @param {boolean} name
       * @param {boolean} value
       * @return {?}
       */
      toggleClass : function(name, value) {
        return name ? this.each(function(idx) {
          var $this = $(this);
          var names = funcArg(this, name, idx, className(this));
          names.split(/\s+/g).forEach(function(klass) {
            if (value === radio ? !$this.hasClass(klass) : value) {
              $this.addClass(klass);
            } else {
              $this.removeClass(klass);
            }
          });
        }) : this;
      },
      /**
       * @param {?} value
       * @return {?}
       */
      scrollTop : function(value) {
        if (this.length) {
          /** @type {boolean} */
          var hasScrollTop = "scrollTop" in this[0];
          return value === radio ? hasScrollTop ? this[0].scrollTop : this[0].pageYOffset : this.each(hasScrollTop ? function() {
            this.scrollTop = value;
          } : function() {
            this.scrollTo(this.scrollX, value);
          });
        }
      },
      /**
       * @param {string} value
       * @return {?}
       */
      scrollLeft : function(value) {
        if (this.length) {
          /** @type {boolean} */
          var hasScrollLeft = "scrollLeft" in this[0];
          return value === radio ? hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset : this.each(hasScrollLeft ? function() {
            /** @type {string} */
            this.scrollLeft = value;
          } : function() {
            this.scrollTo(value, this.scrollY);
          });
        }
      },
      /**
       * @return {?}
       */
      position : function() {
        if (this.length) {
          var sel = this[0];
          var offsetParent = this.offsetParent();
          var offset = this.offset();
          var parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
            top : 0,
            left : 0
          } : offsetParent.offset();
          return offset.top -= parseFloat($(sel).css("margin-top")) || 0, offset.left -= parseFloat($(sel).css("margin-left")) || 0, parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0, parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0, {
            top : offset.top - parentOffset.top,
            left : offset.left - parentOffset.left
          };
        }
      },
      /**
       * @return {?}
       */
      offsetParent : function() {
        return this.map(function() {
          var parent = this.offsetParent || doc.body;
          for (;parent && (!rootNodeRE.test(parent.nodeName) && "static" == $(parent).css("position"));) {
            parent = parent.offsetParent;
          }
          return parent;
        });
      }
    }, $.fn.detach = $.fn.remove, ["width", "height"].forEach(function(dimension) {
      var dimensionProperty = dimension.replace(/./, function(m) {
        return m[0].toUpperCase();
      });
      /**
       * @param {Function} value
       * @return {?}
       */
      $.fn[dimension] = function(value) {
        var offset;
        var el = this[0];
        return value === radio ? isWindow(el) ? el["inner" + dimensionProperty] : isDocument(el) ? el.documentElement["scroll" + dimensionProperty] : (offset = this.offset()) && offset[dimension] : this.each(function(idx) {
          el = $(this);
          el.css(dimension, funcArg(this, value, idx, el[dimension]()));
        });
      };
    }), adjacencyOperators.forEach(function(operator, operatorIndex) {
      /** @type {number} */
      var inside = operatorIndex % 2;
      /**
       * @return {?}
       */
      $.fn[operator] = function() {
        var result;
        var parent;
        var resolveValues = $.map(arguments, function(arg) {
          return result = type(arg), "object" == result || ("array" == result || null == arg) ? arg : zepto.fragment(arg);
        });
        /** @type {boolean} */
        var copyByClone = this.length > 1;
        return resolveValues.length < 1 ? this : this.each(function(dataAndEvents, target) {
          parent = inside ? target : target.parentNode;
          target = 0 == operatorIndex ? target.nextSibling : 1 == operatorIndex ? target.firstChild : 2 == operatorIndex ? target : null;
          resolveValues.forEach(function(node) {
            if (copyByClone) {
              node = node.cloneNode(true);
            } else {
              if (!parent) {
                return $(node).remove();
              }
            }
            traverseNode(parent.insertBefore(node, target), function(src) {
              if (!(null == src.nodeName)) {
                if (!("SCRIPT" !== src.nodeName.toUpperCase())) {
                  if (!(src.type && "text/javascript" !== src.type)) {
                    if (!src.src) {
                      window.eval.call(window, src.innerHTML);
                    }
                  }
                }
              }
            });
          });
        });
      };
      /**
       * @param {?} html
       * @return {?}
       */
      $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html) {
        return $(html)[operator](this), this;
      };
    }), zepto.Z.prototype = $.fn, zepto.uniq = uniq, zepto.deserializeValue = deserializeValue, $.zepto = zepto, $;
  }();
  window.Zepto = Zepto;
  if (void 0 === window.$) {
    window.$ = Zepto;
  }
  (function($) {
    /**
     * @param {boolean} element
     * @return {?}
     */
    function zid(element) {
      return element._zid || (element._zid = _zid++);
    }
    /**
     * @param {boolean} fn
     * @param {string} event
     * @param {boolean} element
     * @param {boolean} selector
     * @return {?}
     */
    function findHandlers(fn, event, element, selector) {
      if (event = parse(event), event.ns) {
        var matcher = matcherFor(event.ns)
      }
      return(handlers[zid(fn)] || []).filter(function(handler) {
        return!(!handler || (event.e && handler.e != event.e || (event.ns && !matcher.test(handler.ns) || (element && zid(handler.fn) !== zid(element) || selector && handler.sel != selector))));
      });
    }
    /**
     * @param {string} event
     * @return {?}
     */
    function parse(event) {
      /** @type {Array.<string>} */
      var parts = ("" + event).split(".");
      return{
        e : parts[0],
        ns : parts.slice(1).sort().join(" ")
      };
    }
    /**
     * @param {string} ns
     * @return {?}
     */
    function matcherFor(ns) {
      return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
    }
    /**
     * @param {Object} handler
     * @param {?} captureSetting
     * @return {?}
     */
    function eventCapture(handler, captureSetting) {
      return handler.del && (!focusinSupported && handler.e in focus) || !!captureSetting;
    }
    /**
     * @param {(Array|string)} type
     * @return {?}
     */
    function realEvent(type) {
      return hover[type] || (focusinSupported && focus[type] || type);
    }
    /**
     * @param {Object} element
     * @param {string} events
     * @param {Object} fn
     * @param {Function} data
     * @param {string} selector
     * @param {Object} delegator
     * @param {?} capture
     * @return {undefined}
     */
    function add(element, events, fn, data, selector, delegator, capture) {
      var id = zid(element);
      var set = handlers[id] || (handlers[id] = []);
      events.split(/\s/).forEach(function(event) {
        if ("ready" == event) {
          return $(document).ready(fn);
        }
        var handler = parse(event);
        handler.fn = fn;
        /** @type {string} */
        handler.sel = selector;
        if (handler.e in hover) {
          /**
           * @param {Object} event
           * @return {?}
           */
          fn = function(event) {
            var related = event.relatedTarget;
            return!related || related !== this && !$.contains(this, related) ? handler.fn.apply(this, arguments) : void 0;
          };
        }
        /** @type {Object} */
        handler.del = delegator;
        var callback = delegator || fn;
        /**
         * @param {Object} e
         * @return {?}
         */
        handler.proxy = function(e) {
          if (e = compatible(e), !e.isImmediatePropagationStopped()) {
            /** @type {Function} */
            e.data = data;
            var elementRect = callback.apply(element, e._args == value ? [e] : [e].concat(e._args));
            return elementRect === false && (e.preventDefault(), e.stopPropagation()), elementRect;
          }
        };
        handler.i = set.length;
        set.push(handler);
        if ("addEventListener" in element) {
          element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
        }
      });
    }
    /**
     * @param {Object} element
     * @param {string} classNames
     * @param {Function} fn
     * @param {Object} selector
     * @param {?} capture
     * @return {undefined}
     */
    function remove(element, classNames, fn, selector, capture) {
      var id = zid(element);
      (classNames || "").split(/\s/).forEach(function(event) {
        findHandlers(element, event, fn, selector).forEach(function(handler) {
          delete handlers[id][handler.i];
          if ("removeEventListener" in element) {
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
          }
        });
      });
    }
    /**
     * @param {Object} event
     * @param {Object} source
     * @return {?}
     */
    function compatible(event, source) {
      return(source || !event.isDefaultPrevented) && (source || (source = event), $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name];
        /**
         * @return {?}
         */
        event[name] = function() {
          return this[predicate] = returnTrue, sourceMethod && sourceMethod.apply(source, arguments);
        };
        /** @type {function (): ?} */
        event[predicate] = returnFalse;
      }), (source.defaultPrevented !== value ? source.defaultPrevented : "returnValue" in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault()) && (event.isDefaultPrevented = returnTrue)), event;
    }
    /**
     * @param {Object} event
     * @return {?}
     */
    function createProxy(event) {
      var key;
      var proxy = {
        originalEvent : event
      };
      for (key in event) {
        if (!isint.test(key)) {
          if (!(event[key] === value)) {
            proxy[key] = event[key];
          }
        }
      }
      return compatible(proxy, event);
    }
    var value;
    /** @type {number} */
    var _zid = 1;
    /** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
    var __slice = Array.prototype.slice;
    var isFunction = $.isFunction;
    /**
     * @param {Function} value
     * @return {?}
     */
    var isString = function(value) {
      return "string" == typeof value;
    };
    var handlers = {};
    var specialEvents = {};
    /** @type {boolean} */
    var focusinSupported = "onfocusin" in window;
    var focus = {
      focus : "focusin",
      blur : "focusout"
    };
    var hover = {
      mouseenter : "mouseover",
      mouseleave : "mouseout"
    };
    /** @type {string} */
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";
    $.event = {
      /** @type {function (Object, string, Object, Function, string, Object, ?): undefined} */
      add : add,
      /** @type {function (Object, string, Function, Object, ?): undefined} */
      remove : remove
    };
    /**
     * @param {Object} fn
     * @param {?} context
     * @return {?}
     */
    $.proxy = function(fn, context) {
      if (isFunction(fn)) {
        /**
         * @return {?}
         */
        var proxyFn = function() {
          return fn.apply(context, arguments);
        };
        return proxyFn._zid = zid(fn), proxyFn;
      }
      if (isString(context)) {
        return $.proxy(fn[context], fn);
      }
      throw new TypeError("expected function");
    };
    /**
     * @param {string} event
     * @param {Function} callback
     * @param {Function} data
     * @return {?}
     */
    $.fn.bind = function(event, callback, data) {
      return this.on(event, callback, data);
    };
    /**
     * @param {string} event
     * @param {?} callback
     * @return {?}
     */
    $.fn.unbind = function(event, callback) {
      return this.off(event, callback);
    };
    /**
     * @param {string} eventName
     * @param {Function} selector
     * @param {Function} data
     * @param {Function} callback
     * @return {?}
     */
    $.fn.one = function(eventName, selector, data, callback) {
      return this.on(eventName, selector, data, callback, 1);
    };
    /**
     * @return {?}
     */
    var returnTrue = function() {
      return true;
    };
    /**
     * @return {?}
     */
    var returnFalse = function() {
      return false;
    };
    /** @type {RegExp} */
    var isint = /^([A-Z]|returnValue$|layer[XY]$)/;
    var eventMethods = {
      preventDefault : "isDefaultPrevented",
      stopImmediatePropagation : "isImmediatePropagationStopped",
      stopPropagation : "isPropagationStopped"
    };
    /**
     * @param {Function} selector
     * @param {string} event
     * @param {?} data
     * @return {?}
     */
    $.fn.delegate = function(selector, event, data) {
      return this.on(event, selector, data);
    };
    /**
     * @param {Function} selector
     * @param {string} event
     * @param {?} callback
     * @return {?}
     */
    $.fn.undelegate = function(selector, event, callback) {
      return this.off(event, selector, callback);
    };
    /**
     * @param {string} event
     * @param {?} callback
     * @return {?}
     */
    $.fn.live = function(event, callback) {
      return $(document.body).delegate(this.selector, event, callback), this;
    };
    /**
     * @param {string} event
     * @param {?} callback
     * @return {?}
     */
    $.fn.die = function(event, callback) {
      return $(document.body).undelegate(this.selector, event, callback), this;
    };
    /**
     * @param {string} event
     * @param {Function} selector
     * @param {Function} data
     * @param {Function} callback
     * @param {number} one
     * @return {?}
     */
    $.fn.on = function(event, selector, data, callback, one) {
      var autoRemove;
      var delegator;
      var _ = this;
      return event && !isString(event) ? ($.each(event, function(eventName, options) {
        _.on(eventName, selector, data, options, one);
      }), _) : (isString(selector) || (isFunction(callback) || (callback === false || (callback = data, data = selector, selector = value))), (isFunction(data) || data === false) && (callback = data, data = value), callback === false && (callback = returnFalse), _.each(function(dataAndEvents, element) {
        if (one) {
          /**
           * @param {Event} e
           * @return {?}
           */
          autoRemove = function(e) {
            return remove(element, e.type, callback), callback.apply(this, arguments);
          };
        }
        if (selector) {
          /**
           * @param {Object} e
           * @return {?}
           */
          delegator = function(e) {
            var context;
            var match = $(e.target).closest(selector, element).get(0);
            return match && match !== element ? (context = $.extend(createProxy(e), {
              currentTarget : match,
              liveFired : element
            }), (autoRemove || callback).apply(match, [context].concat(__slice.call(arguments, 1)))) : void 0;
          };
        }
        add(element, event, callback, data, selector, delegator || autoRemove);
      }));
    };
    /**
     * @param {string} event
     * @param {Function} selector
     * @param {Function} callback
     * @return {?}
     */
    $.fn.off = function(event, selector, callback) {
      var _this = this;
      return event && !isString(event) ? ($.each(event, function(event, handler) {
        _this.off(event, selector, handler);
      }), _this) : (isString(selector) || (isFunction(callback) || (callback === false || (callback = selector, selector = value))), callback === false && (callback = returnFalse), _this.each(function() {
        remove(this, event, callback, selector);
      }));
    };
    /**
     * @param {string} event
     * @param {Object} args
     * @return {?}
     */
    $.fn.trigger = function(event, args) {
      return event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event), event._args = args, this.each(function() {
        if ("dispatchEvent" in this) {
          this.dispatchEvent(event);
        } else {
          $(this).triggerHandler(event, args);
        }
      });
    };
    /**
     * @param {Function} event
     * @param {Object} args
     * @return {?}
     */
    $.fn.triggerHandler = function(event, args) {
      var e;
      var $col;
      return this.each(function(dataAndEvents, element) {
        e = createProxy(isString(event) ? $.Event(event) : event);
        /** @type {Object} */
        e._args = args;
        /** @type {Object} */
        e.target = element;
        $.each(findHandlers(element, event.type || event), function(dataAndEvents, handler) {
          return $col = handler.proxy(e), e.isImmediatePropagationStopped() ? false : void 0;
        });
      }), $col;
    };
    "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(name) {
      /**
       * @param {Function} fn
       * @return {?}
       */
      $.fn[name] = function(fn) {
        return fn ? this.bind(name, fn) : this.trigger(name);
      };
    });
    ["focus", "blur"].forEach(function(event) {
      /**
       * @param {Function} fn
       * @return {?}
       */
      $.fn[event] = function(fn) {
        return fn ? this.bind(event, fn) : this.each(function() {
          try {
            this[event]();
          } catch (t) {
          }
        }), this;
      };
    });
    /**
     * @param {Function} type
     * @param {Function} props
     * @return {?}
     */
    $.Event = function(type, props) {
      if (!isString(type)) {
        /** @type {Function} */
        props = type;
        type = props.type;
      }
      /** @type {(Event|null)} */
      var event = document.createEvent(specialEvents[type] || "Events");
      /** @type {boolean} */
      var bubbles = true;
      if (props) {
        var i;
        for (i in props) {
          if ("bubbles" == i) {
            /** @type {boolean} */
            bubbles = !!props[i];
          } else {
            event[i] = props[i];
          }
        }
      }
      return event.initEvent(type, bubbles, true), compatible(event);
    };
  })(Zepto);
  (function($) {
    /**
     * @param {?} context
     * @param {?} eventName
     * @param {Object} data
     * @return {?}
     */
    function triggerAndReturn(context, eventName, data) {
      var event = $.Event(eventName);
      return $(context).trigger(event, data), !event.isDefaultPrevented();
    }
    /**
     * @param {Object} settings
     * @param {Element} context
     * @param {string} eventName
     * @param {?} data
     * @return {?}
     */
    function triggerGlobal(settings, context, eventName, data) {
      return settings.global ? triggerAndReturn(context || doc, eventName, data) : void 0;
    }
    /**
     * @param {Object} settings
     * @return {undefined}
     */
    function ajaxStart(settings) {
      if (settings.global) {
        if (0 === $.active++) {
          triggerGlobal(settings, null, "ajaxStart");
        }
      }
    }
    /**
     * @param {Object} settings
     * @return {undefined}
     */
    function ajaxStop(settings) {
      if (settings.global) {
        if (!--$.active) {
          triggerGlobal(settings, null, "ajaxStop");
        }
      }
    }
    /**
     * @param {?} xhr
     * @param {Object} settings
     * @return {?}
     */
    function ajaxBeforeSend(xhr, settings) {
      var context = settings.context;
      return settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, "ajaxBeforeSend", [xhr, settings]) === false ? false : void triggerGlobal(settings, context, "ajaxSend", [xhr, settings]);
    }
    /**
     * @param {?} data
     * @param {?} xhr
     * @param {Object} settings
     * @param {?} deferred
     * @return {undefined}
     */
    function ajaxSuccess(data, xhr, settings, deferred) {
      var context = settings.context;
      /** @type {string} */
      var status = "success";
      settings.success.call(context, data, status, xhr);
      if (deferred) {
        deferred.resolveWith(context, [data, status, xhr]);
      }
      triggerGlobal(settings, context, "ajaxSuccess", [xhr, settings, data]);
      ajaxComplete(status, xhr, settings);
    }
    /**
     * @param {Object} error
     * @param {string} type
     * @param {?} xhr
     * @param {Object} settings
     * @param {?} deferred
     * @return {undefined}
     */
    function ajaxError(error, type, xhr, settings, deferred) {
      var context = settings.context;
      settings.error.call(context, xhr, type, error);
      if (deferred) {
        deferred.rejectWith(context, [xhr, type, error]);
      }
      triggerGlobal(settings, context, "ajaxError", [xhr, settings, error || type]);
      ajaxComplete(type, xhr, settings);
    }
    /**
     * @param {string} status
     * @param {?} xhr
     * @param {Object} settings
     * @return {undefined}
     */
    function ajaxComplete(status, xhr, settings) {
      var context = settings.context;
      settings.complete.call(context, xhr, status);
      triggerGlobal(settings, context, "ajaxComplete", [xhr, settings]);
      ajaxStop(settings);
    }
    /**
     * @return {undefined}
     */
    function empty() {
    }
    /**
     * @param {string} mime
     * @return {?}
     */
    function mimeToDataType(mime) {
      return mime && (mime = mime.split(";", 2)[0]), mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : rchecked.test(mime) ? "script" : exclude.test(mime) && "xml") || "text";
    }
    /**
     * @param {string} label
     * @param {string} str
     * @return {?}
     */
    function appendQuery(label, str) {
      return "" == str ? label : (label + "&" + str).replace(/[&?]{1,2}/, "?");
    }
    /**
     * @param {Object} options
     * @return {undefined}
     */
    function serializeData(options) {
      if (options.processData) {
        if (options.data) {
          if ("string" != $.type(options.data)) {
            options.data = $.param(options.data, options.traditional);
          }
        }
      }
      if (!!options.data) {
        if (!(options.type && "GET" != options.type.toUpperCase())) {
          options.url = appendQuery(options.url, options.data);
          options.data = void 0;
        }
      }
    }
    /**
     * @param {string} url
     * @param {Function} data
     * @param {Object} success
     * @param {Object} dataType
     * @return {?}
     */
    function parseArguments(url, data, success, dataType) {
      return $.isFunction(data) && (dataType = success, success = data, data = void 0), $.isFunction(success) || (dataType = success, success = void 0), {
        url : url,
        /** @type {Function} */
        data : data,
        success : success,
        dataType : dataType
      };
    }
    /**
     * @param {Object} params
     * @param {?} value
     * @param {boolean} traditional
     * @param {string} scope
     * @return {undefined}
     */
    function serialize(params, value, traditional, scope) {
      var $clone_type;
      var isFunction = $.isArray(value);
      var hash = $.isPlainObject(value);
      $.each(value, function(key, value) {
        $clone_type = $.type(value);
        if (scope) {
          key = traditional ? scope : scope + "[" + (hash || ("object" == $clone_type || "array" == $clone_type) ? key : "") + "]";
        }
        if (!scope && isFunction) {
          params.add(value.name, value.value);
        } else {
          if ("array" == $clone_type || !traditional && "object" == $clone_type) {
            serialize(params, value, traditional, key);
          } else {
            params.add(key, value);
          }
        }
      });
    }
    var key;
    var name;
    /** @type {number} */
    var jsonpID = 0;
    /** @type {Document} */
    var doc = window.document;
    /** @type {RegExp} */
    var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    /** @type {RegExp} */
    var rchecked = /^(?:text|application)\/javascript/i;
    /** @type {RegExp} */
    var exclude = /^(?:text|application)\/xml/i;
    /** @type {string} */
    var jsonType = "application/json";
    /** @type {string} */
    var htmlType = "text/html";
    /** @type {RegExp} */
    var blankRE = /^\s*$/;
    /** @type {number} */
    $.active = 0;
    /**
     * @param {Object} options
     * @param {?} deferred
     * @return {?}
     */
    $.ajaxJSONP = function(options, deferred) {
      if (!("type" in options)) {
        return $.ajax(options);
      }
      var responseData;
      var tref;
      var _callbackName = options.jsonpCallback;
      var callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || "jsonp" + ++jsonpID;
      /** @type {Element} */
      var script = doc.createElement("script");
      var originalCallback = window[callbackName];
      /**
       * @param {string} errorType
       * @return {undefined}
       */
      var abort = function(errorType) {
        $(script).triggerHandler("error", errorType || "abort");
      };
      var xhr = {
        /** @type {function (string): undefined} */
        abort : abort
      };
      return deferred && deferred.promise(xhr), $(script).on("load error", function(error, errorType) {
        clearTimeout(tref);
        $(script).off().remove();
        if ("error" != error.type && responseData) {
          ajaxSuccess(responseData[0], xhr, options, deferred);
        } else {
          ajaxError(null, errorType || "error", xhr, options, deferred);
        }
        window[callbackName] = originalCallback;
        if (responseData) {
          if ($.isFunction(originalCallback)) {
            originalCallback(responseData[0]);
          }
        }
        originalCallback = responseData = void 0;
      }), ajaxBeforeSend(xhr, options) === false ? (abort("abort"), xhr) : (window[callbackName] = function() {
        /** @type {Arguments} */
        responseData = arguments;
      }, script.src = options.url.replace(/\?(.+)=\?/, "?$1=" + callbackName), doc.head.appendChild(script), options.timeout > 0 && (tref = setTimeout(function() {
        abort("timeout");
      }, options.timeout)), xhr);
    };
    $.ajaxSettings = {
      type : "GET",
      /** @type {function (): undefined} */
      beforeSend : empty,
      /** @type {function (): undefined} */
      success : empty,
      /** @type {function (): undefined} */
      error : empty,
      /** @type {function (): undefined} */
      complete : empty,
      context : null,
      global : true,
      /**
       * @return {?}
       */
      xhr : function() {
        return new window.XMLHttpRequest;
      },
      accepts : {
        script : "text/javascript, application/javascript, application/x-javascript",
        json : jsonType,
        xml : "application/xml, text/xml",
        html : htmlType,
        text : "text/plain"
      },
      crossDomain : false,
      timeout : 0,
      processData : true,
      cache : true
    };
    /**
     * @param {Object} options
     * @return {?}
     */
    $.ajax = function(options) {
      var settings = $.extend({}, options || {});
      var deferred = $.Deferred && $.Deferred();
      for (key in $.ajaxSettings) {
        if (void 0 === settings[key]) {
          settings[key] = $.ajaxSettings[key];
        }
      }
      ajaxStart(settings);
      if (!settings.crossDomain) {
        /** @type {boolean} */
        settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;
      }
      if (!settings.url) {
        /** @type {string} */
        settings.url = window.location.toString();
      }
      serializeData(settings);
      if (settings.cache === false) {
        settings.url = appendQuery(settings.url, "_=" + Date.now());
      }
      var dataType = settings.dataType;
      /** @type {boolean} */
      var jsonp = /\?.+=\?/.test(settings.url);
      if ("jsonp" == dataType || jsonp) {
        return jsonp || (settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + "=?" : settings.jsonp === false ? "" : "callback=?")), $.ajaxJSONP(settings, deferred);
      }
      var tref;
      var mime = settings.accepts[dataType];
      var headers = {};
      /**
       * @param {string} name
       * @param {string} value
       * @return {undefined}
       */
      var setHeader = function(name, value) {
        /** @type {Array} */
        headers[name.toLowerCase()] = [name, value];
      };
      /** @type {string} */
      var b = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
      var xhr = settings.xhr();
      var nativeSetHeader = xhr.setRequestHeader;
      if (deferred && deferred.promise(xhr), settings.crossDomain || setHeader("X-Requested-With", "XMLHttpRequest"), setHeader("Accept", mime || "*/*"), (mime = settings.mimeType || mime) && (mime.indexOf(",") > -1 && (mime = mime.split(",", 2)[0]), xhr.overrideMimeType && xhr.overrideMimeType(mime)), (settings.contentType || settings.contentType !== false && (settings.data && "GET" != settings.type.toUpperCase())) && setHeader("Content-Type", settings.contentType || "application/x-www-form-urlencoded"),
      settings.headers) {
        for (name in settings.headers) {
          setHeader(name, settings.headers[name]);
        }
      }
      if (xhr.setRequestHeader = setHeader, xhr.onreadystatechange = function() {
        if (4 == xhr.readyState) {
          /** @type {function (): undefined} */
          xhr.onreadystatechange = empty;
          clearTimeout(tref);
          var result;
          /** @type {boolean} */
          var error = false;
          if (xhr.status >= 200 && xhr.status < 300 || (304 == xhr.status || 0 == xhr.status && "file:" == b)) {
            dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader("content-type"));
            result = xhr.responseText;
            try {
              if ("script" == dataType) {
                (1, eval)(result);
              } else {
                if ("xml" == dataType) {
                  result = xhr.responseXML;
                } else {
                  if ("json" == dataType) {
                    result = blankRE.test(result) ? null : $.parseJSON(result);
                  }
                }
              }
            } catch (err) {
              error = err;
            }
            if (error) {
              ajaxError(error, "parsererror", xhr, settings, deferred);
            } else {
              ajaxSuccess(result, xhr, settings, deferred);
            }
          } else {
            ajaxError(xhr.statusText || null, xhr.status ? "error" : "abort", xhr, settings, deferred);
          }
        }
      }, ajaxBeforeSend(xhr, settings) === false) {
        return xhr.abort(), ajaxError(null, "abort", xhr, settings, deferred), xhr;
      }
      if (settings.xhrFields) {
        for (name in settings.xhrFields) {
          xhr[name] = settings.xhrFields[name];
        }
      }
      var async = "async" in settings ? settings.async : true;
      xhr.open(settings.type, settings.url, async, settings.username, settings.password);
      for (name in headers) {
        nativeSetHeader.apply(xhr, headers[name]);
      }
      return settings.timeout > 0 && (tref = setTimeout(function() {
        /** @type {function (): undefined} */
        xhr.onreadystatechange = empty;
        xhr.abort();
        ajaxError(null, "timeout", xhr, settings, deferred);
      }, settings.timeout)), xhr.send(settings.data ? settings.data : null), xhr;
    };
    /**
     * @return {?}
     */
    $.get = function() {
      return $.ajax(parseArguments.apply(null, arguments));
    };
    /**
     * @return {?}
     */
    $.post = function() {
      var options = parseArguments.apply(null, arguments);
      return options.type = "POST", $.ajax(options);
    };
    /**
     * @return {?}
     */
    $.getJSON = function() {
      var options = parseArguments.apply(null, arguments);
      return options.dataType = "json", $.ajax(options);
    };
    /**
     * @param {string} url
     * @param {Function} data
     * @param {Object} success
     * @return {?}
     */
    $.fn.load = function(url, data, success) {
      if (!this.length) {
        return this;
      }
      var selector;
      var self = this;
      var parts = url.split(/\s/);
      var options = parseArguments(url, data, success);
      /** @type {function (string): undefined} */
      var callback = options.success;
      return parts.length > 1 && (options.url = parts[0], selector = parts[1]), options.success = function(response) {
        self.html(selector ? $("<div>").html(response.replace(rscript, "")).find(selector) : response);
        if (callback) {
          callback.apply(self, arguments);
        }
      }, $.ajax(options), this;
    };
    /** @type {function (string): string} */
    var escape = encodeURIComponent;
    /**
     * @param {string} obj
     * @param {boolean} traditional
     * @return {?}
     */
    $.param = function(obj, traditional) {
      /** @type {Array} */
      var params = [];
      return params.add = function(selector, v) {
        this.push(escape(selector) + "=" + escape(v));
      }, serialize(params, obj, traditional), params.join("&").replace(/%20/g, "+");
    };
  })(Zepto);
  (function($) {
    /**
     * @return {?}
     */
    $.fn.serializeArray = function() {
      var input;
      /** @type {Array} */
      var sorted = [];
      return $([].slice.call(this.get(0).elements)).each(function() {
        input = $(this);
        var n = input.attr("type");
        if ("fieldset" != this.nodeName.toLowerCase()) {
          if (!this.disabled) {
            if ("submit" != n) {
              if ("reset" != n) {
                if ("button" != n) {
                  if ("radio" != n && "checkbox" != n || this.checked) {
                    sorted.push({
                      name : input.attr("name"),
                      value : input.val()
                    });
                  }
                }
              }
            }
          }
        }
      }), sorted;
    };
    /**
     * @return {?}
     */
    $.fn.serialize = function() {
      /** @type {Array} */
      var tagNameArr = [];
      return this.serializeArray().forEach(function(elm) {
        tagNameArr.push(encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value));
      }), tagNameArr.join("&");
    };
    /**
     * @param {Function} callback
     * @return {?}
     */
    $.fn.submit = function(callback) {
      if (callback) {
        this.bind("submit", callback);
      } else {
        if (this.length) {
          var event = $.Event("submit");
          this.eq(0).trigger(event);
          if (!event.isDefaultPrevented()) {
            this.get(0).submit();
          }
        }
      }
      return this;
    };
  })(Zepto);
  (function($) {
    /**
     * @param {string} ua
     * @return {undefined}
     */
    function detect(ua) {
      var os = this.os = {};
      var browser = this.browser = {};
      var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
      var blackberry = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
      /** @type {boolean} */
      var ios = !!ua.match(/\(Macintosh\; Intel /);
      var attrs = ua.match(/(iPad).*OS\s([\d_]+)/);
      var attrList = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      var types = !attrs && ua.match(/(iPhone\sOS)\s([\d_]+)/);
      var android = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
      var l = android && ua.match(/TouchPad/);
      var webos = ua.match(/Kindle\/([\d.]+)/);
      var silk = ua.match(/Silk\/([\d._]+)/);
      var kindle = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
      var rimtabletos = ua.match(/(BB10).*Version\/([\d.]+)/);
      var bb10 = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
      var validations = ua.match(/PlayBook/);
      var firefox = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
      var nameAndVersion = ua.match(/Firefox\/([\d.]+)/);
      var ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/);
      var opt_rv = !firefox && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);
      var rv = opt_rv || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
      if (browser.webkit = !!webkit) {
        browser.version = webkit[1];
      }
      if (blackberry) {
        /** @type {boolean} */
        os.android = true;
        os.version = blackberry[2];
      }
      if (types) {
        if (!attrList) {
          /** @type {boolean} */
          os.ios = os.iphone = true;
          os.version = types[2].replace(/_/g, ".");
        }
      }
      if (attrs) {
        /** @type {boolean} */
        os.ios = os.ipad = true;
        os.version = attrs[2].replace(/_/g, ".");
      }
      if (attrList) {
        /** @type {boolean} */
        os.ios = os.ipod = true;
        os.version = attrList[3] ? attrList[3].replace(/_/g, ".") : null;
      }
      if (android) {
        /** @type {boolean} */
        os.webos = true;
        os.version = android[2];
      }
      if (l) {
        /** @type {boolean} */
        os.touchpad = true;
      }
      if (kindle) {
        /** @type {boolean} */
        os.blackberry = true;
        os.version = kindle[2];
      }
      if (rimtabletos) {
        /** @type {boolean} */
        os.bb10 = true;
        os.version = rimtabletos[2];
      }
      if (bb10) {
        /** @type {boolean} */
        os.rimtabletos = true;
        os.version = bb10[2];
      }
      if (validations) {
        /** @type {boolean} */
        browser.playbook = true;
      }
      if (webos) {
        /** @type {boolean} */
        os.kindle = true;
        os.version = webos[1];
      }
      if (silk) {
        /** @type {boolean} */
        browser.silk = true;
        browser.version = silk[1];
      }
      if (!silk) {
        if (os.android) {
          if (ua.match(/Kindle Fire/)) {
            /** @type {boolean} */
            browser.silk = true;
          }
        }
      }
      if (firefox) {
        /** @type {boolean} */
        browser.chrome = true;
        browser.version = firefox[1];
      }
      if (nameAndVersion) {
        /** @type {boolean} */
        browser.firefox = true;
        browser.version = nameAndVersion[1];
      }
      if (ie) {
        /** @type {boolean} */
        browser.ie = true;
        browser.version = ie[1];
      }
      if (rv) {
        if (ios || os.ios) {
          /** @type {boolean} */
          browser.safari = true;
          if (ios) {
            browser.version = rv[1];
          }
        }
      }
      if (opt_rv) {
        /** @type {boolean} */
        browser.webview = true;
      }
      /** @type {boolean} */
      os.tablet = !!(attrs || (validations || (blackberry && !ua.match(/Mobile/) || (nameAndVersion && ua.match(/Tablet/) || ie && (!ua.match(/Phone/) && ua.match(/Touch/))))));
      /** @type {boolean} */
      os.phone = !(os.tablet || (os.ipod || !(blackberry || (types || (android || (kindle || (rimtabletos || (firefox && ua.match(/Android/) || (firefox && ua.match(/CriOS\/([\d.]+)/) || (nameAndVersion && ua.match(/Mobile/) || ie && ua.match(/Touch/)))))))))));
    }
    detect.call($, navigator.userAgent);
    /** @type {function (string): undefined} */
    $.__detect = detect;
  })(Zepto);
  (function($, _) {
    /**
     * @param {string} str
     * @return {?}
     */
    function dasherize(str) {
      return str.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase();
    }
    /**
     * @param {string} name
     * @return {?}
     */
    function normalizeEvent(name) {
      return path ? path + name : name.toLowerCase();
    }
    var path;
    var key;
    var transitionProperty;
    var transitionDuration;
    var transitionTiming;
    var transitionDelay;
    var animationName;
    var animationDuration;
    var animationTiming;
    var animationDelay;
    /** @type {string} */
    var prefix = "";
    var vendors = {
      Webkit : "webkit",
      Moz : "",
      O : "o"
    };
    /** @type {Document} */
    var doc = window.document;
    /** @type {Element} */
    var testEl = doc.createElement("div");
    /** @type {RegExp} */
    var exclude = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
    var cssReset = {};
    $.each(vendors, function(vendor, new_path) {
      return testEl.style[vendor + "TransitionProperty"] !== _ ? (prefix = "-" + vendor.toLowerCase() + "-", path = new_path, false) : void 0;
    });
    key = prefix + "transform";
    /** @type {string} */
    cssReset[transitionProperty = prefix + "transition-property"] = cssReset[transitionDuration = prefix + "transition-duration"] = cssReset[transitionDelay = prefix + "transition-delay"] = cssReset[transitionTiming = prefix + "transition-timing-function"] = cssReset[animationName = prefix + "animation-name"] = cssReset[animationDuration = prefix + "animation-duration"] = cssReset[animationDelay = prefix + "animation-delay"] = cssReset[animationTiming = prefix + "animation-timing-function"] = "";
    $.fx = {
      off : path === _ && testEl.style.transitionProperty === _,
      speeds : {
        _default : 400,
        fast : 200,
        slow : 600
      },
      cssPrefix : prefix,
      transitionEnd : normalizeEvent("TransitionEnd"),
      animationEnd : normalizeEvent("AnimationEnd")
    };
    /**
     * @param {Object} properties
     * @param {Object} duration
     * @param {Function} ease
     * @param {Object} callback
     * @param {?} delay
     * @return {?}
     */
    $.fn.animate = function(properties, duration, ease, callback, delay) {
      return $.isFunction(duration) && (callback = duration, ease = _, duration = _), $.isFunction(ease) && (callback = ease, ease = _), $.isPlainObject(duration) && (ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration), duration && (duration = ("number" == typeof duration ? duration : $.fx.speeds[duration] || $.fx.speeds._default) / 1E3), delay && (delay = parseFloat(delay) / 1E3), this.anim(properties, duration, ease, callback, delay);
    };
    /**
     * @param {Object} properties
     * @param {number} duration
     * @param {string} ease
     * @param {Function} callback
     * @param {number} delay
     * @return {?}
     */
    $.fn.anim = function(properties, duration, ease, callback, delay) {
      var name;
      var keys;
      var wrappedCallback;
      var cssValues = {};
      /** @type {string} */
      var value = "";
      var that = this;
      var endEvent = $.fx.transitionEnd;
      /** @type {boolean} */
      var C = false;
      if (duration === _ && (duration = $.fx.speeds._default / 1E3), delay === _ && (delay = 0), $.fx.off && (duration = 0), "string" == typeof properties) {
        /** @type {Object} */
        cssValues[animationName] = properties;
        /** @type {string} */
        cssValues[animationDuration] = duration + "s";
        /** @type {string} */
        cssValues[animationDelay] = delay + "s";
        cssValues[animationTiming] = ease || "linear";
        endEvent = $.fx.animationEnd;
      } else {
        /** @type {Array} */
        keys = [];
        for (name in properties) {
          if (exclude.test(name)) {
            value += name + "(" + properties[name] + ") ";
          } else {
            cssValues[name] = properties[name];
            keys.push(dasherize(name));
          }
        }
        if (value) {
          /** @type {string} */
          cssValues[key] = value;
          keys.push(key);
        }
        if (duration > 0) {
          if ("object" == typeof properties) {
            /** @type {string} */
            cssValues[transitionProperty] = keys.join(", ");
            /** @type {string} */
            cssValues[transitionDuration] = duration + "s";
            /** @type {string} */
            cssValues[transitionDelay] = delay + "s";
            cssValues[transitionTiming] = ease || "linear";
          }
        }
      }
      return wrappedCallback = function(event) {
        if ("undefined" != typeof event) {
          if (event.target !== event.currentTarget) {
            return;
          }
          $(event.target).unbind(endEvent, wrappedCallback);
        } else {
          $(this).unbind(endEvent, wrappedCallback);
        }
        /** @type {boolean} */
        C = true;
        $(this).css(cssReset);
        if (callback) {
          callback.call(this);
        }
      }, duration > 0 && (this.bind(endEvent, wrappedCallback), setTimeout(function() {
        if (!C) {
          wrappedCallback.call(that);
        }
      }, 1E3 * duration + 25)), this.size() && this.get(0).clientLeft, this.css(cssValues), 0 >= duration && setTimeout(function() {
        that.each(function() {
          wrappedCallback.call(this);
        });
      }, 0), this;
    };
    /** @type {null} */
    testEl = null;
  })(Zepto);
  (function($, fast) {
    /**
     * @param {Object} el
     * @param {?} speed
     * @param {number} opacity
     * @param {Object} scale
     * @param {?} callback
     * @return {?}
     */
    function anim(el, speed, opacity, scale, callback) {
      if (!("function" != typeof speed)) {
        if (!callback) {
          /** @type {Function} */
          callback = speed;
          speed = fast;
        }
      }
      var props = {
        opacity : opacity
      };
      return scale && (props.scale = scale, el.css($.fx.cssPrefix + "transform-origin", "0 0")), el.animate(props, speed, null, callback);
    }
    /**
     * @param {Object} el
     * @param {?} speed
     * @param {Object} scale
     * @param {Function} callback
     * @return {?}
     */
    function hide(el, speed, scale, callback) {
      return anim(el, speed, 0, scale, function() {
        origHide.call($(this));
        if (callback) {
          callback.call(this);
        }
      });
    }
    /** @type {Document} */
    var doc = window.document;
    /** @type {function (?, ?): ?} */
    var conditional = (doc.documentElement, $.fn.show);
    /** @type {function (?, Function): ?} */
    var origHide = $.fn.hide;
    /** @type {function (?, ?): ?} */
    var fn = $.fn.toggle;
    /**
     * @param {?} speed
     * @param {?} callback
     * @return {?}
     */
    $.fn.show = function(speed, callback) {
      return conditional.call(this), speed === fast ? speed = 0 : this.css("opacity", 0), anim(this, speed, 1, "1,1", callback);
    };
    /**
     * @param {?} speed
     * @param {Function} callback
     * @return {?}
     */
    $.fn.hide = function(speed, callback) {
      return speed === fast ? origHide.call(this) : hide(this, speed, "0,0", callback);
    };
    /**
     * @param {?} val
     * @param {?} callback
     * @return {?}
     */
    $.fn.toggle = function(val, callback) {
      return val === fast || "boolean" == typeof val ? fn.call(this, val) : this.each(function() {
        var element = $(this);
        element["none" == element.css("display") ? "show" : "hide"](val, callback);
      });
    };
    /**
     * @param {?} speed
     * @param {number} opacity
     * @param {?} callback
     * @return {?}
     */
    $.fn.fadeTo = function(speed, opacity, callback) {
      return anim(this, speed, opacity, null, callback);
    };
    /**
     * @param {?} speed
     * @param {?} callback
     * @return {?}
     */
    $.fn.fadeIn = function(speed, callback) {
      var target = this.css("opacity");
      return target > 0 ? this.css("opacity", 0) : target = 1, conditional.call(this).fadeTo(speed, target, callback);
    };
    /**
     * @param {?} speed
     * @param {Function} callback
     * @return {?}
     */
    $.fn.fadeOut = function(speed, callback) {
      return hide(this, speed, null, callback);
    };
    /**
     * @param {?} speed
     * @param {?} callback
     * @return {?}
     */
    $.fn.fadeToggle = function(speed, callback) {
      return this.each(function() {
        var el = $(this);
        el[0 == el.css("opacity") || "none" == el.css("display") ? "fadeIn" : "fadeOut"](speed, callback);
      });
    };
  })(Zepto);
  (function($) {
    /**
     * @param {Object} node
     * @param {string} name
     * @return {?}
     */
    function getData(node, name) {
      var id = node[exp];
      var store = id && data[id];
      if (void 0 === name) {
        return store || setData(node);
      }
      if (store) {
        if (name in store) {
          return store[name];
        }
        var camelName = camelize(name);
        if (camelName in store) {
          return store[camelName];
        }
      }
      return dataAttr.call($(node), name);
    }
    /**
     * @param {Object} node
     * @param {string} name
     * @param {number} value
     * @return {?}
     */
    function setData(node, name, value) {
      var id = node[exp] || (node[exp] = ++$.uuid);
      var store = data[id] || (data[id] = attributeData(node));
      return void 0 !== name && (store[camelize(name)] = value), store;
    }
    /**
     * @param {Object} node
     * @return {?}
     */
    function attributeData(node) {
      var store = {};
      return $.each(node.attributes || emptyArray, function(dataAndEvents, attr) {
        if (0 == attr.name.indexOf("data-")) {
          store[camelize(attr.name.replace("data-", ""))] = $.zepto.deserializeValue(attr.value);
        }
      }), store;
    }
    var data = {};
    /** @type {function (string, number): ?} */
    var dataAttr = $.fn.data;
    var camelize = $.camelCase;
    /** @type {string} */
    var exp = $.expando = "Zepto" + +new Date;
    /** @type {Array} */
    var emptyArray = [];
    /**
     * @param {string} name
     * @param {number} value
     * @return {?}
     */
    $.fn.data = function(name, value) {
      return void 0 === value ? $.isPlainObject(name) ? this.each(function(dataAndEvents, node) {
        $.each(name, function(name, isXML) {
          setData(node, name, isXML);
        });
      }) : 0 == this.length ? void 0 : getData(this[0], name) : this.each(function() {
        setData(this, name, value);
      });
    };
    /**
     * @param {string} names
     * @return {?}
     */
    $.fn.removeData = function(names) {
      return "string" == typeof names && (names = names.split(/\s+/)), this.each(function() {
        var id = this[exp];
        var store = id && data[id];
        if (store) {
          $.each(names || store, function(key) {
            delete store[names ? camelize(this) : key];
          });
        }
      });
    };
    ["remove", "empty"].forEach(function(methodName) {
      var func = $.fn[methodName];
      /**
       * @return {?}
       */
      $.fn[methodName] = function() {
        var selected = this.find("*");
        return "remove" === methodName && (selected = selected.add(this)), selected.removeData(), func.call(this);
      };
    });
  })(Zepto);
  (function($) {
    /**
     * @param {Object} elem
     * @return {?}
     */
    function visible(elem) {
      return elem = $(elem), !(!elem.width() && !elem.height()) && "none" !== elem.css("display");
    }
    /**
     * @param {string} value
     * @param {Function} fn
     * @return {?}
     */
    function process(value, fn) {
      value = value.replace(/=#\]/g, '="#"]');
      var i;
      var arg;
      /** @type {(Array.<string>|null)} */
      var values = rtagName.exec(value);
      if (values && (values[2] in map && (i = map[values[2]], arg = values[3], value = values[1], arg))) {
        /** @type {number} */
        var val = Number(arg);
        /** @type {(number|string)} */
        arg = isNaN(val) ? arg.replace(/^["']|["']$/g, "") : val;
      }
      return fn(value, i, arg);
    }
    var zepto = $.zepto;
    /** @type {function (?, string): ?} */
    var oldQsa = zepto.qsa;
    /** @type {function (Object, Function): ?} */
    var oldMatches = zepto.matches;
    var map = $.expr[":"] = {
      /**
       * @return {?}
       */
      visible : function() {
        return visible(this) ? this : void 0;
      },
      /**
       * @return {?}
       */
      hidden : function() {
        return visible(this) ? void 0 : this;
      },
      /**
       * @return {?}
       */
      selected : function() {
        return this.selected ? this : void 0;
      },
      /**
       * @return {?}
       */
      checked : function() {
        return this.checked ? this : void 0;
      },
      /**
       * @return {?}
       */
      parent : function() {
        return this.parentNode;
      },
      /**
       * @param {number} elem
       * @return {?}
       */
      first : function(elem) {
        return 0 === elem ? this : void 0;
      },
      /**
       * @param {number} elem
       * @param {Array} array
       * @return {?}
       */
      last : function(elem, array) {
        return elem === array.length - 1 ? this : void 0;
      },
      /**
       * @param {?} a
       * @param {?} match
       * @param {?} b
       * @return {?}
       */
      eq : function(a, match, b) {
        return a === b ? this : void 0;
      },
      /**
       * @param {Object} parent
       * @param {Object} b
       * @param {?} ss
       * @return {?}
       */
      contains : function(parent, b, ss) {
        return $(this).text().indexOf(ss) > -1 ? this : void 0;
      },
      /**
       * @param {?} property
       * @param {?} target
       * @param {string} sel
       * @return {?}
       */
      has : function(property, target, sel) {
        return zepto.qsa(this, sel).length ? this : void 0;
      }
    };
    /** @type {RegExp} */
    var rtagName = new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*");
    /** @type {RegExp} */
    var isSimple = /^\s*>/;
    /** @type {string} */
    var klass = "Zepto" + +new Date;
    /**
     * @param {?} node
     * @param {string} selector
     * @return {?}
     */
    zepto.qsa = function(node, selector) {
      return process(selector, function(qualifier, next_callback, capture) {
        try {
          var clone;
          if (!qualifier && next_callback) {
            /** @type {string} */
            qualifier = "*";
          } else {
            if (isSimple.test(qualifier)) {
              clone = $(node).addClass(klass);
              /** @type {string} */
              qualifier = "." + klass + " " + qualifier;
            }
          }
          var nodes = oldQsa(node, qualifier);
        } catch (h) {
          throw console.error("error performing selector: %o", selector), h;
        } finally {
          if (clone) {
            clone.removeClass(klass);
          }
        }
        return next_callback ? zepto.uniq($.map(nodes, function(next_scope, mapper) {
          return next_callback.call(next_scope, mapper, nodes, capture);
        })) : nodes;
      });
    };
    /**
     * @param {Object} node
     * @param {Function} event
     * @return {?}
     */
    zepto.matches = function(node, event) {
      return process(event, function(qualifier, block, b) {
        return!(qualifier && !oldMatches(node, qualifier) || block && block.call(node, null, b) !== node);
      });
    };
  })(Zepto);
  (function($) {
    /**
     * @param {number} y1
     * @param {number} y2
     * @param {number} x1
     * @param {number} x2
     * @return {?}
     */
    function swipeDirection(y1, y2, x1, x2) {
      return Math.abs(y1 - y2) >= Math.abs(x1 - x2) ? y1 - y2 > 0 ? "Left" : "Right" : x1 - x2 > 0 ? "Up" : "Down";
    }
    /**
     * @return {undefined}
     */
    function longTap() {
      /** @type {null} */
      longTapTimeout = null;
      if (touch.last) {
        touch.el.trigger("longTap");
        touch = {};
      }
    }
    /**
     * @return {undefined}
     */
    function cancelLongTap() {
      if (longTapTimeout) {
        clearTimeout(longTapTimeout);
      }
      /** @type {null} */
      longTapTimeout = null;
    }
    /**
     * @return {undefined}
     */
    function cancelAll() {
      if (to) {
        clearTimeout(to);
      }
      if (going) {
        clearTimeout(going);
      }
      if (tref) {
        clearTimeout(tref);
      }
      if (longTapTimeout) {
        clearTimeout(longTapTimeout);
      }
      /** @type {null} */
      to = going = tref = longTapTimeout = null;
      touch = {};
    }
    /**
     * @param {Object} event
     * @return {?}
     */
    function isPrimaryTouch(event) {
      return("touch" == event.pointerType || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
    }
    /**
     * @param {Object} e
     * @param {string} type
     * @return {?}
     */
    function isPointerEventType(e, type) {
      return e.type == "pointer" + type || e.type.toLowerCase() == "mspointer" + type;
    }
    var to;
    var going;
    var tref;
    var longTapTimeout;
    var gesture;
    var touch = {};
    /** @type {number} */
    var longTapDelay = 750;
    $(document).ready(function() {
      var now;
      var duration;
      var firstTouch;
      var _isPointerType;
      /** @type {number} */
      var stack = 0;
      /** @type {number} */
      var memory = 0;
      if ("MSGesture" in window) {
        /** @type {MSGesture} */
        gesture = new MSGesture;
        /** @type {(HTMLElement|null)} */
        gesture.target = document.body;
      }
      $(document).bind("MSGestureEnd", function(e) {
        /** @type {(null|string)} */
        var swipeDirectionFromVelocity = e.velocityX > 1 ? "Right" : e.velocityX < -1 ? "Left" : e.velocityY > 1 ? "Down" : e.velocityY < -1 ? "Up" : null;
        if (swipeDirectionFromVelocity) {
          touch.el.trigger("swipe");
          touch.el.trigger("swipe" + swipeDirectionFromVelocity);
        }
      }).on("touchstart MSPointerDown pointerdown", function(e) {
        if (!(_isPointerType = isPointerEventType(e, "down")) || isPrimaryTouch(e)) {
          firstTouch = _isPointerType ? e : e.touches[0];
          if (e.touches) {
            if (1 === e.touches.length) {
              if (touch.x2) {
                touch.x2 = void 0;
                touch.y2 = void 0;
              }
            }
          }
          /** @type {number} */
          now = Date.now();
          /** @type {number} */
          duration = now - (touch.last || now);
          touch.el = $("tagName" in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);
          if (to) {
            clearTimeout(to);
          }
          touch.x1 = firstTouch.pageX;
          touch.y1 = firstTouch.pageY;
          if (duration > 0) {
            if (250 >= duration) {
              /** @type {boolean} */
              touch.isDoubleTap = true;
            }
          }
          /** @type {number} */
          touch.last = now;
          /** @type {number} */
          longTapTimeout = setTimeout(longTap, longTapDelay);
          if (gesture) {
            if (_isPointerType) {
              gesture.addPointer(e.pointerId);
            }
          }
        }
      }).on("touchmove MSPointerMove pointermove", function(e) {
        if (!(_isPointerType = isPointerEventType(e, "move")) || isPrimaryTouch(e)) {
          firstTouch = _isPointerType ? e : e.touches[0];
          cancelLongTap();
          touch.x2 = firstTouch.pageX;
          touch.y2 = firstTouch.pageY;
          stack += Math.abs(touch.x1 - touch.x2);
          memory += Math.abs(touch.y1 - touch.y2);
        }
      }).on("touchend MSPointerUp pointerup", function(e) {
        if (!(_isPointerType = isPointerEventType(e, "up")) || isPrimaryTouch(e)) {
          cancelLongTap();
          if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {
            /** @type {number} */
            tref = setTimeout(function() {
              touch.el.trigger("swipe");
              touch.el.trigger("swipe" + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
              touch = {};
            }, 0);
          } else {
            if ("last" in touch) {
              if (30 > stack && 30 > memory) {
                /** @type {number} */
                going = setTimeout(function() {
                  var event = $.Event("tap");
                  /** @type {function (): undefined} */
                  event.cancelTouch = cancelAll;
                  touch.el.trigger(event);
                  if (touch.isDoubleTap) {
                    if (touch.el) {
                      touch.el.trigger("doubleTap");
                    }
                    touch = {};
                  } else {
                    /** @type {number} */
                    to = setTimeout(function() {
                      /** @type {null} */
                      to = null;
                      if (touch.el) {
                        touch.el.trigger("singleTap");
                      }
                      touch = {};
                    }, 250);
                  }
                }, 0);
              } else {
                touch = {};
              }
            }
          }
          /** @type {number} */
          stack = memory = 0;
        }
      }).on("touchcancel MSPointerCancel pointercancel", cancelAll);
      $(window).on("scroll", cancelAll);
    });
    ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(name) {
      /**
       * @param {Function} selector
       * @return {?}
       */
      $.fn[name] = function(selector) {
        return this.on(name, selector);
      };
    });
  })(Zepto);
  !function($) {
    $.extend($, {
      /**
       * @param {Object} container
       * @param {Object} element
       * @return {?}
       */
      contains : function(container, element) {
        return container.compareDocumentPosition ? !!(16 & container.compareDocumentPosition(element)) : container !== element && container.contains(element);
      }
    });
  }(Zepto);
  (function($, node) {
    $.extend($, {
      /**
       * @param {?} object
       * @return {?}
       */
      toString : function(object) {
        return Object.prototype.toString.call(object);
      },
      /**
       * @param {number} recurring
       * @param {number} start
       * @return {?}
       */
      slice : function(recurring, start) {
        return Array.prototype.slice.call(recurring, start || 0);
      },
      /**
       * @param {Function} fn
       * @param {number} v2
       * @param {boolean} when
       * @param {?} context
       * @param {?} data
       * @return {?}
       */
      later : function(fn, v2, when, context, data) {
        return window["set" + (when ? "Interval" : "Timeout")](function() {
          fn.apply(context, data);
        }, v2 || 0);
      },
      /**
       * @param {string} messageFormat
       * @param {Object} data
       * @return {?}
       */
      parseTpl : function(messageFormat, data) {
        /** @type {string} */
        var tmpl = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" + messageFormat.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g, function(dataAndEvents, messageFormat) {
          return "'," + messageFormat.replace(/\\'/g, "'") + ",'";
        }).replace(/<%([\s\S]+?)%>/g, function(dataAndEvents, messageFormat) {
          return "');" + messageFormat.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ") + "__p.push('";
        }).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "');}return __p.join('');";
        /** @type {Function} */
        var func = new Function("obj", tmpl);
        return data ? func(data) : func;
      },
      /**
       * @param {boolean} delay
       * @param {boolean} fn
       * @param {boolean} debounce_mode
       * @return {?}
       */
      throttle : function(delay, fn, debounce_mode) {
        /**
         * @return {undefined}
         */
        function wrapper() {
          /**
           * @return {undefined}
           */
          function exec() {
            /** @type {number} */
            last_exec = Date.now();
            fn.apply(that, newArgs);
          }
          /**
           * @return {undefined}
           */
          function clear() {
            /** @type {boolean} */
            tref = node;
          }
          var that = this;
          /** @type {number} */
          var elapsed = Date.now() - last_exec;
          /** @type {Arguments} */
          var newArgs = arguments;
          if (debounce_mode) {
            if (!tref) {
              exec();
            }
          }
          if (tref) {
            clearTimeout(tref);
          }
          if (debounce_mode === node && elapsed > delay) {
            exec();
          } else {
            /** @type {number} */
            tref = setTimeout(debounce_mode ? clear : exec, debounce_mode === node ? delay - elapsed : delay);
          }
        }
        var tref;
        /** @type {number} */
        var last_exec = 0;
        return "function" != typeof fn && (debounce_mode = fn, fn = delay, delay = 250), wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid, wrapper;
      },
      /**
       * @param {Object} fn
       * @param {boolean} n
       * @param {boolean} context
       * @return {?}
       */
      debounce : function(fn, n, context) {
        return n === node ? $.throttle(250, fn, false) : $.throttle(fn, n, context === node ? false : context !== false);
      }
    });
    $.each("String Boolean RegExp Number Date Object Null Undefined".split(" "), function(dataAndEvents, method) {
      var hasClass;
      if (!("is" + method in $)) {
        switch(method) {
          case "Null":
            /**
             * @param {number} selector
             * @return {?}
             */
            hasClass = function(selector) {
              return null === selector;
            };
            break;
          case "Undefined":
            /**
             * @param {boolean} selector
             * @return {?}
             */
            hasClass = function(selector) {
              return selector === node;
            };
            break;
          default:
            /**
             * @param {?} el
             * @return {?}
             */
            hasClass = function(el) {
              return(new RegExp(method + "]", "i")).test(className(el));
            };
        }
        /** @type {function (number): ?} */
        $["is" + method] = hasClass;
      }
    });
    var className = $.toString;
  })(Zepto);
  (function($) {
    /** @type {string} */
    var ua = navigator.userAgent;
    /** @type {string} */
    var version = navigator.appVersion;
    var b = $.browser;
    $.extend(b, {
      qq : /qq/i.test(ua),
      uc : /UC/i.test(ua) || /UC/i.test(version)
    });
    b.uc = b.uc || !b.qq && (!b.chrome && (!b.firefox && !/safari/i.test(ua)));
    try {
      b.version = b.uc ? version.match(/UC(?:Browser)?\/([\d.]+)/)[1] : b.qq ? ua.match(/MQQBrowser\/([\d.]+)/)[1] : b.version;
    } catch (r) {
    }
    $.support = $.extend($.support || {}, {
      orientation : !(b.uc || parseFloat($.os.version) < 5 && (b.qq || b.chrome)) && (!($.os.android && parseFloat($.os.version) > 3) && ("orientation" in window && "onorientationchange" in window)),
      touch : "ontouchend" in document,
      cssTransitions : "WebKitTransitionEvent" in window,
      has3d : "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix
    });
  })(Zepto);
  (function($) {
    /**
     * @return {undefined}
     */
    function link() {
      $(window).on("scroll", $.debounce(80, function() {
        $(document).trigger("scrollStop");
      }, false));
    }
    /**
     * @return {undefined}
     */
    function close() {
      $(window).off("scroll");
      link();
    }
    $.matchMedia = function() {
      /** @type {number} */
      var NOW = 0;
      /** @type {string} */
      var x = "gmu-media-detect";
      var endEvent = $.fx.transitionEnd;
      var prefix = $.fx.cssPrefix;
      var $head = $("<style></style>").append("." + x + "{" + prefix + "transition: width 0.001ms; width: 0; position: relative; bottom: -999999px;}\n").appendTo("head");
      return function(q) {
        var matcher;
        /** @type {string} */
        var xm = x + NOW++;
        var target = $('<div class="' + x + '" id="' + xm + '"></div>').appendTo("body");
        /** @type {Array} */
        var events = [];
        return $head.append("@media " + q + " { #" + xm + " { width: 100px; } }\n"), target.on(endEvent, function() {
          /** @type {boolean} */
          matcher.matches = 100 === target.width();
          $.each(events, function(dataAndEvents, url) {
            if ($.isFunction(url)) {
              url.call(matcher, matcher);
            }
          });
        }), matcher = {
          matches : 100 === target.width(),
          media : q,
          /**
           * @param {Object} prop
           * @return {?}
           */
          addListener : function(prop) {
            return events.push(prop), this;
          },
          /**
           * @param {?} fn
           * @return {?}
           */
          removeListener : function(fn) {
            /** @type {number} */
            var index = events.indexOf(fn);
            return~index && events.splice(index, 1), this;
          }
        };
      };
    }();
    $(function() {
      /**
       * @param {Object} b
       * @return {undefined}
       */
      var fn = function(b) {
        if (len !== b.matches) {
          $(window).trigger("ortchange");
          len = b.matches;
        }
      };
      /** @type {boolean} */
      var len = true;
      $.mediaQuery = {
        ortchange : "screen and (width: " + window.innerWidth + "px)"
      };
      $.matchMedia($.mediaQuery.ortchange).addListener(fn);
    });
    link();
    $(window).on("pageshow", function(event) {
      if (event.persisted) {
        $(document).off("touchstart", close).one("touchstart", close);
      }
    });
  })(Zepto);
  window.jQuery = window.jQuery || window.Zepto;
  !function(factory) {
    factory(window.Zepto);
  }(function($) {
    /**
     * @param {string} s
     * @return {?}
     */
    function encode(s) {
      return config.raw ? s : encodeURIComponent(s);
    }
    /**
     * @param {(Image|string)} s
     * @return {?}
     */
    function decode(s) {
      return config.raw ? s : decodeURIComponent(s);
    }
    /**
     * @param {string} value
     * @return {?}
     */
    function stringifyCookieValue(value) {
      return encode(config.json ? JSON.stringify(value) : String(value));
    }
    /**
     * @param {string} s
     * @return {?}
     */
    function parseCookieValue(s) {
      if (0 === s.indexOf('"')) {
        s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      }
      try {
        return s = decodeURIComponent(s.replace(rSlash, " ")), config.json ? JSON.parse(s) : s;
      } catch (e) {
      }
    }
    /**
     * @param {(Array|string)} s
     * @param {?} converter
     * @return {?}
     */
    function read(s, converter) {
      var value = config.raw ? s : parseCookieValue(s);
      return $.isFunction(converter) ? converter(value) : value;
    }
    /** @type {RegExp} */
    var rSlash = /\+/g;
    /** @type {function (Object, string, Object): ?} */
    var config = $.cookie = function(key, value, options) {
      if (void 0 !== value && !$.isFunction(value)) {
        if (options = $.extend({}, config.defaults, options), "number" == typeof options.expires) {
          var days = options.expires;
          /** @type {Date} */
          var self = options.expires = new Date;
          self.setTime(+self + 864E5 * days);
        }
        return document.cookie = [encode(key), "=", stringifyCookieValue(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : ""].join("");
      }
      /** @type {(undefined|{})} */
      var result = key ? void 0 : {};
      /** @type {Array} */
      var directives = document.cookie ? document.cookie.split("; ") : [];
      /** @type {number} */
      var i = 0;
      /** @type {number} */
      var len = directives.length;
      for (;len > i;i++) {
        var namespaces = directives[i].split("=");
        var name = decode(namespaces.shift());
        var cookie = namespaces.join("=");
        if (key && key === name) {
          result = read(cookie, value);
          break;
        }
        if (!key) {
          if (!(void 0 === (cookie = read(cookie)))) {
            result[name] = cookie;
          }
        }
      }
      return result;
    };
    config.defaults = {};
    /**
     * @param {string} key
     * @param {?} options
     * @return {?}
     */
    $.removeCookie = function(key, options) {
      return void 0 === $.cookie(key) ? false : ($.cookie(key, "", $.extend({}, options, {
        expires : -1
      })), !$.cookie(key));
    };
  });
  !function($, elem, node, line) {
    var $window = $(elem);
    /**
     * @param {?} options
     * @return {?}
     */
    $.fn.lazyload = function(options) {
      /**
       * @return {undefined}
       */
      function update() {
        /** @type {number} */
        var counter = 0;
        elements.each(function() {
          var $this = $(this);
          if ((!settings.skip_invisible || ($this.width() || $this.height())) && "none" !== $this.css("display")) {
            if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
            } else {
              if ($.belowthefold(this, settings) || $.rightoffold(this, settings)) {
                if (++counter > settings.failure_limit) {
                  return false;
                }
              } else {
                $this.trigger("appear");
                /** @type {number} */
                counter = 0;
              }
            }
          }
        });
      }
      var $container;
      var elements = this;
      var settings = {
        threshold : 600,
        failure_limit : 0,
        event : "scroll",
        effect : "show",
        container : elem,
        data_attribute : "original",
        skip_invisible : true,
        appear : null,
        load : null
      };
      return options && (line !== options.failurelimit && (options.failure_limit = options.failurelimit, delete options.failurelimit), line !== options.effectspeed && (options.effect_speed = options.effectspeed, delete options.effectspeed), $.extend(settings, options)), $container = settings.container === line || settings.container === elem ? $window : $(settings.container), 0 === settings.event.indexOf("scroll") && $container.bind(settings.event, function() {
        return update();
      }), this.each(function() {
        var self = this;
        var $self = $(self);
        /** @type {boolean} */
        self.loaded = false;
        $self.one("appear", function() {
          if (!this.loaded) {
            if (settings.appear) {
              var elements_left = elements.length;
              settings.appear.call(self, elements_left, settings);
            }
            $("<img />").bind("load", function() {
              $self.hide().attr("src", $self.data(settings.data_attribute))[settings.effect](settings.effect_speed);
              /** @type {boolean} */
              self.loaded = true;
              var temp = $.grep(elements, function(element) {
                return!element.loaded;
              });
              if (elements = $(temp), settings.load) {
                var elements_left = elements.length;
                settings.load.call(self, elements_left, settings);
              }
            }).attr("src", $self.data(settings.data_attribute));
          }
        });
        if (0 !== settings.event.indexOf("scroll")) {
          $self.bind(settings.event, function() {
            if (!self.loaded) {
              $self.trigger("appear");
            }
          });
        }
      }), $window.bind("resize", function() {
        update();
      }), /iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion) && $window.bind("pageshow", function(event) {
        if (event.originalEvent) {
          if (event.originalEvent.persisted) {
            elements.each(function() {
              $(this).trigger("appear");
            });
          }
        }
      }), $(node).ready(function() {
        update();
      }), this;
    };
    /**
     * @param {?} element
     * @param {Object} settings
     * @return {?}
     */
    $.belowthefold = function(element, settings) {
      var a;
      return a = settings.container === line || settings.container === elem ? $window.height() + $window.scrollTop() : $(settings.container).offset().top + $(settings.container).height(), a <= $(element).offset().top - settings.threshold;
    };
    /**
     * @param {?} element
     * @param {Object} settings
     * @return {?}
     */
    $.rightoffold = function(element, settings) {
      var a;
      return a = settings.container === line || settings.container === elem ? $window.width() + elem.pageXOffset : $(settings.container).offset().left + $(settings.container).width(), a <= $(element).offset().left - settings.threshold;
    };
    /**
     * @param {?} element
     * @param {Object} settings
     * @return {?}
     */
    $.abovethetop = function(element, settings) {
      var a;
      return a = settings.container === line || settings.container === elem ? $window.scrollTop() : $(settings.container).offset().top, a >= $(element).offset().top + settings.threshold + $(element).height();
    };
    /**
     * @param {?} element
     * @param {Object} settings
     * @return {?}
     */
    $.leftofbegin = function(element, settings) {
      var o;
      return o = settings.container === line || settings.container === elem ? elem.pageXOffset : $(settings.container).offset().left, o >= $(element).offset().left + settings.threshold + $(element).width();
    };
    /**
     * @param {?} element
     * @param {Object} settings
     * @return {?}
     */
    $.inviewport = function(element, settings) {
      return!($.rightoffold(element, settings) || ($.leftofbegin(element, settings) || ($.belowthefold(element, settings) || $.abovethetop(element, settings))));
    };
    if ($.expr[":"]) {
      $.extend($.expr[":"], {
        /**
         * @param {?} a
         * @return {?}
         */
        "below-the-fold" : function(a) {
          return $.belowthefold(a, {
            threshold : 0
          });
        },
        /**
         * @param {?} a
         * @return {?}
         */
        "above-the-top" : function(a) {
          return!$.belowthefold(a, {
            threshold : 0
          });
        },
        /**
         * @param {?} a
         * @return {?}
         */
        "right-of-screen" : function(a) {
          return $.rightoffold(a, {
            threshold : 0
          });
        },
        /**
         * @param {?} a
         * @return {?}
         */
        "left-of-screen" : function(a) {
          return!$.rightoffold(a, {
            threshold : 0
          });
        },
        /**
         * @param {?} a
         * @return {?}
         */
        "in-viewport" : function(a) {
          return $.inviewport(a, {
            threshold : 0
          });
        },
        /**
         * @param {?} a
         * @return {?}
         */
        "above-the-fold" : function(a) {
          return!$.belowthefold(a, {
            threshold : 0
          });
        },
        /**
         * @param {?} a
         * @return {?}
         */
        "right-of-fold" : function(a) {
          return $.rightoffold(a, {
            threshold : 0
          });
        },
        /**
         * @param {?} a
         * @return {?}
         */
        "left-of-fold" : function(a) {
          return!$.rightoffold(a, {
            threshold : 0
          });
        }
      });
    }
  }(window.Zepto, window, document);
  !function($) {
    var DEFAULTS = {
      endY : 1,
      duration : 200,
      updateRate : 15
    };
    /**
     * @param {number} source
     * @param {number} target
     * @param {number} pos
     * @return {?}
     */
    var interpolate = function(source, target, pos) {
      return source + (target - source) * pos;
    };
    /**
     * @param {number} pos
     * @return {?}
     */
    var move = function(pos) {
      return-Math.cos(pos * Math.PI) / 2 + 0.5;
    };
    /**
     * @param {number} d
     * @return {?}
     */
    var scroll = function(d) {
      var options = $.extend({}, DEFAULTS, d);
      if (0 === options.duration) {
        return window.scrollTo(0, options.endY), void("function" == typeof options.callback && options.callback());
      }
      /** @type {number} */
      var startY = window.pageYOffset;
      /** @type {number} */
      var startT = Date.now();
      var finishT = startT + options.duration;
      /**
       * @return {undefined}
       */
      var animate = function() {
        /** @type {number} */
        var now = Date.now();
        /** @type {number} */
        var to = now > finishT ? 1 : (now - startT) / options.duration;
        window.scrollTo(0, interpolate(startY, options.endY, move(to)));
        if (finishT > now) {
          setTimeout(animate, options.updateRate);
        } else {
          if ("function" == typeof options.callback) {
            options.callback();
          }
        }
      };
      animate();
    };
    /**
     * @param {?} settings
     * @return {?}
     */
    var scrollNode = function(settings) {
      var options = $.extend({}, DEFAULTS, settings);
      if (0 === options.duration) {
        return this.scrollTop = options.endY, void("function" == typeof options.callback && options.callback());
      }
      var startY = this.scrollTop;
      /** @type {number} */
      var startT = Date.now();
      var finishT = startT + options.duration;
      var _this = this;
      /**
       * @return {undefined}
       */
      var animate = function() {
        /** @type {number} */
        var now = Date.now();
        /** @type {number} */
        var to = now > finishT ? 1 : (now - startT) / options.duration;
        _this.scrollTop = interpolate(startY, options.endY, move(to));
        if (finishT > now) {
          setTimeout(animate, options.updateRate);
        } else {
          if ("function" == typeof options.callback) {
            options.callback();
          }
        }
      };
      animate();
    };
    /** @type {function (number): ?} */
    $.scrollTo = scroll;
    /**
     * @return {undefined}
     */
    $.fn.scrollTo = function() {
      if (this.length) {
        /** @type {Arguments} */
        var args = arguments;
        this.forEach(function(opt_context) {
          scrollNode.apply(opt_context, args);
        });
      }
    };
  }(Zepto);
  !function(client) {
    /**
     * @param {number} value
     * @return {undefined}
     */
    var parse = function(value) {
      if (value) {
        client.Tracker.tap({
          log : client.Tracker.urlEncode({
            id : value,
            ts : (new Date).getTime(),
            session_id : client.Tracker.sessionId,
            batch_id : client.Tracker.batchId,
            user_id : Cookies.get("userId") || (Cookies.get("cUserId") || ""),
            type : "event"
          })
        });
      }
    };
    /**
     * @param {Object} obj
     * @return {undefined}
     */
    client.Tracker.push = function(obj) {
      if (obj && ("event" == obj.type && obj.value)) {
        parse(obj.value);
      } else {
        if (obj && "page" != obj.type) {
          if (obj) {
            if ("error" == obj.type) {
              if (obj.msg) {
                client.Tracker.trackError(obj);
              }
            }
          }
        } else {
          client.Tracker.trackPage();
        }
      }
    };
    if ($) {
      if ($.fn) {
        if ($.fn.tap) {
          $(document).bind("tap", function(event) {
            var udataCur;
            var cur = event.target;
            /** @type {number} */
            var r = 5;
            for (;cur && (cur.hasAttribute && r--);) {
              if (udataCur = cur.getAttribute("data-event")) {
                parse(udataCur);
                break;
              }
              cur = cur.parentNode;
            }
          });
        }
      }
    }
  }(window);
  module.exports = Zepto;
});
define("swipe", function(require, dataAndEvents, module) {
  /**
   * @param {Element} el
   * @param {Object} options
   * @return {?}
   */
  function init(el, options) {
    /**
     * @return {undefined}
     */
    function setup() {
      slides = element.children;
      length = slides.length;
      if (slides.length < 2) {
        /** @type {boolean} */
        options.continuous = false;
      }
      if (browser.transitions) {
        if (options.continuous) {
          if (slides.length < 3) {
            element.appendChild(slides[0].cloneNode(true));
            element.appendChild(element.children[1].cloneNode(true));
            slides = element.children;
          }
        }
      }
      /** @type {Array} */
      slidePos = new Array(slides.length);
      width = el.getBoundingClientRect().width || el.offsetWidth;
      /** @type {string} */
      element.style.width = slides.length * width + "px";
      var pos = slides.length;
      for (;pos--;) {
        var slide = slides[pos];
        /** @type {string} */
        slide.style.width = width + "px";
        slide.setAttribute("data-index", pos);
        if (browser.transitions) {
          /** @type {string} */
          slide.style.left = pos * -width + "px";
          move(pos, index > pos ? -width : pos > index ? width : 0, 0);
        }
      }
      if (options.continuous) {
        if (browser.transitions) {
          move(circle(index - 1), -width, 0);
          move(circle(index + 1), width, 0);
        }
      }
      if (!browser.transitions) {
        /** @type {string} */
        element.style.left = index * -width + "px";
      }
      /** @type {string} */
      el.style.visibility = "visible";
    }
    /**
     * @return {undefined}
     */
    function prev() {
      if (options.continuous) {
        slide(index - 1);
      } else {
        if (index) {
          slide(index - 1);
        }
      }
    }
    /**
     * @return {undefined}
     */
    function next() {
      if (options.continuous) {
        slide(index + 1);
      } else {
        if (index < slides.length - 1) {
          slide(index + 1);
        }
      }
    }
    /**
     * @param {number} index
     * @return {?}
     */
    function circle(index) {
      return(slides.length + index % slides.length) % slides.length;
    }
    /**
     * @param {number} to
     * @param {number} slideSpeed
     * @return {undefined}
     */
    function slide(to, slideSpeed) {
      if (index != to) {
        if (browser.transitions) {
          /** @type {number} */
          var direction = Math.abs(index - to) / (index - to);
          if (options.continuous) {
            /** @type {number} */
            var natural_direction = direction;
            /** @type {number} */
            direction = -slidePos[circle(to)] / width;
            if (direction !== natural_direction) {
              to = -direction * slides.length + to;
            }
          }
          /** @type {number} */
          var diff = Math.abs(index - to) - 1;
          for (;diff--;) {
            move(circle((to > index ? to : index) - diff - 1), width * direction, 0);
          }
          to = circle(to);
          move(index, width * direction, slideSpeed || speed);
          move(to, 0, slideSpeed || speed);
          if (options.continuous) {
            move(circle(to - direction), -(width * direction), 0);
          }
        } else {
          to = circle(to);
          animate(index * -width, to * -width, slideSpeed || speed);
        }
        /** @type {number} */
        index = to;
        offloadFn(options.callback && options.callback(index, slides[index]));
      }
    }
    /**
     * @param {?} index
     * @param {number} dist
     * @param {number} recurring
     * @return {undefined}
     */
    function move(index, dist, recurring) {
      translate(index, dist, recurring);
      /** @type {number} */
      slidePos[index] = dist;
    }
    /**
     * @param {?} index
     * @param {number} dist
     * @param {number} recurring
     * @return {undefined}
     */
    function translate(index, dist, recurring) {
      var slide = slides[index];
      var style = slide && slide.style;
      if (style) {
        /** @type {string} */
        style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = recurring + "ms";
        /** @type {string} */
        style.webkitTransform = "translate(" + dist + "px,0)translateZ(0)";
        /** @type {string} */
        style.msTransform = style.MozTransform = style.OTransform = "translateX(" + dist + "px)";
      }
    }
    /**
     * @param {number} from
     * @param {number} to
     * @param {(number|string)} b
     * @return {?}
     */
    function animate(from, to, b) {
      if (!b) {
        return void(element.style.left = to + "px");
      }
      /** @type {number} */
      var p2y = +new Date;
      /** @type {number} */
      var poll = setInterval(function() {
        /** @type {number} */
        var a = +new Date - p2y;
        return a > b ? (element.style.left = to + "px", backoff && hide(), options.transitionEnd && options.transitionEnd.call(event, index, slides[index]), void clearInterval(poll)) : void(element.style.left = (to - from) * (Math.floor(a / b * 100) / 100) + from + "px");
      }, 4);
    }
    /**
     * @return {undefined}
     */
    function hide() {
      /** @type {number} */
      animationTimer = setTimeout(next, backoff);
    }
    /**
     * @return {undefined}
     */
    function stop() {
      /** @type {number} */
      backoff = 0;
      clearTimeout(animationTimer);
    }
    /**
     * @return {undefined}
     */
    var noop = function() {
    };
    /**
     * @param {Function} fn
     * @return {undefined}
     */
    var offloadFn = function(fn) {
      setTimeout(fn || noop, 0);
    };
    var browser = {
      addEventListener : !!window.addEventListener,
      touch : "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch,
      transitions : function(obj) {
        /** @type {Array} */
        var props = ["transitionProperty", "WebkitTransition", "MozTransition", "OTransition", "msTransition"];
        var i;
        for (i in props) {
          if (void 0 !== obj.style[props[i]]) {
            return true;
          }
        }
        return false;
      }(document.createElement("swipe"))
    };
    if (el) {
      var slides;
      var slidePos;
      var width;
      var length;
      var element = el.children[0];
      options = options || {};
      /** @type {number} */
      var index = parseInt(options.startSlide, 10) || 0;
      var speed = options.speed || 300;
      options.continuous = void 0 !== options.continuous ? options.continuous : true;
      var animationTimer;
      var io;
      var backoff = options.auto || 0;
      var start = {};
      var delta = {};
      var events = {
        /**
         * @param {Object} event
         * @return {undefined}
         */
        handleEvent : function(event) {
          switch(event.type) {
            case "touchstart":
              this.start(event);
              break;
            case "touchmove":
              this.move(event);
              break;
            case "touchend":
              offloadFn(this.end(event));
              break;
            case "webkitTransitionEnd":
            ;
            case "msTransitionEnd":
            ;
            case "oTransitionEnd":
            ;
            case "otransitionend":
            ;
            case "transitionend":
              offloadFn(this.transitionEnd(event));
              break;
            case "resize":
              offloadFn(setup);
          }
          if (options.stopPropagation) {
            event.stopPropagation();
          }
        },
        /**
         * @param {Object} event
         * @return {undefined}
         */
        start : function(event) {
          var touches = event.touches[0];
          start = {
            x : touches.pageX,
            y : touches.pageY,
            time : +new Date
          };
          io = void 0;
          delta = {};
          element.addEventListener("touchmove", this, false);
          element.addEventListener("touchend", this, false);
        },
        /**
         * @param {Object} event
         * @return {undefined}
         */
        move : function(event) {
          if (!(event.touches.length > 1 || event.scale && 1 !== event.scale)) {
            if (options.disableScroll) {
              event.preventDefault();
            }
            var touches = event.touches[0];
            delta = {
              x : touches.pageX - start.x,
              y : touches.pageY - start.y
            };
            if ("undefined" == typeof io) {
              /** @type {boolean} */
              io = !!(io || Math.abs(delta.x) < Math.abs(delta.y));
            }
            if (!io) {
              event.preventDefault();
              stop();
              if (options.continuous) {
                translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                translate(index, delta.x + slidePos[index], 0);
                translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
              } else {
                /** @type {number} */
                delta.x = delta.x / (!index && delta.x > 0 || index == slides.length - 1 && delta.x < 0 ? Math.abs(delta.x) / width + 1 : 1);
                translate(index - 1, delta.x + slidePos[index - 1], 0);
                translate(index, delta.x + slidePos[index], 0);
                translate(index + 1, delta.x + slidePos[index + 1], 0);
              }
            }
          }
        },
        /**
         * @return {undefined}
         */
        end : function() {
          /** @type {number} */
          var fromIndex = +new Date - start.time;
          /** @type {boolean} */
          var _tryInitOnFocus = Number(fromIndex) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > width / 2;
          /** @type {boolean} */
          var _isFocused = !index && delta.x > 0 || index == slides.length - 1 && delta.x < 0;
          if (options.continuous) {
            /** @type {boolean} */
            _isFocused = false;
          }
          /** @type {boolean} */
          var o = delta.x < 0;
          if (!io) {
            if (_tryInitOnFocus && !_isFocused) {
              if (o) {
                if (options.continuous) {
                  move(circle(index - 1), -width, 0);
                  move(circle(index + 2), width, 0);
                } else {
                  move(index - 1, -width, 0);
                }
                move(index, slidePos[index] - width, speed);
                move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                index = circle(index + 1);
              } else {
                if (options.continuous) {
                  move(circle(index + 1), width, 0);
                  move(circle(index - 2), -width, 0);
                } else {
                  move(index + 1, width, 0);
                }
                move(index, slidePos[index] + width, speed);
                move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                index = circle(index - 1);
              }
              if (options.callback) {
                options.callback(index, slides[index]);
              }
            } else {
              if (options.continuous) {
                move(circle(index - 1), -width, speed);
                move(index, 0, speed);
                move(circle(index + 1), width, speed);
              } else {
                move(index - 1, -width, speed);
                move(index, 0, speed);
                move(index + 1, width, speed);
              }
            }
          }
          element.removeEventListener("touchmove", events, false);
          element.removeEventListener("touchend", events, false);
        },
        /**
         * @param {Object} evt
         * @return {undefined}
         */
        transitionEnd : function(evt) {
          if (parseInt(evt.target.getAttribute("data-index"), 10) == index) {
            if (backoff) {
              hide();
            }
            if (options.transitionEnd) {
              options.transitionEnd.call(evt, index, slides[index]);
            }
          }
        }
      };
      return setup(), backoff && hide(), browser.addEventListener ? (browser.touch && element.addEventListener("touchstart", events, false), browser.transitions && (element.addEventListener("webkitTransitionEnd", events, false), element.addEventListener("msTransitionEnd", events, false), element.addEventListener("oTransitionEnd", events, false), element.addEventListener("otransitionend", events, false), element.addEventListener("transitionend", events, false)), window.addEventListener("resize", events,
      false)) : window.onresize = function() {
        setup();
      }, {
        /**
         * @return {undefined}
         */
        setup : function() {
          setup();
        },
        /**
         * @param {number} to
         * @param {number} speed
         * @return {undefined}
         */
        slide : function(to, speed) {
          stop();
          slide(to, speed);
        },
        /**
         * @return {undefined}
         */
        prev : function() {
          stop();
          prev();
        },
        /**
         * @return {undefined}
         */
        next : function() {
          stop();
          next();
        },
        /**
         * @return {undefined}
         */
        stop : function() {
          stop();
        },
        /**
         * @return {?}
         */
        getPos : function() {
          return index;
        },
        /**
         * @return {?}
         */
        getNumSlides : function() {
          return length;
        },
        /**
         * @return {undefined}
         */
        kill : function() {
          stop();
          /** @type {string} */
          element.style.width = "";
          /** @type {string} */
          element.style.left = "";
          var pos = slides.length;
          for (;pos--;) {
            var slide = slides[pos];
            /** @type {string} */
            slide.style.width = "";
            /** @type {string} */
            slide.style.left = "";
            if (browser.transitions) {
              translate(pos, 0, 0);
            }
          }
          if (browser.addEventListener) {
            element.removeEventListener("touchstart", events, false);
            element.removeEventListener("webkitTransitionEnd", events, false);
            element.removeEventListener("msTransitionEnd", events, false);
            element.removeEventListener("oTransitionEnd", events, false);
            element.removeEventListener("otransitionend", events, false);
            element.removeEventListener("transitionend", events, false);
            window.removeEventListener("resize", events, false);
          } else {
            /** @type {null} */
            window.onresize = null;
          }
        }
      };
    }
  }
  require("zepto");
  if (window.jQuery || window.Zepto) {
    !function($) {
      /**
       * @param {EventTarget} options
       * @return {?}
       */
      $.fn.Swipe = function(options) {
        return this.each(function() {
          $(this).data("Swipe", new init($(this)[0], options));
        });
      };
    }(window.jQuery || window.Zepto);
  }
  /** @type {function (Element, Object): ?} */
  module.exports = init;
});
define("model", function(dataAndEvents, deepDataAndEvents, module) {
  var node = {};
  /**
   * @param {(Node|string)} key
   * @return {?}
   */
  module.exports = function(key) {
    var current = node;
    return key && (node[key] || (node[key] = {}), current = node[key]), current;
  };
});
define("header/index", function(require, dataAndEvents, module) {
  require("insert-css")(".index-header{background:#FFF;padding:0 0 .1rem}.index-header .search_bottom{border:1px solid #E3E3E3;margin:0 .2rem;height:.08rem;border-top:0}.index-header .search_bar{line-height:.34rem}.index-header .search_bar>a{display:block;padding:.2rem .3rem .12rem}.index-header .search_bar .text{font-size:.3rem;color:#9C9C9C}.index-header .search_bar .icon-search{font-size:.4rem;color:#CACACA;padding-right:.1rem}");
  var self = require("vue");
  module.exports = self.component("index-header", {
    className : "index-header",
    template : '<div class="search_bar"><a href="/1/#/search/index"><span class="icon icon-search"></span><span class="text">\u641c\u7d22\u5546\u54c1\u540d\u79f0</span></a></div><div class="search_bottom"></div>',
    data : {},
    /**
     * @return {undefined}
     */
    created : function() {
    },
    /**
     * @return {undefined}
     */
    ready : function() {
    }
  });
});
define("footer/default", function(require, dataAndEvents, module) {
  require("insert-css")(".footer{position:fixed;bottom:0;left:0;right:0;background:#FFF;z-index:99;border-top:1px solid #e0e0e0}.footer ul{display:box;display:-webkit-box;box-align:center;-webkit-box-align:center;box-pack:center;-webkit-box-pack:center}.footer .nav{padding-top:.5rem}.footer .nav.ih{background:url(/1/img/icon/icon_main_home_normal_4719ab5.png) 50% 0 no-repeat;-webkit-background-size:.4rem .4rem;-moz-background-size:.4rem .4rem;-ms-background-size:.4rem .4rem;-o-background-size:.4rem .4rem;background-size:.4rem .4rem}.footer .nav.ic{background:url(/1/img/icon/icon_main_category_normal_4abe64c.png) 50% 0 no-repeat;-webkit-background-size:.4rem .4rem;-moz-background-size:.4rem .4rem;-ms-background-size:.4rem .4rem;-o-background-size:.4rem .4rem;background-size:.4rem .4rem}.footer .nav.is{background:url(/1/img/icon/icon_main_mine_normal_5efb28b.png) 50% 0 no-repeat;-webkit-background-size:.4rem .4rem;-moz-background-size:.4rem .4rem;-ms-background-size:.4rem .4rem;-o-background-size:.4rem .4rem;background-size:.4rem .4rem}.footer .nav.if{background:url(/1/img/icon/icon_cart_normal_a4e5f62.png) 50% 0 no-repeat;-webkit-background-size:.44rem .44rem;-moz-background-size:.44rem .44rem;-ms-background-size:.44rem .44rem;-o-background-size:.44rem .44rem;background-size:.44rem .44rem}.footer .nav p{font-size:.22rem;line-height:.8;color:#999}.footer li{-webkit-box-flex:1;box-flex:1;width:100%;text-align:center}.footer li>a{display:block;padding:.12rem 0}.footer li>a.on .nav p{color:#FF5722}.footer li>a.on .nav.ih{background:url(/1/img/icon/icon_main_home_selected_69102c3.png) 50% 0 no-repeat;-webkit-background-size:.4rem .4rem;-moz-background-size:.4rem .4rem;-ms-background-size:.4rem .4rem;-o-background-size:.4rem .4rem;background-size:.4rem .4rem}.footer li>a.on .nav.ic{background:url(/1/img/icon/icon_main_category_selected_937ae30.png) 50% 0 no-repeat;-webkit-background-size:.4rem .4rem;-moz-background-size:.4rem .4rem;-ms-background-size:.4rem .4rem;-o-background-size:.4rem .4rem;background-size:.4rem .4rem}.footer li>a.on .nav.is{background:url(/1/img/icon/icon_main_mine_selected_133e821.png) 50% 0 no-repeat;-webkit-background-size:.4rem .4rem;-moz-background-size:.4rem .4rem;-ms-background-size:.4rem .4rem;-o-background-size:.4rem .4rem;background-size:.4rem .4rem}.footer li>a.on .nav.if{background:url(/1/img/icon/icon_cart_selected_4edd89d.png) 50% 0 no-repeat;-webkit-background-size:.44rem .44rem;-moz-background-size:.44rem .44rem;-ms-background-size:.44rem .44rem;-o-background-size:.44rem .44rem;background-size:.44rem .44rem}");
  var self = require("vue");
  require("lib/network.js");
  require("lib/app.js");
  module.exports = self.component("c-footer", {
    className : "footer",
    template : '<ul><li><a href="/1/#/index" v-class="on: bottomNav.home" data-event="30000000110001002"><div class="nav ih"><p>\u5546\u57ce</p></div></a></li><li><a href="/1/#/product/category" v-class="on: bottomNav.category" data-event="30000000110001003"><div class="nav ic"><p>\u5206\u7c7b</p></div></a></li><li><a href="/1/#/cart/index" v-class="on: bottomNav.cart" data-event="30000000110001006"><div class="nav if"><p>\u8d2d\u7269\u8f66</p></div></a></li><li><a href="/1/#/user/index" v-class="on: bottomNav.user" data-event="30000000110001005"><div class="nav is"><p>\u670d\u52a1</p></div></a></li></ul>',
    data : {},
    /**
     * @return {undefined}
     */
    ready : function() {
    }
  });
});
define("info/info", function(require, dataAndEvents, module) {
  require("insert-css")("#info{position:fixed;top:0;left:0;width:100%;text-align:center;height:100%}");
  var tref;
  var going;
  var scrollIntervalId;
  var Schema = require("vue");
  /** @type {(Element|null)} */
  var GET = document.body.querySelector("#info");
  module.exports = new Schema({
    template : '<div v-if="type == \'loading\'" class="global-loading"><div class="global-loading-logo"><div id="globalLoadingAnim" class="global-loading-anim"></div></div><div class="global-loading-text"><span v-show="!timeout">\u6b63\u5728\u52aa\u529b\u4e3a\u60a8\u52a0\u8f7d\u4e2d...</span><span v-show="timeout">\u7f51\u7edc\u4e0d\u7ed9\u529b\u554a\uff0c\u5df2\u7ecf\u8fc7\u53bb{{waitTime}}\u79d2\u949f<br>\u7ee7\u7eed\u7b49\u5f85\u6216<span v-on="tap: refresh" class="hot retry">\u5237\u65b0</span>\u91cd\u8bd5</span></div></div><div v-if="type == \'error\'" class="global-error"><div class="global-error-logo"></div><div class="global-error-text">\u7f51\u7edc\u4e0d\u7ed9\u529b\uff0c\u8bf7\u70b9\u51fb<span v-on="tap: refresh" class="retry">\u5237\u65b0</span>\u91cd\u8bd5</div></div>',
    data : {
      startTime : 0,
      nowTime : 0
    },
    computed : {
      /**
       * @return {?}
       */
      waitTime : function() {
        var spec = this;
        var max = spec.$data.nowTime || 0;
        var min = spec.$data.startTime || 0;
        return max ? parseInt((max - min) / 1E3) : 0;
      }
    },
    methods : {
      /**
       * @return {undefined}
       */
      onError : function() {
        location.reload(true);
      },
      /**
       * @param {Function} type
       * @return {undefined}
       */
      show : function(type) {
        var self = this;
        /** @type {Function} */
        self.$data.type = type;
        self.container = self.container || GET;
        if (!self.$el.parentNode) {
          clearTimeout(tref);
          clearTimeout(going);
          /** @type {number} */
          tref = setTimeout(function() {
            self.container.appendChild(self.$el);
            var $element = $(".global-loading-anim", self.$el);
            if (Spinner) {
              if ($element.length) {
                if (!$element.data("isSpin")) {
                  $element.data("isSpin", true);
                  (new Spinner).spin($element[0]);
                }
              }
            }
          }, 100);
          /** @type {boolean} */
          self.$data.timeout = false;
          /** @type {number} */
          self.$data.startTime = +new Date;
          /** @type {number} */
          going = setTimeout(function() {
            /** @type {boolean} */
            self.$data.timeout = true;
            self.startNowTime();
          }, 12E3);
        }
      },
      /**
       * @param {string} type
       * @param {?} e
       * @return {undefined}
       */
      hide : function(type, e) {
        var self = this;
        clearTimeout(tref);
        clearTimeout(going);
        clearInterval(scrollIntervalId);
        self.container = self.container || GET;
        if (self.$data.type === type) {
          if (self.$el.parentNode) {
            self.container.removeChild(self.$el);
          }
        }
        if (!e) {
          setTimeout(function() {
            window.scrollTo(0, 1);
          }, 100);
        }
      },
      /**
       * @return {undefined}
       */
      refresh : function() {
        location.reload(true);
      },
      /**
       * @return {undefined}
       */
      startNowTime : function() {
        var bindingContext = this;
        /** @type {number} */
        bindingContext.$data.nowTime = +new Date;
        clearInterval(scrollIntervalId);
        /** @type {number} */
        scrollIntervalId = setInterval(function() {
          /** @type {number} */
          bindingContext.$data.nowTime = +new Date;
        }, 1E3);
      }
    }
  });
});
define("lib/directives/lazy.js", function(require) {
  /**
   * @return {undefined}
   */
  function close() {
    if (!d) {
      /** @type {boolean} */
      d = true;
      window.addEventListener("scroll", focus);
      window.addEventListener("resize", focus);
    }
  }
  /**
   * @return {?}
   */
  function focus() {
    if (0 != children.length) {
      if (clearTimeout(tref), u > 3) {
        return u = 0, void show();
      }
      u++;
      /** @type {number} */
      tref = setTimeout(function() {
        /** @type {number} */
        u = 0;
        show();
      }, 150);
    }
  }
  /**
   * @return {undefined}
   */
  function show() {
    var item;
    /** @type {number} */
    var ix = 0;
    /** @type {boolean} */
    var i = (Math.max(document.body.scrollTop, window.scrollY), document.body.offsetHeight, true);
    for (;item = children[ix];) {
      if (i) {
        if (item.src) {
          if (item.src != item.el.src) {
            item.el.src = item.src;
          }
        }
        children.splice(0, 1);
      } else {
        ix++;
      }
    }
  }
  var tref;
  var _ = require("vue");
  /** @type {HTMLDocument} */
  var DOC = document;
  /** @type {Array} */
  var children = (DOC.body, []);
  /** @type {boolean} */
  var d = false;
  /** @type {number} */
  var u = 0;
  _.directive("lazy", {
    /**
     * @param {string} event
     * @return {undefined}
     */
    bind : function(event) {
      children.push({
        el : this.el,
        src : event
      });
      close();
      focus();
    },
    /**
     * @param {string} val
     * @return {undefined}
     */
    update : function(val) {
      children.push({
        el : this.el,
        src : val
      });
      focus();
    },
    /**
     * @return {undefined}
     */
    unbind : function() {
    }
  });
});
define("lib/filters/group.js", function(require) {
  var collection = require("vue");
  collection.filter("group", function(str, size) {
    if (!str) {
      return[];
    }
    /** @type {Array} */
    var colNames = [];
    /** @type {number} */
    size = parseInt(size, 10);
    /** @type {number} */
    var i = 0;
    var len = str.length;
    for (;len > i;i += size) {
      colNames.push(str.slice(i, i + size));
    }
    return colNames;
  });
});
define("lib/filters/money.js", function(require) {
  var nodes = require("vue");
  nodes.filter("money", function(val) {
    if (!val) {
      return "";
    }
    if (val += "", -1 == val.indexOf("\u5143")) {
      if (-1 == val.indexOf("-")) {
        if (val = Number(val.replace(/[^\d|\.]/gi, "")), isNaN(val)) {
          return "0";
        }
        /** @type {string} */
        val = val.toFixed(2);
      }
      val += "";
      /** @type {string} */
      val = val && (val.replace && val.replace(/\.00/g, "").replace(/(\.\d)0/, "$1"));
      val += "\u5143";
    }
    return val;
  });
});
define("lib/filters/tel.js", function(require) {
  var nodes = require("vue");
  nodes.filter("securityPhone", function(charsetPart) {
    return charsetPart.substring(0, 3) + "****" + charsetPart.substring(7);
  });
});
define("lib/filters/time.js", function(require) {
  var nodes = require("vue");
  nodes.filter("timeFormat", function(m1) {
    /** @type {Date} */
    var cd = new Date(1E3 * parseInt(m1));
    return cd.getFullYear() + "/" + (cd.getMonth() + 1 < 10 ? "0" + (cd.getMonth() + 1) : cd.getMonth() + 1) + "/" + (cd.getDate() < 10 ? "0" + cd.getDate() : cd.getDate()) + " " + (cd.getHours() < 10 ? "0" + cd.getHours() : cd.getHours()) + ":" + (cd.getMinutes() < 10 ? "0" + cd.getMinutes() : cd.getMinutes());
  });
});
define("lib/main.js", function(require) {
  var getActual = require("lib/routes.js");
  var App = require("vue");
  var $ = require("zepto");
  var ua = require("lib/stat.js");
  require("lib/directives/lazy.js");
  require("lib/filters/group.js");
  require("lib/filters/money.js");
  require("lib/filters/time.js");
  require("lib/filters/tel.js");
  getActual("*", function(root, param) {
    /** @type {string} */
    var id = "views/" + root + ".js";
    if (!(window.resourceMap && resourceMap.res[id])) {
      /** @type {string} */
      id = "views/info/notfound.js";
    }
    $(document).off("scroll");
    $(window).off("scroll");
    require.async(id, function(data) {
      var item = app.$options.components;
      if (item[root] || (item[root] = data), app.param = param, app.view == root) {
        var children = app.$compiler.children;
        if (children.length) {
          if (children[0].vm.load) {
            children[0].vm.load(param);
          }
        }
      } else {
        /** @type {string} */
        app.view = root;
      }
      ua.pv();
    });
  });
  window.app = new App({
    el : "#wrapper",
    components : {},
    data : {}
  });
  require("header/index");
  require("header/default");
  require("header/containCart");
  require("footer/default");
  require("share/index");
  require("views/index/index.js");
  require("views/info/notfound.js");
  var root = getActual();
  if (app.$options.components[root]) {
    app.view = root;
  }
  /** @type {(HTMLElement|null)} */
  var tabPage = document.getElementById("globalLoading");
  if (tabPage) {
    if (tabPage.parentNode) {
      tabPage.parentNode.removeChild(tabPage);
    }
  }
});
define("lib/network.js", function(require, dataAndEvents, mod) {
  var $ = require("zepto");
  var proxyProperty = (require("lib/envi.js"), require("cookie"));
  /** @type {string} */
  var body = window.debug || -1 != location.href.indexOf("debug") ? "/i/index.php/v1" : "http://m.mi.com/i/index.php/v1";
  /** @type {string} */
  var id = "180100031051";
  id = proxyProperty("client_id") || id;
  /**
   * @return {undefined}
   */
  var poll = function() {
    /** @type {string} */
    var queueHooks = "180100031051";
    /** @type {string} */
    var key = "/mshopapi/index.php/v1/authorize/sso?client_id=" + queueHooks;
    /** @type {string} */
    location.href = key + "&callback=" + encodeURIComponent(location.href);
  };
  /**
   * @param {string} src
   * @param {Object} options
   * @param {Function} callback
   * @return {?}
   */
  var ajax = function(src, options, callback) {
    var opts = {};
    if ($.isObject(src)) {
      /** @type {string} */
      opts = src;
      src = opts.url;
      options = opts.param;
    } else {
      if ($.isFunction(options)) {
        /** @type {Object} */
        callback = options;
        options = {};
      }
    }
    var root = opts.app_path || body;
    var success = opts.success;
    var beforeSend = opts.beforeSend;
    var fn = opts.error;
    /** @type {boolean} */
    var locale = (opts.cache || "", 0 == opts.isLogin ? false : true);
    success = success || function() {
    };
    beforeSend = beforeSend || function() {
    };
    fn = fn || function() {
    };
    callback = callback || function() {
    };
    var params = {
      type : "POST",
      url : root + src,
      data : $.extend({
        client_id : id
      }, options),
      dataType : "json",
      timeout : opts.timeout || 7E3,
      /**
       * @return {undefined}
       */
      beforeSend : function() {
        beforeSend();
      },
      /**
       * @param {string} res
       * @return {?}
       */
      success : function(res) {
        if (res && "ok" == res.result) {
          success(res);
        } else {
          if (locale && (res && (res.reason && res.reason.indexOf("access_token") >= 0))) {
            return void poll();
          }
          fn(res);
        }
        callback(res);
      },
      /**
       * @param {string} result
       * @return {undefined}
       */
      error : function(result) {
        fn();
        if (callback) {
          callback(result);
        }
      }
    };
    return $.ajax(params);
  };
  mod.exports = {
    /** @type {function (string, Object, Function): ?} */
    post : ajax,
    jsonp : $.ajaxJSONP,
    config : {
      app_path : body,
      client_id : id
    }
  };
});
define("lib/routes.js", function(dataAndEvents, deepDataAndEvents, module) {
  /**
   * @param {string} set
   * @param {string} expr
   * @return {?}
   */
  function matches(set, expr) {
    return expr ? void(old = expr) : checker();
  }
  /**
   * @return {?}
   */
  function checker() {
    var self = highlight(getHash());
    /** @type {string} */
    var destination = self.ac + "/" + self.op;
    /** @type {string} */
    var result = destination;
    return old(result, self), result;
  }
  /**
   * @param {string} url
   * @return {?}
   */
  function getHash(url) {
    return url = url || location.href, url.replace(/^[^#]*#?\/?(.*)\/?$/, "$1");
  }
  /**
   * @param {string} js
   * @return {?}
   */
  function highlight(js) {
    if ("#" == js[0]) {
      js = js.substr(1);
    }
    var segmentMatch = js.split("?");
    var path = segmentMatch[0] || "";
    var modules = segmentMatch[1] || "";
    var result = {};
    if (modules) {
      modules = modules.split("&");
      /** @type {number} */
      var i = 0;
      for (;i < modules.length;i++) {
        var both = modules[i].split("=");
        result[both[0]] = both[1];
      }
    }
    return path && ("/" == path[0] && (path = path.substr(1)), "/" == path[path.length - 1] && (path = path.substr(0, path.length - 1)), path = path ? path.split("/") : [], path[0] && (result.ac = path[0]), path[1] && (result.op = path[1]), result.paths = path), result.ac = result.ac || "index", result.op = result.op || "index", result;
  }
  /**
   * @return {undefined}
   */
  var old = function() {
  };
  window.addEventListener("hashchange", function() {
    checker();
  });
  /** @type {function (string, string): ?} */
  module.exports = matches;
});
define("lib/user.js", function(require, dataAndEvents, module) {
  /**
   * @param {string} value
   * @return {undefined}
   */
  function onSuccess(value) {
    if (collection.isApp() || (collection.isNewApp() || collection.isPadApp())) {
      if (!collection.trigger("login_callback", "_loginCallback")) {
        collection.trigger("login", null);
      }
    } else {
      /** @type {string} */
      var queueHooks = "180100031051";
      /** @type {string} */
      var key = "/mshopapi/index.php/v1/authorize/sso?client_id=" + queueHooks;
      value = value || location.href;
      /** @type {string} */
      location.href = key + "&callback=" + encodeURIComponent(value);
    }
  }
  /**
   * @return {undefined}
   */
  function logout() {
    /** @type {string} */
    var queueHooks = "180100031051";
    /** @type {string} */
    var key = "/mshopapi/index.php/v1/authorize/sso_logout?client_id=" + queueHooks;
    /** @type {string} */
    location.href = key + "&callback=" + encodeURIComponent(location.origin + location.pathname);
  }
  /**
   * @return {undefined}
   */
  function fn() {
    if (!d) {
      /** @type {boolean} */
      d = true;
      var userId;
      userId = getAttribute(getAttribute("cUserId") ? "cUserId" : "userId");
      c.userId = userId;
    }
  }
  /**
   * @return {?}
   */
  function access() {
    return fn(), c;
  }
  /**
   * @param {boolean} computed
   * @return {?}
   */
  function get(computed) {
    fn();
    var id = c.userId;
    return!id && (computed && onSuccess()), !!id;
  }
  /**
   * @param {number} userId
   * @return {undefined}
   */
  function disableScript(userId) {
    getAttribute("cUserId", userId, {
      path : "/",
      domain : ".mi.com"
    });
    /** @type {number} */
    c.userId = userId;
  }
  var getAttribute = (require("zepto"), require("cookie"));
  var c = require("model")("user");
  var collection = require("lib/app.js");
  require("lib/network.js");
  /**
   * @param {?} dataAndEvents
   * @return {undefined}
   */
  window._loginCallback = function(dataAndEvents) {
    if (dataAndEvents) {
      location.reload();
    } else {
      alert("\u4f60\u6ca1\u6709\u767b\u5f55\u6210\u529f\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5\uff01");
    }
  };
  /** @type {boolean} */
  var d = false;
  module.exports = {
    /** @type {function (): ?} */
    get : access,
    /** @type {function (boolean): ?} */
    isLogin : get,
    /** @type {function (string): undefined} */
    login : onSuccess,
    /** @type {function (): undefined} */
    logout : logout,
    /** @type {function (number): undefined} */
    setUserId : disableScript
  };
});
define("lib/app.js", function(dataAndEvents, deepDataAndEvents, module) {
  /**
   * @return {?}
   */
  function reset() {
    return "undefined" != typeof WE && -1 !== excludes.indexOf("xiaomi/shop/") ? true : false;
  }
  /**
   * @return {?}
   */
  function getData() {
    return "undefined" != typeof WE && -1 !== excludes.indexOf("xiaomi/miuibrowser/4.3/shop") ? true : false;
  }
  /**
   * @param {string} event
   * @return {undefined}
   */
  function stop(event) {
    if (getData() || reset()) {
      trigger("callTel", event);
    }
  }
  /**
   * @return {?}
   */
  function hasOwnProp() {
    return "undefined" == typeof WE_PAD ? false : true;
  }
  /**
   * @return {undefined}
   */
  function cbRequest() {
    trigger("hidetitlebar", "");
  }
  /**
   * @param {string} event
   * @param {string} data
   * @return {?}
   */
  function trigger(event, data) {
    try {
      var handle = window.WE || window.WE_PAD;
      if (handle && handle.trigger) {
        return "string" != typeof data && (data = JSON.stringify(data)), handle.trigger(event, data);
      }
    } catch (t) {
    }
    return false;
  }
  /** @type {string} */
  var excludes = navigator.userAgent.toLowerCase();
  module.exports = {
    /** @type {function (): ?} */
    isApp : reset,
    /** @type {function (): ?} */
    isNewApp : getData,
    /** @type {function (): ?} */
    isPadApp : hasOwnProp,
    /** @type {function (string, string): ?} */
    trigger : trigger,
    /** @type {function (string): undefined} */
    callTel : stop,
    /** @type {function (): undefined} */
    hidetitlebar : cbRequest
  };
});
define("lib/envi.js", function(dataAndEvents, deepDataAndEvents, module) {
  /** @type {string} */
  var ua = navigator.userAgent;
  var os = {};
  var browser = {};
  /** @type {boolean} */
  os.android = /android/i.test(ua);
  /** @type {(Array.<string>|null)} */
  var octalLiteral = ua.match(/MicroMessenger\/(\d)/);
  /** @type {number} */
  browser.weixin = octalLiteral ? parseInt(octalLiteral[1]) || 0 : 0;
  /** @type {number} */
  var stringSegmentStart = ua.indexOf("(") + 1;
  /** @type {string} */
  var uHostName = ua.substr(stringSegmentStart, ua.indexOf(")") - stringSegmentStart);
  /** @type {Array.<string>} */
  var models = (uHostName.split(";")[4] || "").split(" ");
  /** @type {string} */
  var agent = models.slice(0, models.length - 1).join("");
  /** @type {string} */
  os.mi = agent;
  module.exports = {
    os : os,
    browser : browser,
    ua : ua
  };
});
define("views/index/index.js", function(require, dataAndEvents, module) {
  require("insert-css")(".page-index{background:#FFF;padding-bottom:1rem}.page-index .mcells_auto_fill{background:#F5F5F5;padding:.1rem 0}.page-index .mcells_auto_fill .body{position:relative;overflow:hidden;margin:0 auto}.page-index .mcells_auto_fill .items{position:absolute}.page-index .mcells_auto_fill .items img{width:100%}.page-index .download{position:relative}.page-index .download a{display:block}.page-index .download a img{width:100%}.page-index .download .close{position:absolute;width:1rem;height:1rem;line-height:1rem;text-align:center;right:0;top:50%;margin-top:-.5rem}.page-index .download .close a{display:block}.page-index .download .close a img{width:30%}.page-index .banner{background:#5F646E;display:box;display:-webkit-box;position:relative;padding:0 1rem}.page-index .banner .bn1,.page-index .banner .bn2{-webkit-box-flex:1;box-flex:1;text-align:center;width:100%}.page-index .banner .bn1 a,.page-index .banner .bn2 a{display:block;color:rgba(255,255,255,.8);font-size:.2rem;padding:.14rem 0}.page-index .slider{height:3.6rem;background-color:#fff;overflow:hidden;position:relative}.page-index .slider .swipe-wrap{overflow:hidden;position:relative}.page-index .slider .swipe-wrap>div{float:left;position:relative;text-align:center;overflow:hidden}.page-index .slider .swipe-wrap>div a{display:block}.page-index .slider .swipe-wrap>div img{height:3.6rem;width:100%}.page-index .slider .swipe-nav{position:absolute;bottom:.01rem;text-align:center;width:100%}.page-index .slider .swipe-nav span{display:inline-block;width:.1rem;height:.1rem;margin:0 .1rem;-webkit-border-radius:.05rem;-moz-border-radius:.05rem;-ms-border-radius:.05rem;-o-border-radius:.05rem;border-radius:.05rem;background:#FFF;filter:alpha(Opacity=60);opacity:.6;box-shadow:0 0 1px #ccc}.page-index .slider .swipe-nav span.on{filter:alpha(Opacity=90);opacity:.9;background:#f8f8f8;box-shadow:0 0 2px #ccc}.page-index .list{-webkit-transform:translate3d(0,0,0)}.page-index .list .item{display:box;display:-webkit-box;box-align:center;-webkit-box-align:center;padding:.3rem 0;border-bottom:1px solid #F2F2F2}.page-index .list .section:last-child .item{border:0}.page-index .list .info{-webkit-box-flex:1;box-flex:1;width:100%;margin-right:.2rem}.page-index .list .img{width:2.54rem;height:1.45rem;position:relative}.page-index .list .img .ico{width:100%}.page-index .list .img .tag{position:absolute;width:1.2rem;height:1.2rem;bottom:0;left:.1rem;opacity:.9!important;z-index:2}.page-index .list .name{font-size:.3rem;color:#000;margin-bottom:.1rem}.page-index .list .brief{font-size:.26rem;line-height:.34rem;color:#969696;margin-bottom:.12rem}.page-index .list .price{font-size:.28rem;color:#FE4900}");
  var self = require("vue");
  var xhr = require("lib/network.js");
  var utils = require("lib/envi.js");
  var dialog = require("info/info");
  var $scope = require("lib/user.js");
  require("swipe");
  module.exports = self.extend({
    id : "home",
    attributes : {
      "data-log" : "\u9996\u9875"
    },
    className : "page-index",
    template : '<div v-if="banner" class="download"><a href="http://s1.mi.com/m/huodong/page/2013/0922/index.html"><img src="http://s1.mi.com/m/images/20151027/download.png" v-if="isAndroid"><img src="http://s1.mi.com/m/images/20151027/ios.png" v-if="!isAndroid"></a><div class="close"><a href="javascript:;" v-on="click: bannerClose"><img src="http://s1.mi.com/m/images/20151028/top-x.png"></a></div></div><div v-component="index-header" v-with="header"></div><div id="slider" v-if="gallery.length &gt; 0" class="slider"><div class="swipe-wrap"><div v-repeat="gallery" v-attr="data-event: action.log_code"><a v-attr="href: action.m_type + \'|\' + action.path | actionLink"><span class="imgurl"><img v-attr="src: img_url" v-on="load: galleryImgLoad"></span></a></div></div><div class="swipe-nav"><span v-repeat="gallery" v-class="on: $index==0">&nbsp;</span></div></div><div v-if="mcells_auto_fill.body" class="mcells_auto_fill"><div v-style="width: mcells_auto_fill.body.w/100 + \'rem\', height: mcells_auto_fill.body.h/100 + \'rem\'" class="body"><div v-repeat="mcells_auto_fill.body.items"><div v-style="width: w/100+\'rem\', height: h/100+\'rem\', left: x/100+\'rem\', top: y/100+\'rem\'" v-attr="data-event: action.log_code" v-on="click: gotoview(this)" class="items"><img v-attr="src: img_url"></div></div></div></div><div class="list"><div v-repeat="sections" class="section"><div v-repeat="body.items" v-on="click:gotoview(this)" data-event="{{action.log_code}}" class="item"><div class="img"><img v-attr="src: img_url" class="ico lazy"><img v-if="product_tag" v-attr="src: product_tag" class="tag lazy"></div><div class="info"><div class="name"><p v-text="product_name"></p></div><div class="brief"><p v-text="product_brief"></p></div><div class="price"><p v-text="product_price"></p></div></div></div></div></div><div v-component="c-footer" v-with="footer"></div>',
    data : {
      header : {
        isHome : true,
        isShowUser : true
      },
      bottomNav : {
        home : true
      },
      sections : [],
      gallery : [],
      mcells_auto_fill : {},
      banner : "1" === $.cookie("newM_banner2") ? false : true,
      isAndroid : utils.os.android
    },
    computed : {},
    /**
     * @return {undefined}
     */
    ready : function() {
      var self = this;
      dialog.show("loading");
      /** @type {Array} */
      self.gallery = [];
      this.requestDate(function(node) {
        if ("ok" != node.result) {
          var MSG_CLOSURE_CUSTOM_COLOR_INVALID_INPUT = node.description || "\u670d\u52a1\u5668\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\uff01";
          return void alert(MSG_CLOSURE_CUSTOM_COLOR_INVALID_INPUT);
        }
        $.each(node.data.gallery, function(dataAndEvents, walkers) {
          self.gallery.push(walkers);
        });
        self.sections = node.data.sections;
        self.mcells_auto_fill = node.data.mcells_auto_fill || {};
        dialog.hide("loading");
      });
    },
    methods : {
      /**
       * @return {undefined}
       */
      bannerClose : function() {
        var operetta = this;
        /** @type {boolean} */
        operetta.banner = false;
        $.cookie("newM_banner2", "1");
      },
      /**
       * @param {Function} successCallback
       * @return {undefined}
       */
      requestDate : function(successCallback) {
        xhr.post({
          url : "/home/index",
          cache : true,
          isLogin : false,
          /** @type {Function} */
          success : successCallback
        });
      },
      /**
       * @return {?}
       */
      galleryImgLoad : function() {
        var element = this;
        return element.isGalleryLoad ? false : (element.isGalleryLoad = 1, void $("#slider", element.el).Swipe({
          continuous : true,
          auto : 4E3,
          /**
           * @param {Function} index
           * @return {undefined}
           */
          transitionEnd : function(index) {
            var children = $(".swipe-nav", element.el).find("span");
            children.removeClass("on");
            children.eq(index % children.length).addClass("on");
          }
        }));
      },
      /**
       * @param {Object} req
       * @return {?}
       */
      gotoview : function(req) {
        var type = req.action.m_type;
        var root = req.action.path;
        /** @type {string} */
        var data = "";
        switch(type) {
          case "product":
            /** @type {string} */
            data = "/1/#/product/view?product_id=" + root;
            break;
          case "cateid":
            /** @type {string} */
            data = "/1/#/product/list?id=" + root;
            break;
          case "url":
            data = root;
            break;
          case "keyword":
            /** @type {string} */
            data = "/1/#/search/list?seachtext=" + root;
        }
        return req.action.login && !$scope.isLogin(false) ? void $scope.login(data) : void(location.href = data);
      }
    },
    filters : {
      /**
       * @param {string} selection
       * @return {?}
       */
      actionLink : function(selection) {
        var parameters = selection.split("|");
        return 2 == parameters.length ? {
          url : parameters[1],
          keyword : "/1/#/search/list?seachtext=" + encodeURIComponent(parameters[1]),
          product : "/1/#/product/view?product_id=" + parameters[1],
          cateid : "/1/#/product/list?id=" + parameters[1]
        }[parameters[0]] || "" : "";
      }
    }
  });
});
define("views/info/notfound.js", function(require, dataAndEvents, module) {
  var Node = require("vue");
  var result = require("views/info/index.js");
  /** @type {string} */
  result.data.type = "nofound";
  /** @type {string} */
  result.data.btn_type = "gohome";
  /** @type {string} */
  result.data.tip_text = "\u9875\u9762\u4e0d\u5b58\u5728";
  module.exports = Node.extend(result);
});
define("views/info/index.js", function(require, dataAndEvents, $) {
  require("insert-css")(".tips_view{text-align:center;position:absolute;top:50%;left:0;right:0;margin-top:-5.85em}.tips_view .tips_msg{padding:5em 0 2em}.tips_view .tips_msg h3{font-size:1.7em;color:#50555B;margin-bottom:.44118em}.tips_view .tips_btn{width:17em;margin:0 auto;padding:1.5em 0 3em}.tips_view .tips_btn a{color:#333}");
  $.exports = {
    className : "page-info",
    template : '<div v-component="c-header"></div><div class="tips_view mitu_02"><div class="tips_msg"><h3 v-text="tip_text"></h3></div></div>',
    data : {
      btn_type : "",
      tip_text : "\u7cfb\u7edf\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u518d\u5c1d\u8bd5\uff01"
    },
    methods : {},
    /**
     * @return {undefined}
     */
    ready : function() {
    }
  };
});
