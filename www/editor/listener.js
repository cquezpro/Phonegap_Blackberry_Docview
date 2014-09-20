/**
 * Created by Aria on 04.03.14.
 */

var dataFile;
var file1;
function ReadFile()
{
    var data;
    if (window.File && window.FileReader && window.FileList && window.Blob) {

        var fileControl = document.getElementById('fileInput');

        var reader = new FileReader();
        reader.onloadend = (function (theFile) {
            return function (e) {
                if (e.target.readyState == FileReader.DONE) {

                    dataFile = e.target.result;

             //     webodfEditor.loadFromBuffer(file1.name,dataFile);
                   // webodfEditor.boot();
                 webodfEditor.loadFromBuffer(file1.name,dataFile);
                }
            };
        })(fileControl.files[0]);
        file1 = fileControl.files[0];
        reader.readAsArrayBuffer(fileControl.files[0]);


    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}
