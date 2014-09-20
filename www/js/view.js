/**
 * Created by Aria on 05.02.14.
 */
var dataFile;
var zipAlias;
function ReadFile()
{
    var data;
if (window.File && window.FileReader && window.FileList && window.Blob) {

    var fileControl = document.getElementById('files1');

    var reader = new FileReader();
    reader.onloadend = (function (theFile) {
        return function (e) {
            if (e.target.readyState == FileReader.DONE) {

                dataFile = e.target.result;
                var odfElement = document.getElementById('canvas');
                var odfCanvas = new odf.OdfCanvas(odfElement);


                localWebOdf(odfCanvas,this.result);
            }
        };
    })(fileControl.files[0]);
    file1 = fileControl.files[0];
    reader.readAsArrayBuffer(fileControl.files[0]);


} else {
    alert('The File APIs are not fully supported in this browser.');
}

    function localWebOdf(viewerElement, documentUrl)
    {
        zipAlias = zip;
        dataArray=  documentUrl;
        OdfCanvas = canvas;
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

        core.Zip = function (url, entriesReadCallback) {
            "use strict";
            // remove 'odf:' prefix
            url = url.substr(4);
            var zip = this,
                window = runtime.getWindow();
            this.load = function (filename, callback) {
                alert("load");
            };
            this.loadAsString = function (filename, callback) {
                var callbackname = 'callback' + String(Math.random()).substring(2);
                window[callbackname] = function (err, string) {
                    window[callbackname] = undefined;
                    callback(err, string);
                };

                var blob = new Blob([data]);
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

                var blob = new Blob([data]);
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
                alert("getEntries");
            };
            this.loadContentXmlAsFragments = function (filename, handler) {
                alert("loadContentXmlAsFragments");
            };
            this.save = function () {
                alert("save");
            };
            this.write = function () {
                alert("write");
            };
            entriesReadCallback(null, zip);
        };


        odfcanvas.load(overridePath);
    }

}