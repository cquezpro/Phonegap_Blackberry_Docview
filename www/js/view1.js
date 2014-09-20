/**
 * Created by Aria on 11.02.14.
 */

var dataFile;
var zipAlias;

function localWebOdf(viewerElement, documentUrl)
{
    zipAlias = zip;
    dataArray=  documentUrl;
    OdfCanvas = viewerElement;

    OdfCanvas.addListener('statereadychange', function () {
        var extension = FILE_PATH.split('.').pop();
        console.log(extension);
        var winW = screen.width * window.devicePixelRatio;
        odfCanvas.fitToWidth(winW);
        var fileName = FILE_PATH.split('/').pop();
        divTitle.setCaption(fileName);
        if (extension === 'odp') {
            //odfCanvas.fit();
            var viewerControl = document.getElementById('canvas');
            var swipeleft = Hammer(viewerControl).on("swipeleft", function(event) {
                next();
            });


            var swiperight = Hammer(viewerControl).on("swiperight", function(event) {
                 prev();
            });

            odfCanvas.showFirstPage();
        }
       // self.onLoad();
    });

    loadFromArrayBuffer(viewerElement, dataArray);
}

function loadFromArrayBuffer(odfcanvas, data1) {
// overload the global read function with one that only reads<br>
    // the data from this canvas<br>
    var globalreadfunction = runtime.read,
        globalfilesizefunction = runtime.getFileSize,
        overridePath = "odf://arraybuffer";
    runtime.read = function (path, offset, length, callback) {
        if (path !== overridePath) {
            globalreadfunction.apply(runtime,
                [path, offset, length, callback]);
        } else {
            callback(null, data.slice(offset, offset + length));
        }
    };
    runtime.getFileSize = function (path, callback) {
        if (path !== overridePath) {
            globalfilesizefunction.apply(runtime, [path, callback]);
        } else {
            callback(data.byteLength);
        }
    };

    core.Zip = function (h, g) {
        "use strict";
        // remove 'odf:' prefix
        h = h.substr(4);
        var zip = this,
            window = runtime.getWindow();
        this.load = function (filename, callback) {
            alert("load");
        };


        function m(a, c) {
            var b, e, d, l, k, g, m, h = this;
            this.load = function (c) {
                if (null !== h.data)c(null, h.data); else {
                    var b = k + 34 + e + d + 256;
                    b + m > f && (b = f - m);
                    runtime.read(a, m, b, function (b, f) {
                        if (b || null === f)c(b, f); else a:{
                            var e = f, d = new core.ByteArray(e), m = d.readUInt32LE(), y;
                            if (67324752 !== m)c("File entry signature is wrong." + m.toString() + " " + e.length.toString(), null); else {
                                d.pos += 22;
                                m = d.readUInt16LE();
                                y = d.readUInt16LE();
                                d.pos += m + y;
                                if (l) {
                                    e =
                                        e.subarray(d.pos, d.pos + k);
                                    if (k !== e.length) {
                                        c("The amount of compressed bytes read was " + e.length.toString() + " instead of " + k.toString() + " for " + h.filename + " in " + a + ".", null);
                                        break a
                                    }
                                    e = C(e, g)
                                } else e = e.subarray(d.pos, d.pos + g);
                                g !== e.length ? c("The amount of bytes read was " + e.length.toString() + " instead of " + g.toString() + " for " + h.filename + " in " + a + ".", null) : (h.data = e, c(null, e))
                            }
                        }
                    })
                }
            };
            this.set = function (a, c, b, f) {
                h.filename = a;
                h.data = c;
                h.compressed = b;
                h.date = f
            };
            this.error = null;
            c && (b = c.readUInt32LE(), 33639248 !==
                b ? this.error = "Central directory entry has wrong signature at position " + (c.pos - 4).toString() + ' for file "' + a + '": ' + c.data.length.toString() : (c.pos += 6, l = c.readUInt16LE(), this.date = p(c.readUInt32LE()), c.readUInt32LE(), k = c.readUInt32LE(), g = c.readUInt32LE(), e = c.readUInt16LE(), d = c.readUInt16LE(), b = c.readUInt16LE(), c.pos += 8, m = c.readUInt32LE(), this.filename = runtime.byteArrayToString(c.data.subarray(c.pos, c.pos + e), "utf8"), this.data = null, c.pos += e + d + b))
        }



        this.loadAsString = function (filename, callback) {
            var callbackname = 'callback' + String(Math.random()).substring(2);
            window[callbackname] = function (err, string) {
                window[callbackname] = undefined;
                callback(err, string);
            };

            var blob = new Blob([data1]);
            zipAlias.createReader(new zipAlias.BlobReader(blob), function (reader) {

                // get all entries from the zip
                reader.getEntries(function (entries) {
                    // В консоли появятся все внутренности архива Excel
                    for (var index = 0; index < entries.length; index++) {
                        console.log(entries[index].filename);
                        if (entries[index].filename == filename) {

                            entries[index].getData(new zipAlias.TextWriter(), function (text) {
                                // text contains the entry data as a String
                                console.log(text);
                                callback(null, text);
                                // close the zip reader
                                reader.close(function () {
                                    // onclose callback
                                });

                            }, function (current, total) {
                                // onprogress callback
                            });


                        }
                    }
                    return false;
                });
            }, function (error) {
                alert(error);
            });
            // window.zipreader.loadAsString(url, filename, callbackname);
        };
        this.loadAsDataURL = function (filename, mimetype, callback) {

            var callbackname = 'callback' + String(Math.random()).substring(2);
            window[callbackname] = function (err, dataurl) {
                window[callbackname] = undefined;
                callback(err, dataurl);
            };

            var blob = new Blob([data1]);
            zipAlias.createReader(new zipAlias.BlobReader(blob), function (reader) {

                // get all entries from the zip
                reader.getEntries(function (entries) {
                    // В консоли появятся все внутренности архива Excel
                    for (var index = 0; index < entries.length; index++) {
                        console.log(entries[index].filename);
                        if (entries[index].filename == filename) {

                            entries[index].getData(new zipAlias.Data64URIWriter(), function (text) {
                                // text contains the entry data as a String
                                console.log(text);
                                callback(null, text);
                                // close the zip reader
                                reader.close(function () {
                                    // onclose callback
                                });

                            }, function (current, total) {
                                // onprogress callback
                            });


                        }
                    }
                    return false;
                });
            }, function (error) {
                alert(error);
            });
        };
        this.loadAsDOM = function (filename, callback) {
            zip.loadAsString(filename, function (err, xmldata) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var parser = new DOMParser();
                xmldata = parser.parseFromString(xmldata, "text/xml");
                callback(null, xmldata);
            });
        };
        this.getEntries = function () {
            return l.slice();
        };
        this.loadContentXmlAsFragments = function (filename, handler) {
            alert("loadContentXmlAsFragments");
        };

        function e(a, c) {
            if (a === l.length)c(null); else {
                var b = l[a];
                null !== b.data ? e(a + 1, c) : b.load(function (b) {
                    b ? c(b) : e(a + 1, c)
                })
            }
        }

        function r(a) {
            var c = new core.ByteArrayWriter("utf8"), f = 0;
            c.appendArray([80, 75, 3, 4, 20, 0, 0, 0, 0, 0]);
            a.data && (f = a.data.length);
            c.appendUInt32LE(q(a.date));
            c.appendUInt32LE(a.data ? b(a.data) : 0);
            c.appendUInt32LE(f);
            c.appendUInt32LE(f);
            c.appendUInt16LE(a.filename.length);
            c.appendUInt16LE(0);
            c.appendString(a.filename);
            a.data && c.appendByteArray(a.data);
            return c
        }

        function k(a, c) {
            var f = new core.ByteArrayWriter("utf8"), e = 0;
            f.appendArray([80, 75, 1, 2, 20, 0, 20, 0, 0, 0, 0, 0]);
            a.data && (e = a.data.length);
            f.appendUInt32LE(q(a.date));
            f.appendUInt32LE(a.data ? b(a.data) : 0);
            f.appendUInt32LE(e);
            f.appendUInt32LE(e);
            f.appendUInt16LE(a.filename.length);
            f.appendArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            f.appendUInt32LE(c);
            f.appendString(a.filename);
            return f
        }

        function q(a) {
            var c = a.getFullYear();
            return 1980 > c ? 0 : c - 1980 <<
                25 | a.getMonth() + 1 << 21 | a.getDate() << 16 | a.getHours() << 11 | a.getMinutes() << 5 | a.getSeconds() >> 1
        }

        function b(a) {
            var c = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728,
                853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202,
                4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804,
                225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542,
                2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035,
                2932959818, 3654703836, 1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117], b, f, e = a.length, d = 0, d = 0;
            b = -1;
            for (f = 0; f < e; f += 1)d = (b ^ a[f]) & 255, d = c[d], b = b >>> 8 ^ d;
            return b ^ -1
        }


        function c(a, c) {
            e(0, function (b) {
                if (b)c(b); else {
                    var f, e, d = new core.ByteArrayWriter("utf8"), g = [0];
                    for (f = 0; f < l.length; f += 1)d.appendByteArrayWriter(r(l[f])), g.push(d.getLength());
                    b = d.getLength();
                    for (f = 0; f < l.length; f += 1)e = l[f], d.appendByteArrayWriter(k(e, g[f]));
                    f = d.getLength() - b;
                    d.appendArray([80, 75, 5, 6, 0, 0, 0, 0]);
                    d.appendUInt16LE(l.length);
                    d.appendUInt16LE(l.length);
                    d.appendUInt32LE(f);
                    d.appendUInt32LE(b);
                    d.appendArray([0, 0]);
                    a(d.getByteArray())
                }
            })
        }

        this.createByteArray =
            c;

        var  l = [], f, s, C = (new core.RawInflate).inflate, x = this, w = new core.Base64;
        this.save = function (a, c, b, f) {
            var e, d;
            for (e = 0; e < l.length; e += 1)if (d = l[e], d.filename === a) {
                d.set(a, c, b, f);
                return
            }
            d = new m(h);
            d.set(a, c, b, f);
            l.push(d)
        };
        this.write = function () {
            alert("write");
        };
        g(null, zip);
    };


    odfcanvas.load(overridePath);
}
