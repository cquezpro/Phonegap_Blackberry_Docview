/**
 * Created by Aria on 06.04.14.
 */

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
var FILE_SYSTEM = '';
var dataArrayForRead;
var odfCanvas;
var divTitle;
var app = {
    // Application Constructor
    initialize: function () {
        config = {controlsDark: true,
            listsDark: true};

        config.onscreenready = function (element, id, param) {

            if(id=='editor')
            {
                //  location.reload(true);
                //  if(editorInstanceGlobal  == null)
                // {
                webodfEditor.boot();
                //}

                var actionBarHeight = bb.screen.getActionBarHeight();

                var winW = screen.width * window.devicePixelRatio;
                var winH = screen.height * window.devicePixelRatio;

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

        this.bindEvents();
        bb.init(config);
        FILE_PATH = getUrlParameters("path","",true);
        console.log(FILE_PATH);

        bb.pushScreen('editor/editor.html', 'editor',{filePath: FILE_PATH});

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        console.log('ddds');
        document.addEventListener("invoked", function(invocationInfo) {
            console.log("Handler start . . .");
            //alert('Handler start . . .');
            if (invocationInfo.target) {
                //  alert(invocationInfo.target);
            }
            if (invocationInfo.type) {
                //  alert(invocationInfo.type);

            }

            if(invocationInfo.uri)
            {
                var temp1 = invocationInfo.uri.replace('file://','');
                temp1 = temp1.replace('%20',' ');
                // alert('source:' + temp1);
                // console.log(invocationInfo.uri);

                addRecent(temp1);
                bb.pushScreen('viewer.html','viewer', {filePath: temp1});
            }

            if (invocationInfo.action) {
                // alert(invocationInfo.action);
            }
            if (invocationInfo.data) {
                /// alert(invocationInfo.data);
            }
        });
        console.log('onDeviceReady');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /*  var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');

         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');
         */
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

function getUrlParameters(parameter, staticURL, decode){
    /*
     Function: getUrlParameters
     Description: Get the value of URL parameters either from
     current URL or static URL
     Author: Tirumal
     URL: www.code-tricks.com
     */
    var currLocation = (staticURL.length)? staticURL : window.location.search,
        parArr = currLocation.split("?")[1].split("&"),
        returnBool = true;

    for(var i = 0; i < parArr.length; i++){
        parr = parArr[i].split("=");
        if(parr[0] == parameter){
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        }else{
            returnBool = false;
        }
    }

    if(!returnBool) return false;
}