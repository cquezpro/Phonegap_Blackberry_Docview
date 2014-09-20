/**
 * Created by Aria on 03.03.14.
 */
(function () {
    Object.keys || (Object.keys = function (a) {
        if (a != Object(a))throw"Object.keys called on non-object";
        var b = [], c;
        for (c in a)Object.prototype.hasOwnProperty.call(a, c) && b.push(c);
        return b
    });
    Array.prototype.forEach || (Array.prototype.forEach = function (a, b) {
        for (var c = this.length, d = 0; d < c; d += 1)a.call(b, this[d], d, this)
    });
    Array.prototype.some || (Array.prototype.some = function (a, b) {
        for (var c = this.length, d = 0; d < c; d += 1)if (a.call(b, this[d], d, this))return!0;
        return!1
    });
    Array.prototype.filter || (Array.prototype.filter =
        function (a, b) {
            var c = this.length, d, e;
            d = [];
            for (var f = 0; f < c; f += 1)e = this[f], a.call(b, e, f, this) && d.push(e);
            return d
        });
    Array.prototype.map || (Array.prototype.map = function (a, b) {
        for (var c = [], d = 0; d < this.length; d++)c.push(a.call(b, this[d]));
        return c
    });
    Array.prototype.indexOf || (Array.prototype.indexOf = function (a) {
        var b, c;
        c = 0;
        for (b = this.length; c < b; c += 1)if (this[c] === a)return c;
        return-1
    });
    Function.prototype.bind || (Function.prototype.bind = function (a) {
        if ("function" !== typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        var b = Array.prototype.slice.call(arguments, 1), c = this, d = function () {
        }, e = function () {
            return c.apply(a, b.concat(Array.prototype.slice.call(arguments)))
        };
        d.prototype = this.prototype;
        e.prototype = new d;
        return e
    });
    Date.now || (Date.now = function () {
        return(new Date).getTime()
    });
    window.console || (window.console = {});
    "log dir error info time timeEnd profile profileEnd trace table group groupCollapsed groupEnd timeStamp".split(" ").forEach(function (a) {
        this.console[a] || (this.console[a] = this.fn)
    }, {console: window.console,
        fn: function () {
        }});
    window.JSON || (window.JSON = {}, window.JSON.parse = function (a) {
        return(new Function("return (" + a + ");")).call()
    }, window.JSON.__scope = null, window.JSON.equalObj = function (a) {
        return this == a
    }, window.JSON.inScope = function (a) {
        return this.__scope.some(this.equalObj, a)
    }, window.JSON.__reComma = /"/g, window.JSON.__lineComma = '\\"', window.JSON.BAD_TYPE_MAP = {undefined: !0, "function": !0}, window.JSON._stringify = function (a) {
        var b = typeof a, c = "";
        if (void 0 === a || null == a || "function" == b)c = "null"; else if ("string" ==
            b)c = '"' + a.replace(this.__reComma, this.__lineComma) + '"'; else {
            if (a instanceof Array) {
                for (var b = [], d = 0; d < a.length; d++)b.push(this._stringify(a[d]));
                return"[" + b.join(",") + "]"
            }
            if (a instanceof Object) {
                if (this.inScope(a))throw"JSON.stringify :: Converting circular structure to JSON (cyclic link)";
                this.__scope.push(a);
                b = [];
                for (d in a)typeof a[d]in this.BAD_TYPE_MAP || b.push(['"', d, '":', this._stringify(a[d])].join(""));
                c = "{" + b.join(",") + "}";
                this.__scope.pop(a)
            } else return String(a)
        }
        return c
    }, window.JSON.stringify =
        function (a) {
            this.__scope = [];
            a = this._stringify(a);
            this.__scope = null;
            return a
        })
})();
function fn_noop() {
}
function if_fn(a) {
    "function" == typeof a && a.apply(null, _slice(arguments, 1))
}
var _hop = function (a, b) {
    return a.hasOwnProperty(b)
}, _toString = function (a) {
    return Object.prototype.toString.call(a)
}, _slice = function (a, b, c) {
    return Array.prototype.slice.call(a, b, c)
}, _decodeURIComponent = function (a) {
    var b;
    try {
        for (; b = decodeURIComponent(a), b != a;)a = b
    } catch (c) {
    }
    return a
};
Date.ts2time = function (a) {
    var b = parseInt(a / 3600), c = parseInt(a / 60 - 60 * b);
    a = parseInt(a - 3600 * b - 60 * c);
    var d = [], b = 10 > b ? "0" + b : b, d = [10 > c ? "0" + c : c, 10 > a ? "0" + a : a];
    "00" != b && d.unshift(b);
    return d.join(":")
};
Date.time2ts = function (a) {
    var b = 0;
    a && (a = a.split(":").map(function (a) {
        return parseInt(a, 10)
    }), 3 == a.length ? (b += 3600 * a[0], b += 60 * a[1], b += a[2]) : 2 == a.length ? (b += 60 * a[0], b += a[1]) : 1 == a.length && (b += a[0]), b *= 1E3);
    return b
};
var __extends = function (a, b) {
    function c() {
    }

    c.prototype = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.superclass = b.prototype
}, __extCall = function (a, b) {
    b.call(a)
}, parseTemplate = function (a, b) {
    return a.replace(/(\{([A-Za-z0-9_]+)\})/gm, function (a, d, e, f, g) {
        return b.hasOwnProperty(e) ? b[e] : ""
    })
};
function box2box(a, b, c, d) {
    return a / b < c / d
}
function CTicker(a, b) {
    this.intervlaId;
    this.fn;
    this.interval = 1E3;
    this.init(a, b)
}
__extCall(CTicker.prototype, function () {
    this.init = function (a, b) {
        b && (this.interval = b);
        a && (this.fn = a);
        return this
    };
    this.tick = function () {
        this.fn();
        return this
    };
    this.on = function (a) {
        null == this.intervalId && (!0 == a && this.fn(), this.intervalId = setInterval(this.fn, this.interval))
    };
    this.off = function () {
        null != this.intervalId && clearInterval(this.intervalId);
        this.intervalId = null
    }
});
var url = {domain: function (a) {
    return a.split("?")[0]
}, params: function (a) {
    a = a.slice(a.indexOf("?") + 1).split("&");
    for (var b, c = {}, d = 0; d < a.length; d++)b = a[d].split(/(^[^=]*)=/), b.shift(), c[b[0]] = b[1];
    return c
}}, DOM = {loadScript: function (a, b, c, d) {
    var e = document.createElement("script");
    b = b || document.getElementsByTagName("head")[0];
    e.setAttribute("type", "text/javascript");
    e.setAttribute("src", a);
    e.onload = c;
    e.onerror = d;
    b.appendChild(e)
}, loadStyle: function (a) {
    var b = document.getElementsByTagName("head")[0], c = document.createElement("link");
    c.setAttribute("type", "text/css");
    c.setAttribute("href", a);
    c.setAttribute("rel", "stylesheet");
    c.setAttribute("media", "all");
    b.appendChild(c)
}, newImage: function (a, b) {
    var c = new Image;
    c.onload = b;
    c.src = a;
    return c
}, on: function () {
    return window.addEventListener ? function (a, b, c, d) {
        a.addEventListener(b, c, d)
    } : function (a, b, c, d) {
        a.attachEvent("on" + b, c)
    }
}(), inFullScreen: function () {
    return document.webkitIsFullScreen || document.mozFullScreen || document.fullscreen
}, toggleFullScreen: function () {
    var a = !1, b = document.documentElement;
    this.inFullScreen() && (a = !0);
    a ? document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen() : b.requestFullscreen ? b.requestFullscreen() : b.mozRequestFullScreen ? b.mozRequestFullScreen() : b.webkitRequestFullScreen && b.webkitRequestFullScreen();
    return a
}}, BOM = {isMSIE: function () {
    return/msie/i.test(navigator.userAgent)
}, isKHTML: function () {
    return/KHTML/i.test(navigator.userAgent)
}, android: function () {
},
    isIMobile: function () {
        return/iPhone|iPad|iPod/i.test(navigator.userAgent)
    }, blackberry: function () {
        return/BlackBerry/i.test(navigator.userAgent)
    }, windows: function () {
        return/IEMobile/i.test(navigator.userAgent)
    }, browser: function () {
        var a = {state: {webkit: !1, mozilla: !1, msie: !1, opera: !1, safari: !1}, tag: null, init: function () {
            var b, c, d;
            b = navigator.userAgent;
            b = b.toLowerCase();
            c = /(chrome)[ \/]([\w.]+)/.exec(b) || /(webkit)[ \/]([\w.]+)/.exec(b) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b) || /(msie) ([\w.]+)/i.exec(b) ||
                0 > b.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b) || [];
            b = c[1] || "";
            c = c[2] || "0";
            d = {};
            b && (d[b] = !0, d.version = c);
            d.chrome ? d.webkit = !0 : a.webkit && (d.safari = !0);
            this.state.webkit = d.webkit || !1;
            this.state.mozilla = d.mozilla || !1;
            this.state.msie = d.msie || !1;
            this.state.safari = d.safari || !1;
            this.state.opera = d.opera || !1;
            for (var e in this.state)this.state[e] && (this.tag = e);
            this.version = d.version
        }, is: function (a) {
            return this.state[a]
        }};
        a.init();
        return a
    }()}, SocNet = function () {
    var a = function () {
    };
    a.TAG = {facebook: {link: "http://facebook.com/share.php?u={link}"},
        vkontakte: {link: "http://vk.com/share.php?url={link}"}, twitter: {link: "https://twitter.com/share?url={link}"}, ok: {link: "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl={link}"}, myworld: {link: "http://connect.mail.ru/share?url={link}"}};
    a.sharePage = function (a) {
        this.shareLink(a, window.location.href)
    };
    a.shareLink = function (a, c) {
        var d = this.TAG[a];
        null != d && (d = parseTemplate(d.link, {link: encodeURIComponent(c)}), window.open(d, "shareWindow", "height=500,width=900", !1))
    };
    return a
}(), CXPath = function (a) {
    this.doc =
        a
};
__extCall(CXPath.prototype, function () {
    this.evaluate = function (a) {
        var b = new XPathEvaluator, c = b.createNSResolver(null == this.doc.ownerDocument ? this.doc.documentElement : this.doc.ownerDocument.documentElement);
        a = b.evaluate(a, this.doc, c, 0, null);
        for (b = []; c = a.iterateNext();)b.push(c);
        return b
    };
    this.nodeVal = function (a) {
        return(a = this.evaluate(a)[0]) && a.nodeValue
    };
    this.exist = function (a) {
        return 1 <= this.evaluate(a).length
    };
    this.text = function (a) {
        return this.nodeVal(a + "/text()")
    };
    this.attr = function (a, b) {
        return this.evaluate(a)[0].attributes[b].nodeValue
    }
});
var CVAST = function () {
    function a(a) {
        this.xpath;
        this.setData(a.data);
        this.onMultibanner = a.onMultibanner;
        this.onStep = a.onStep;
        this.onError = a.onError
    }

    a.re_img = /^image/;
    a.re_video = /^video/;
    a.re_app = /^application/;
    __extCall(a.prototype, function () {
        this.setData = function (a) {
            this.xpath = new CXPath(a)
        };
        this.prepare_url = function (a) {
            return a.replace(/http:\/\/.*\.adriver\.ru/, "")
        };
        this.load = function (a) {
            a = this.prepare_url(a);
            a = {url: a, method: "get", dataType: "xml", success: function (a) {
                this.setData(a);
                this.isMultibanner() ?
                    (a = this.getMultibanner(), if_fn(this.onMultibanner, a), this.load(a.url)) : if_fn(this.onStep, this)
            }.bind(this), statusCode: {204: function () {
                console.warn("CODE: 204")
            }, 302: function () {
                console.warn("CODE: 302")
            }, 404: function () {
                console.warn("CODE: 404")
            }}};
            this.onError && (a.error = this.onError.bind(this));
            return $.ajax(a)
        };
        this._root = function () {
            return this.xpath.exist("//root")
        };
        this._nobanner = function () {
            return this.xpath.exist("//nobanner")
        };
        this.isMultibanner = function () {
            return this.xpath.exist("//multibanner")
        };
        this._extension_wrap = function () {
            return this.xpath.evaluate('//VAST/Ad/InLine/Extensions/Extension[@type="wrap"]')
        };
        this.getMultibanner = function () {
            var a = {};
            a.url = this.xpath.text("//multibanner/item/ar_comppath") + this.xpath.text("//multibanner/item/ar_name");
            NaN + Date.now();
            a.adid = this.xpath.text("//multibanner/item/ar_adid");
            a.bid = this.xpath.text("//multibanner/item/ar_bid");
            a.slice_id = this.xpath.text("//multibanner/item/ar_sliceid");
            return a
        };
        this.metaInfo = function () {
            var a = this.xpath.text("//VAST/Ad/InLine/Creatives/Creative/Linear/Duration"),
                c = {Ad_id: this.xpath.attr("//VAST/Ad", "id"), AdSystem: this.xpath.text("//VAST/Ad/InLine/AdSystem"), AdTitle: this.xpath.text("//VAST/Ad/InLine/AdTitle")};
            a && (c.Duration = Date.time2ts(a), a.split(":"));
            return c
        };
        this.clickThrough = function () {
            return this.xpath.evaluate("//VAST/Ad/InLine/Creatives/Creative/Linear/VideoClicks/ClickThrough")[0].firstChild.nodeValue
        };
        this.impression = function () {
            return this.xpath.evaluate("//VAST/Ad/InLine/Impression")[0].firstChild.nodeValue
        };
        this.trackingEvents = function () {
            var a =
            {};
            this.xpath.evaluate("//VAST/Ad/InLine/Creatives/Creative/Linear/TrackingEvents/Tracking").forEach(function (a) {
                this[a.attributes.event.nodeValue] = a.firstChild.nodeValue
            }, a);
            return a
        };
        this.extensions = function () {
            var a = {skipTime: null, skipTime2: null, linkTxt: null, isClickable: null, skipAd: null, addClick: null};
            this.xpath.evaluate("//VAST/Ad/InLine/Extensions/Extension").forEach(function (a) {
                this[a.attributes.type.nodeValue] = a.firstChild.nodeValue
            }, a);
            a.isClickable = "1" == a.isClickable;
            a.skipTime && (a.skipTime =
                Date.time2ts(a.skipTime));
            a.skipTime2 && (a.skipTime2 = Date.time2ts(a.skipTime2));
            return a
        };
        this.getMediaFiles = function () {
            var b = this.xpath.evaluate("//VAST/Ad/InLine/Creatives/Creative/Linear/MediaFiles/MediaFile"), c = {}, d;
            c.exist = 0 < b.length;
            c.exist && (d = b[0].attributes, c.file = {url: b[0].firstChild.nextSibling.nodeValue, type: d.type.nodeValue, width: d.width.nodeValue || void 0, height: d.height.nodeValue || void 0, scalable: !0 === d.scalable.nodeValue}, a.re_img.test(c.file.type) ? c.file.isImage = !0 : a.re_video.test(c.file.type) ?
                c.file.isVideo = !0 : a.re_app.test(c.file.type) && (c.file.isApplication = !0));
            return c
        };
        this.getInfo = function () {
            var a = {};
            a._meta = this.metaInfo();
            a.mediaFile = this.getMediaFiles();
            a.mediaFile.exist && (a.clickThrough = this.clickThrough(), a.impression = this.impression(), a.trackingEvents = this.trackingEvents(), a.extension = this.extensions());
            return a
        }
    });
    window["\u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0442\u0435\u043b\u044c_\u0443\u0437\u043e\u0432"] = {"\u0434\u0430\u0439_\u0443\u0437\u043b\u044b": function () {
        console.log("\u0431\u0435\u0440\u0438 \u0436\u0435 \u0441\u043a\u043e\u0440\u0435\u0439")
    }};
    return a
}();
var tvigle = tvigle || {};
tvigle.api = {modules: {APIModules: {}}, data: {}, events: {}, getPlayer: function (a) {
    if (null == tvigle.internal._instances[a]) {
        var b;
        b = "Player '" + a + "' not found for Tvigle Smart Player API. Please ensure the name is correct and the API for the player is enabled. If the embedded player is Flash, the Smart Player API will not be available if APIModules_all.js or TviglePlayers_all.js have been included";
        b += " on your page. In that case, the legacy JavaScript Player API must be used and the player should be retrieved using a call to tvigle.getPlayer().";
        console.log(b)
    }
    return tvigle.internal._instances[a]
}};
tvigle.internal = {_instances: {}, _modules: {}, _handlers: {}, _ID_DELIM: "|||", _setAPICallback: function (a, b, c) {
    tvigle.internal._instances[a] = new tvigle.api.TviglePlayer(b, a, c);
    tvigle.internal._instances[a].type === tvigle.playerType.FLASH && (b = tvigle.playerObjects[a], tvigle.callHandlerForPlayer(b, "templateLoadHandler", a), tvigle.callHandlerForPlayer(b, "templateReadyHandler", a))
}, _convertDates: function (a) {
    a && (a.media ? a.media = tvigle.internal._convertDates(a.media) : (a.publishedDate && (a.publishedDate = new Date(parseInt(a.publishedDate,
        10))), a.startDate && (a.startDate = new Date(parseInt(a.startDate, 10))), a.endDate && (a.endDate = new Date(parseInt(a.endDate, 10)))));
    return a
}, _stringify: function (a) {
    var b = typeof a;
    if ("function" == b || void 0 == a)return null;
    if ("string" == b)return'"' + a.replace(/"/g, '\\"') + '"';
    if (a instanceof Array) {
        var b = "[", c;
        for (c in a)b = "function" == typeof a[c] ? b + "null," : b + (tvigle.internal._stringify(a[c]) + ",");
        "," == b.substr(-1) && (b = b.substr(0, b.length - 1));
        return b + "]"
    }
    if ("object" == b) {
        var b = "{", d = a.enumerableProperties;
        if (d)for (c in d)b +=
            '"' + d[c] + '":' + tvigle.internal._stringify(a[d[c]]) + ","; else for (c in a)"function" != typeof a[c] && "__proto__" != c && (b += '"' + c + '":' + tvigle.internal._stringify(a[c]) + ",");
        "," == b.substr(-1) && (b = b.substr(0, b.length - 1));
        return b + "}"
    }
    return a
}};
tvigle.api.events.MediaEvent = {BEGIN: "begin", CHANGE: "change", COMPLETE: "complete", ERROR: "error", PLAY: "play", PROGRESS: "progress", STOP: "stop", SEEK_NOTIFY: "on_seek"};
tvigle.api.events.CuePointEvent = {CUE: "cuePoint"};
tvigle.api.modules.APIModule = function () {
    this._handlers = [];
    this._name = "APIModule"
};
tvigle.api.modules.APIModule._handlerCount = 0;
tvigle.api.modules.APIModule._getUniqueHandlerName = function () {
    return"tv_handler" + tvigle.api.modules.APIModule._handlerCount++
};
tvigle.api.modules.APIModule._getAsyncGetterHandler = function (a) {
    var b = tvigle.api.modules.APIModule._getUniqueHandlerName();
    tvigle.internal._handlers[b] = function (c) {
        a(c);
        delete tvigle.internal._handlers[b]
    };
    return b
};
tvigle.api.modules.APIModule.prototype._dispatchEvent = function (a) {
    a.target = this;
    for (var b = this._handlers.length, c = [], d, e = 0; e < b; e++)d = this._handlers[e], d.event == a.type && c.push({handler: d.handler, priority: d.priority});
    c.sort(function (a, b) {
        return b.priority - a.priority
    });
    b = c.length;
    for (e = 0; e < b; e++)c[e].handler(a)
};
tvigle.api.modules.APIModule.prototype._addEventListener = function (a, b, c) {
    void 0 == c && (c = 0);
    var d = tvigle.api.modules.APIModule._getUniqueHandlerName();
    this._handlers.push({handler: b, bcHandler: d, event: a, priority: c});
    var e = this;
    tvigle.internal._handlers[d] = function (a) {
        a.target = e;
        return b(a)
    };
    if (this.player.type == tvigle.playerType.FLASH) {
        if (this.player._playerURL) {
            this._callMethod("addEventListener", ["event", a, d, c]);
            return
        }
        d = "tvigle.internal._handlers." + d
    }
    this._callMethod("addEventListener", [a, d, c])
};
tvigle.api.modules.APIModule.prototype._removeEventListener = function (a, b) {
    for (var c = this._handlers.length, d = 0; d < c; d++)if (this._handlers[d].event == a && this._handlers[d].handler == b) {
        var e = this._handlers[d].bcHandler;
        this._handlers.splice(d, 1);
        delete tvigle.internal._handlers[e];
        break
    }
    if (void 0 != e) {
        if (this.player.type == tvigle.playerType.FLASH) {
            if (this.player._playerURL) {
                this._callMethod("removeEventListener", ["event", a, e]);
                return
            }
            e = "tvigle.internal._handlers." + e
        }
        this._callMethod("removeEventListener",
            [a, e])
    }
};
tvigle.api.modules.APIModule.prototype.addEventListener = function (a, b, c) {
    this.removeEventListener(a, b);
    this._addEventListener(a, b, c)
};
tvigle.api.modules.APIModule.prototype.removeEventListener = function (a, b) {
    this._removeEventListener(a, b)
};
tvigle.api.modules.APIModule.prototype._callPlayer = function (a, b) {
    return this.player.type == tvigle.playerType.HTML ? this._callHTML(b) : this._callFlash(a, b)
};
tvigle.api.modules.APIModule.prototype._callMethod = function (a, b) {
    for (var c = [], d = 0; d < b.length; d++)c.push(b[d]);
    return this._callPlayer(this.player._callback, {module: this._name, method: a, params: c})
};
tvigle.api.modules.APIModule.prototype._callFlash = function (a, b) {
};
tvigle.api.modules.APIModule.prototype._callHTML = function (a) {
    if (!this.player._callback.postMessage)return null;
    if (null != window.Prototype && null != Prototype.Version) {
        var b = Prototype.Version.split("."), c = parseInt(b[0], 10), b = parseInt(b[1], 10);
        1 == c && 7 > b && !tvigle.internal._prototypeMessageSent && (tvigle.internal._prototypeMessageSent = !0, c = "An older version of prototype.js is being used on this page, preventing successful communication with the Tvigle player. The Tvigle player supports the use of version 1.7 or higher of the Prototype library.",
            console.log(c))
    }
    (a = window.JSON.stringify(a)) && this.player._callback.postMessage(a, this.player._playerURL);
    return null
};
(function () {
    tvigle.api.modules.APIModule.prototype._callAsync = function (a, b, c) {
        var d;
        d = tvigle.api.modules.APIModule._getAsyncGetterHandler(c || fn_noop);
        var e = Array.prototype.forEach.call(arguments, 3);
        if (this.player.type == tvigle.playerType.HTML)return d = {object: this._name, method: b, callback: d, arguments: e}, this._callHTML(d);
        this.player._playerURL ? e.unshift("getterAsync", d) : e.unshift("tvigle.internal._handlers." + d);
        d = {module: this._name, method: a, params: e};
        return this._callFlash(this.player._callback, d)
    }
})();
tvigle.api.modules.APIModule.prototype._callGetterMethod = function (a, b) {
    if (b.length && "function" == typeof b[0]) {
        var c = b.shift(), d;
        if (this.player.type == tvigle.playerType.FLASH)if (this.player._playerURL)d = tvigle.api.modules.APIModule._getAsyncGetterHandler(c), b.unshift(d), b.unshift("getter"), this._callMethod(a, b); else {
            var e = this._callMethod(a, b);
            setTimeout(function () {
                c(e)
            }, 1)
        } else d = tvigle.api.modules.APIModule._getAsyncGetterHandler(c), b.unshift(d), this._callMethod(a + "Async", b)
    } else throw"getter call must include callback function";
};
tvigle.api.TviglePlayer = function (a, b, c) {
    this.id = b;
    null == a ? (this.type = tvigle.playerType.HTML, this._playerURL = c, tvigle.players[this.id] && (this._callback = tvigle.players[this.id].contentWindow)) : (this.type = tvigle.playerType.FLASH, this._callback = a, c && (this._playerURL = c));
    this._modules = {}
};
tvigle.api.TviglePlayer.prototype.getModule = function (a) {
    if (null == this._modules[a] && tvigle.internal._modules[a]) {
        var b = new tvigle.internal._modules[a](this);
        b._playerURL = this._playerURL;
        this._modules[a] = b
    }
    return this._modules[a]
};
tvigle.api.modules.APIModules.PLAYER = "player";
tvigle.api.modules.PlayerModule = function (a) {
    this.player = a;
    this._name = tvigle.api.modules.APIModules.PLAYER
};
tvigle.api.modules.PlayerModule.prototype = new tvigle.api.modules.APIModule;
tvigle.api.modules.PlayerModule.prototype.getPlayerID = function (a) {
    var b = this;
    return null == a ? this._id : this._callGetterMethod("getPlayerID", [function (c) {
        b._id = c;
        a(c)
    }])
};
tvigle.api.modules.PlayerModule.prototype.getReady = function (a) {
    return this._callGetterMethod("getReady", [a])
};
tvigle.api.modules.PlayerModule.prototype.setSize = function (a, b) {
    return this._callAsync("setSizeWithCallback", "setSize", void 0, a, b)
};
tvigle.internal._modules[tvigle.api.modules.APIModules.PLAYER] = tvigle.api.modules.PlayerModule;
tvigle.api.modules.APIModules.VIDEO_PLAYER = "videoPlayer";
tvigle.api.modules.VideoPlayerModule = function (a) {
    this.player = a;
    this._name = tvigle.api.modules.APIModules.VIDEO_PLAYER;
    var b = this;
    this.addEventListener(tvigle.api.events.MediaEvent.BEGIN, function (a) {
        b._canPlayWithoutUserInteraction = !0
    }, 0);
    this._canPlayWithoutUserInteraction = !tvigle.isSupportedHTMLDevice();
    this._handlerWrappers = []
};
tvigle.api.modules.VideoPlayerModule.prototype = new tvigle.api.modules.APIModule;
__extCall(tvigle.api.modules.VideoPlayerModule.prototype, function () {
    this.addEventListener = function (a, b, c) {
        this.removeEventListener(a, b);
        var d;
        a == tvigle.api.events.CuePointEvent.CUE && (d = function (a) {
            a.cuePoint = new tvigle.api.data.CuePoint(a.cuePoint);
            b(a)
        }, this._handlerWrappers.push({event: a, handler: b, wrapper: d}));
        this._addEventListener(a, d || b, c)
    };
    this.removeEventListener = function (a, b) {
        if (a == tvigle.api.events.CuePointEvent.CUE)for (var c, d = this._handlerWrappers.length, e = 0; e < d; e++)if (this._handlerWrappers[e].event ==
            a && this._handlerWrappers[e].handler == b) {
            c = this._handlerWrappers[e].wrapper;
            this._handlerWrappers.splice(e, 1);
            break
        }
        this._removeEventListener(a, c || b)
    };
    this.getCurrentVideo = function (a) {
        return this._callGetterMethod("getCurrentVideo", [a])
    };
    this.getCurrentRendition = function (a) {
        return this._callGetterMethod("getCurrentRendition", [a])
    };
    this.loadVideoById = function (a) {
        return this._callMethod("loadVideoById", [a])
    };
    this.setNextVideo = function (a) {
        return this._callMethod("setNextVideo", [a])
    };
    this.loadVideoByReferenceID =
        function (a) {
            return this._callMethod("loadVideoByReferenceID", [a])
        };
    this.play = function () {
        if (this.canPlayWithoutInteraction())return this._callMethod("play", [])
    };
    this.stop = function () {
        if (this.canPlayWithoutInteraction())return this._callMethod("stop", [])
    };
    this.next = function (a) {
        if (this.canPlayWithoutInteraction())return this._callMethod("next", [a])
    };
    this.prev = function (a) {
        if (this.canPlayWithoutInteraction())return this._callMethod("prev", [a])
    };
    this.setVolume = function (a) {
        if (this.canPlayWithoutInteraction())return this._callMethod("setVolume",
            [a])
    };
    this.getVolume = function (a) {
        return this._callGetterMethod("getVolume", [a])
    };
    this.getDuration = function (a) {
        return this._callGetterMethod("getDuration", [a])
    };
    this.getVideoQueue = function (a) {
        return this._callGetterMethod("getVideoQueue", [a])
    };
    this.getCurrentVideo = function (a) {
        return this._callGetterMethod("getCurrentVideo", [a])
    };
    this.getPosition = function (a) {
        return this._callGetterMethod("getPosition", [a])
    };
    this.isPlaying = function (a) {
        return this._callGetterMethod("isPlaying", [a])
    };
    this.isPaused = function (a) {
        return this._callGetterMethod("isPaused",
            [a])
    };
    this.isStopped = function (a) {
        return this._callGetterMethod("isStopped", [a])
    };
    this.isReady = function (a) {
        return this._callGetterMethod("isReady", [a])
    };
    this.getState = function (a) {
        return this._callGetterMethod("getState", [a])
    };
    this.isFullscreen = function (a) {
        return this._callGetterMethod("isFullscreen", [a])
    };
    this.setQuality = function (a) {
        if (this.canPlayWithoutInteraction())return this._callMethod("setQuality", [a])
    };
    this.fullscreen = function () {
        if (this.canPlayWithoutInteraction())return this._callMethod("fullscreen",
            [])
    };
    this.pause = function () {
        return this._callMethod("pause", [])
    };
    this.seek = function (a) {
        return this._callMethod("seek", [a])
    };
    this.getVideoPosition = function (a, b) {
        "function" == typeof a && (b = a, a = !1);
        return this._callGetterMethod("getVideoPosition", [b, a])
    };
    this.getVideoDuration = function (a, b) {
        "function" == typeof a && (b = a, a = !1);
        return this._callGetterMethod("getVideoDuration", [b, a])
    };
    this.getIsPlaying = function (a) {
        return this._callGetterMethod("getIsPlaying", [a])
    };
    this.canPlayWithoutInteraction = function () {
        return this._canPlayWithoutUserInteraction
    };
    this.cueVideoByID = function (a) {
        return this._callMethod("cueVideoByID", [a])
    };
    this.cueVideoByReferenceID = function (a) {
        return this._callMethod("cueVideoByReferenceID", [a])
    };
    this.getPrivacyMode = function (a) {
        return this._callGetterMethod("getPrivacyMode", [a])
    };
    this.setPrivacyMode = function (a) {
        return this._callMethod("setPrivacyMode", [a])
    }
});
tvigle.internal._modules[tvigle.api.modules.APIModules.VIDEO_PLAYER] = tvigle.api.modules.VideoPlayerModule;
if (tvigle._queuedAPICalls && tvigle._queuedAPICalls.length)for (; tvigle._queuedAPICalls.length;)tvigle.handleAPICallForHTML(tvigle._queuedAPICalls.shift());
tvigle = tvigle || {};
(function () {
    var a = function (a, c) {
        var d = a.split(tvigle.internal._ID_DELIM);
        if (!(2 > d.length || 1 > d[0].length)) {
            d = document.getElementById(d[0]);
            if ("getter" === c.params[0]) {
                c.params.shift();
                var e = c.params[0];
                c.params.shift()
            } else e = c.params[1];
            var f = d[c.method].apply(d, c.params);
            "undefined" !== typeof tvigle.internal._handlers[e] && tvigle.internal._handlers[e].apply(d, [f])
        }
    };
    tvigle && tvigle.api && tvigle.api.modules && tvigle.api.modules.APIModule ? tvigle.api.modules.APIModule.prototype._callFlash = a : tvigle._callFlash =
        a
})();
