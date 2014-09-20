/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var FILE_PATH = '';
var FILE_SIZE = '';
var FILE_SYSTEM = '';
var dataArrayForRead;
var odfCanvas;
var divTitle;
var makeCopy = false;
var isInvokedFile = false;
var fileHasBeenDeleted = false;

var app = {
    // Application Constructor
    initialize: function () {

          this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
       // alert('111');
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
      //  alert('222');

        console.log('ddds');
        document.addEventListener("invoked", function(invocationInfo) {
            console.log("Handler start . . .");
           // alert('Handler start . . .');
            if (invocationInfo.target) {
              //  alert(invocationInfo.target);
            }
            if (invocationInfo.type) {
              //  alert(invocationInfo.type);

            }

            if(invocationInfo.uri)
            {
                var temp1 = invocationInfo.uri.replace('file://','');
                //temp1 = temp1.replace('%20',' ');
                console.log(temp1);
                temp1 = decodeURI(temp1);
                console.log(temp1);
               // alert('source:' + temp1);
               // console.log(invocationInfo.uri);
               
                addRecent(temp1);
                isInvokedFile = true;
                bb.pushScreen('viewer.html','viewer', {filePath: temp1});
            }

            if (invocationInfo.action) {
               // alert(invocationInfo.action);
            }
            if (invocationInfo.data) {
               /// alert(invocationInfo.data);
            }
        });

        config = {controlsDark: true,

           // highlightColor: '#ff0000',
            listsDark: true};

        config.onscreenready = function (element, id, param) {
            if (id == 'viewer') {
                var actionBarHeight = bb.screen.getActionBarHeight();

                var winW = screen.width * window.devicePixelRatio;
                var winH = screen.height * window.devicePixelRatio;

                localizationViewer(element);

                var viewerControl = element.getElementById('canvas');

                divTitle = element.getElementById('dvTitle');

                viewerControl.style.width = winW + 'px';
                viewerControl.style.height = (winH - actionBarHeight) + 'px';

                var pinchin = Hammer(viewerControl).on("pinchin", function(event) {
                    //alert('pinchin!'); //less
                    ab_ZoomOut();
                });

                var pinchout = Hammer(viewerControl).on("pinchout", function(event) {
                    // alert('pinchout!'); //more

                    ab_zoomIm();
                });


                var doubletap = Hammer(viewerControl).on("doubletap",function(event)
                    {
                        an_autoscale();
                    }
                );

                if (param != null) {
                    var name = '';
                    if(param.filePath[0].length>1)
                    {
                        name = param.filePath[0].split('.').pop();
                        // FILE_PATH = blackberry.io.SDCard + '/downloads/noname.odt';
                        FILE_PATH = param.filePath[0];
                        //FILE_PATH = encodeURI(FILE_PATH);
                    }
                    else
                    {
                        name = param.filePath.split('.').pop();
                        // FILE_PATH = blackberry.io.SDCard + '/downloads/noname.odt';
                        FILE_PATH = param.filePath;
                        //FILE_PATH = encodeURI(FILE_PATH);
                    }

                    console.log(FILE_PATH);

                    blackberry.io.sandbox = false;
                    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

                    window.requestFileSystem(window.PERSISTENT, 1024 * 1024, function (fs) {
                        //  alert(FILE_PATH);
                        fs.root.getFile(FILE_PATH, {create: false}, function (entry) {
                            //alert('2');
                            entry.file(function (file) {
                                    var reader = new FileReader();

                                    reader.onloadend = function (e) {
                                        //alert(this.result);
                                        if(this.result != null)
                                        {
                                           var odfElement = document.getElementById('canvas');
                                           odfCanvas = new odf.OdfCanvas(odfElement);
                                           dataArrayForRead = this.result;
                                           FILE_SIZE = dataArrayForRead.byteLength;
                                           addRecent(FILE_PATH);
                                           console.log('buffer length: ' + dataArrayForRead.byteLength);
                                          // var uInt8Array = new Uint8Array(dataArrayForRead);
                                        /* for (var i = 0; i < 20; ++i) {
                                            console.log('count ' + i +' = ' + uInt8Array[i]);
                                        }*/
                                           currentPage = 1;
                                           localWebOdf(odfCanvas,dataArrayForRead);
                                        }
                                    };

                                    reader.onerror = function(e){
                                       var tempdirectory = blackberry.io.sharedFolder + '/documents';
                                        fs.root.getDirectory(tempdirectory,{ create: false},
                                            function(parent) {
                                                console.log("Parent Name: " + parent.name);
                                                var filecopy = 'myofficetemp' + FILE_PATH.split('.').pop();
                                                entry.copyTo(parent, filecopy,
                                                    function(entry1) {
                                                        console.log("New Path: " + entry1.fullPath);
                                                        entry1.file(function(file1)
                                                        {
                                                            var reader1 = new FileReader();
                                                            reader1.onloadend = function (e) {
                                                                //alert(this.result);
                                                                var odfElement = document.getElementById('canvas');
                                                                odfCanvas = new odf.OdfCanvas(odfElement);
                                                                dataArrayForRead = this.result;
                                                                FILE_SIZE = dataArrayForRead.byteLength;
                                                                addRecent(FILE_PATH);
                                                                console.log('buffer length: ' + dataArrayForRead.byteLength);
                                                               // var uInt8Array = new Uint8Array(dataArrayForRead);
                                                              /*  for (var i = 0; i < 20; ++i) {
                                                                    console.log('count ' + i +' = ' + uInt8Array[i]);
                                                                }*/
                                                                currentPage = 1;
                                                                localWebOdf(odfCanvas,dataArrayForRead);

                                                                entry1.remove(
                                                                    function(entry2)
                                                                    {
                                                                       console.log('remove success');
                                                                    },
                                                                    function(error2)
                                                                    {
                                                                       console.log('remove error');
                                                                    }
                                                                );
                                                            };

                                                            reader1.onerror = function(e){
                                                                alert(FILE_PATH);
                                                                alert(e.target.error.code);
                                                            };

                                                            reader1.readAsArrayBuffer(file1);
                                                        },
                                                        function (error1) {
                                                            alert('4');
                                                        }
                                                        );

                                                    },
                                                    function(error) {
                                                        alert(error.code);
                                                    });
                                            },
                                            function(error)
                                            {
                                                alert(error.code);
                                            });
                                    };
                                  // var blob = file.slice(0,file.size);

                                  //  alert(blob.size);
                                   reader.readAsArrayBuffer(file);
                                }, function (error) {
                                    alert('4');
                                }
                            );


                        }, function (error) {
                          //  alert(FILE_PATH.split('/').pop());
                            console.log('error getting file');
                            console.log(error);
                            var msg = '';

                            switch (error.code) {
                                case FileError.QUOTA_EXCEEDED_ERR:
                                    msg = 'QUOTA_EXCEEDED_ERR';
                                    break;
                                case FileError.NOT_FOUND_ERR:
                                    msg = 'NOT_FOUND_ERR';
                                    break;
                                case FileError.SECURITY_ERR:
                                    msg = 'SECURITY_ERR';
                                    break;
                                case FileError.INVALID_MODIFICATION_ERR:
                                    msg = 'INVALID_MODIFICATION_ERR';
                                    break;
                                case FileError.INVALID_STATE_ERR:
                                    msg = 'INVALID_STATE_ERR';
                                    break;
                                case FileError.NO_MODIFICATION_ALLOWED_ERR:
                                    msg = 'NO_MODIFICATION_ALLOWED_ERR';
                                    break;
                                default:
                                    msg = 'File Error';
                                    break;
                            }
                            ;

                            if(error.code == FileError.NOT_FOUND_ERR)
                            {
                                deleteRowPath(FILE_PATH);
                                fileHasBeenDeleted = true;
                                bb.pushScreen('recent.html', 'recent');
                            }
                            else
                            {
                               alert(msg);
                            }
                           // alert(error);
                        })
                    })


                }
            }

            if(id=='recent')
            {
                console.log('recent');

                //addRecent('/accounts/1000/shared/documents/noname.odt');
                displayMessages();

                localizationRecent(element);

            }

            if(id=='about')
            {
                console.log('about');

                localizationAbout(element);
            }


            if(id=='settings')
            {
                if(window.localStorage)
                {
                    var itemindex = window.localStorage.getItem('theme');
                    if(itemindex!=null)
                    {
                        if(itemindex == 0)
                        {
                            var background = element.getElementById('myTitleBar');
                            if(background!=null)
                            {
                                background.style.background = "#ffffff";
                            }

                            var tit = element.getElementById('themeDiv');
                            if(tit!=null)
                            {
                                tit.style.color="#000000";
                            }
                        }
                        else
                        {
                            var background = element.getElementById('myTitleBar');
                            if(background!=null)
                            {
                                background.style.background = "#000000";
                            }

                            var tit = element.getElementById('themeDiv');
                            if(tit!=null)
                            {
                                tit.style.color="#ffffff";
                            }
                        }
                    }
                    else
                    {
                        var background = element.getElementById('myTitleBar');
                        if(background!=null)
                        {
                            background.style.background = "#ffffff";
                        }

                        var tit = element.getElementById('themeDiv');
                        if(tit!=null)
                        {
                            tit.style.color="#000000";
                        }
                    }
                }

                localizationSettings(element);
            }

            if(id=='editor')
            {
                webodfEditor.boot();

                var actionBarHeight = bb.screen.getActionBarHeight();

                var winW = screen.width * window.devicePixelRatio;
                var winH = screen.height * window.devicePixelRatio;
                localizationEditor(element);
                var viewerControl = element.getElementById('canvas');

                viewerControl.style.width = winW + 'px';
                viewerControl.style.height = (winH - actionBarHeight) + 'px';

                if (param != null) {
                    var name = param.filePath.split('.').pop();
                    // FILE_PATH = blackberry.io.SDCard + '/downloads/noname.odt';
                    FILE_PATH = param.filePath;
                    console.log(FILE_PATH);
                    blackberry.io.sandbox = false;
                    //  window.  = window.requestFileSystem || window.webkitRequestFileSystem;
                    window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 1024 * 1024, function (fs) {
                        alert(FILE_PATH);
                        fs.root.getFile(FILE_PATH, null, function (entry) {
                            //alert('2');
                            entry.file(function (file) {
                                    var reader = new FileReader();

                                    reader.onloadend = function (e) {
                                        //alert(this.result);
                                        var odfElement = document.getElementById('canvas');
                                        odfCanvas = new odf.OdfCanvas(odfElement);
                                        dataArrayForRead = this.result;

                                        webodfEditor.loadFromBuffer(name,dataArrayForRead);
                                    };

                                    reader.readAsArrayBuffer(file);
                                }, function (error) {
                                    alert('4');
                                }
                            );


                        }, function (error) {
                            console.log('error getting file');
                            console.log(error);
                            var msg = '';

                            switch (error.code) {
                                case FileError.QUOTA_EXCEEDED_ERR:
                                    msg = 'QUOTA_EXCEEDED_ERR';
                                    break;
                                case FileError.NOT_FOUND_ERR:
                                    msg = 'NOT_FOUND_ERR';
                                    break;
                                case FileError.SECURITY_ERR:
                                    msg = 'SECURITY_ERR';
                                    break;
                                case FileError.INVALID_MODIFICATION_ERR:
                                    msg = 'INVALID_MODIFICATION_ERR';
                                    break;
                                case FileError.INVALID_STATE_ERR:
                                    msg = 'INVALID_STATE_ERR';
                                    break;
                                case FileError.NO_MODIFICATION_ALLOWED_ERR:
                                    msg = 'NO_MODIFICATION_ALLOWED_ERR';
                                    break;
                                default:
                                    msg = 'File Error';
                                    break;
                            }
                            ;

                            alert('Error: ' + msg);
                            alert(error);
                        })
                    })


                }
            }
        }

        config.ondomready = function(element, id, params) {
            console.log('ondomready');
            //  appInit.localizeContent();
            if(id=='recent')
            {
                document.getElementById('sortType').hide();
                document.getElementById('sortAsc').hide();
               // document.getElementById('controlPanel').hide();
                if(window.localStorage)
                {
                    var itemindex = window.localStorage.getItem('tab');
                    isauto = true;
                    if(itemindex!=null)
                    {
                        var idTb = 'tab' + itemindex;
                        var actionTab = document.getElementById(idTb);
                        document.getElementById('actionBarDv').setSelectedTab(actionTab);
                    }
                    else
                    {
                        var actionTab = document.getElementById('tab0');
                        document.getElementById('actionBarDv').setSelectedTab(actionTab);
                    }

                    if(itemindex == 4)
                    {
                        element.getElementById('cb1').setChecked(false);

                        var exts1 = window.localStorage.getItem('exts').split(',');
                        for (index1 = 0; index1 < exts1.length; ++index1) {
                            var temp = (exts1[index1]);
                            var idCb = 'cb' + temp;
                            var elem = element.getElementById(idCb);
                            if(elem!=null)
                            {
                                elem.setChecked(true);
                            }
                        }

                    }
                }

                isshow = false;

                if(fileHasBeenDeleted == true)
                {
                    fileHasBeenDeleted = false;
                    var lang = blackberry.system.language;
                    lang = lang.substr(0,2);
                    var locale = languages[lang] || languages['en'];

                    var delmessage = locale['deletefile'];

                    //alert(delmessage);
                    jAlert(delmessage, 'OK');
                }
            }

            if(id=='settings')
            {
               var themeControl = element.getElementById('themeSelect');
               if(themeControl != null)
               {
                  load_theme(themeControl);
               }
            }
        };
     //  alert('333');
        bb.init(config);
       if(isInvokedFile == false)
       {
        bb.pushScreen('recent.html', 'recent');
       }
        else
       {
           isInvokedFile = false;
       }
      //  alert('444');
        //appInit.doReady();
        console.log('onDeviceReady');
        app.receivedEvent('deviceready');
        navigator.splashscreen.hide();
    },
   // Update DOM on a Received Event
    receivedEvent: function (id) {

        console.log('Received Event: ' + id);
    }
};

function gotFS(fileSystem) {
    alert("2");
    FILE_SYSTEM = fileSystem;
    fileSystem.root.getFile(FILE_PATH, null, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    //alert("3");
    //fileEntry.file(gotFile, fail);
    var newDir = FILE_SYSTEM.fullPath;
    alert(newDir);
    console.log(newDir);
    fileEntry.copyTo(newDir, "file.copy", success, fail);
}

function success(entry) {
    if (entry != null) {
        alert("4");
    }
    else {
        alert("5");
    }
    console.log("New Path: " + entry.fullPath);
}

function fail(error) {
    alert("8");
    console.log(error.code);
}