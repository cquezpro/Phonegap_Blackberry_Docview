/**
 * Created by Aria on 18.01.14.
 */
var currentPage;
function ab_open_click()
{
    alert('You clicked Open');
}

function ab_edit_click()
{

    bb.pushScreen('editor/editor.html','editor', {filePath: FILE_PATH});
}

function ab_zoomIm()
{
    if(odfCanvas!=null)
    {
        var currentZoom =     OdfCanvas.getZoomLevel();
        OdfCanvas.setZoomLevel(currentZoom+0.01);
    }
}

function an_autoscale()
{
    if(odfCanvas!=null)
    {
        var currentZoom =     OdfCanvas.getZoomLevel();
        OdfCanvas.setZoomLevel(1.5);
    }
}

function ab_ZoomOut()
{
    if(odfCanvas!=null)
    {
        var currentZoom =     OdfCanvas.getZoomLevel();
        OdfCanvas.setZoomLevel(currentZoom-0.01);
    }
}

function ab_settings_click()
{
    if(odfCanvas!=null)
    {
        var currentZoom =     OdfCanvas.getZoomLevel();
        OdfCanvas.setZoomLevel(currentZoom-0.1);
    }
}

function ab_close_click()
{

    bb.pushScreen('recent.html','recent');
}

function ab_save_click()
{
    webodfEditor.save();
}

function next()
{
    if(odfCanvas!=null)
    {
        /*var allPage =  OdfCanvas.getPages();

        if(currentPage+1 <= allPage)
        {
           currentPage = currentPage + 1;
           OdfCanvas.showPage(currentPage);
        }*/

        OdfCanvas.showNextPage();
    }
}

function prev()
{
    if(odfCanvas!=null)
    {
       /* if(currentPage-1 > 0)
        {
            currentPage = currentPage - 1;
            OdfCanvas.showPage(currentPage);
        }

        */

        OdfCanvas.showPreviousPage();
    }
}
var currentIndex;
function settings_string()
{
    bb.pushScreen('settings.html','settings');
}

function load_theme(selectElement)
{
    if(window.localStorage)
    {
        var itemindex = window.localStorage.getItem('theme');
        if(itemindex!=null)
        {
          //  selectElement.setSelectedItem(itemindex);
            selectElement.options[0].selected =  false;
            selectElement.options[1].selected =  false;
            selectElement.setSelectedItem(itemindex);
        }
        else
        {
           // selectElement.setSelectedItem(0);
            selectElement.setSelectedItem(0);
        }
    }
}

function index_changed(selectElement)
{
   // alert('index:' + selectElement.value);
    currentIndex = selectElement.value;
}

function ab_language_click()
{

    var options , onCancel, onInvoke, onError,onComplete;

    /**
     * Additional options that are available include:
     * - type					(e.g. FILEPICKER_TYPE_* where * can be PICTURE, DOCUMENT, MUSIC, VIDEO, OTHER)
     * - viewMode				(e.g. FILEPICKER_VIEWER_MODE_* where * can be LIST, GRID, DEFAULT)
     * - sortBy					(e.g. FILEPICKER_SORT_BY_* where * can be NAME, DATE, SUFFIX, SIZE)
     * - sortOrder				(e.g. FILEPICKER_SORT_ORDER_* where * can be ASCENDING, DESCENDING)
     * - filter					(e.g. ["*.mp3", "*.png*"])
     * - imageCropEnabled		(true or false)
     * - defaultSaveFileNames	(when opening a single or multiple items, default names can be provided as an [] for saving.)
     * - defaultType			(if multiple type values are provided as an [], the default to filter by.)
     * - allowOverwrite:		(true or false)
     * FILEPICKER_MODE_PICKER
     */
    options = {
        mode: "Picker",
        filter: ["*.odt","*.odp","*.ods","*.fodt"]
    };

    /* Log the path(s) we pick on completion. */

    onComplete = function (path) {
           console.log(path);
          /* bb.popScreen();*/

           bb.pushScreen('viewer.html','viewer', {filePath: path});

        };

    /* Log if we cancel selection. */
    onCancel = function (reason) {
        console.log('Cancelled: ' + reason);
    };

    /* Will be called when the File Picker is invoked. */
    onInvoke = function (error) {
        if (error) {
            console.log('Invoke error: ' + error);
        }
    };

    /* Call the invokeFilePicker function with our defined arguments. */

    blackberry.invoke.card.invokeFilePicker(options, onComplete, onCancel, onInvoke);


}
var isshow = false;
var isauto = false;
function ab_sort_click()
{
   if(isshow==true)
   {
       document.getElementById('sortType').hide();
       document.getElementById('sortAsc').hide();
       isshow = false;
   }
    else
   {
       var sortType = window.localStorage.getItem('sortType');
       if(sortType==null)
       {
           sortType = 2;
       }

       var sortAsc = window.localStorage.getItem('sortAsc');
       if(sortAsc == null)
       {
           sortAsc =1;
       }

       var dropdownSortType = document.getElementById('sortType');
       var dropdownSortAsc = document.getElementById('sortAsc');

       dropdownSortType.setSelectedItem(sortType);
       dropdownSortAsc.setSelectedItem(sortAsc);

       dropdownSortType.show();
       dropdownSortAsc.show();
       isshow = true;
   }
}


function sort_list()
{
    var tp = document.getElementById('sortType').value;
    var ord = document.getElementById('sortAsc').value;

    if (window.localStorage) {
        window.localStorage.removeItem('sortType');
        window.localStorage.setItem('sortType', tp);

        window.localStorage.removeItem('sortAsc');
        window.localStorage.setItem('sortAsc', ord);

    } else {
        //Local storage is not supported - save the key/value in a cookie instead?
        alert("window.localStorage API is not supported.");
        return false;
    }

    sort(tp,ord);
    ab_sort_click();
}

function share(el)
{
    var contextmenu = document.getElementById('recent_context');

    var title = contextmenu.menu.selected.title.trim();
    var desc = contextmenu.menu.selected.description.trim();

    var filePath = desc + title;


    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];

    if(filePath.substr(0,locale['device'].length) == locale['device'])
    {
        var path = '';
        var enterprisePath = '/accounts/1000-enterprise/shared';
        var temp = blackberry.io.sharedFolder;
        if(temp.slice(0,enterprisePath.length) == enterprisePath)
        {
            path = enterprisePath;
        }
        else
        {
            path = '/accounts/1000/shared';
        }

        filePath = path + filePath.substr(locale['device'].length);
    }

    if(filePath.substr(0,locale['sdcard'].length) == locale['sdcard'])
    {
        filePath = blackberry.io.SDCard + filePath.substr(locale['sdcard'].length);
    }

    if(filePath.substr(0,locale['invoke'].length) == locale['invoke'])
    {
        var path = '';
        var enterprisePath = '/accounts/1000-enterprise/shared';
        var temp = blackberry.io.sharedFolder;
        if(temp.slice(0,enterprisePath.length) == enterprisePath)
        {
            path = '/accounts/1000-enterprise/invoke';
        }
        else
        {
            path = '/accounts/1000/invoke';
        }

        filePath = path + filePath.substr(locale['invoke'].length);
    }

//    filePath = filePath.replace(locale['device'],"/accounts/1000/shared");
  //  filePath = filePath.replace(locale['sdcard'],blackberry.io.SDCard);
   // filePath = filePath.replace(locale['invoke'],"/accounts/1000/invoke");

    filePath = encodeURI(filePath);
   // alert(filePath);
    filePath = 'file://' + filePath;

    var request = {
        action: 'bb.action.SHARE',
        uri: filePath,
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };

    blackberry.invoke.card.invokeTargetPicker(request, locale['app_name'],

        // success callback
        function() {
            console.log('success');
        },

        // error callback
        function(e) {
            console.log('error: ' + e);
        }
    );
}

function del(el)
{
    var contextmenu = document.getElementById('recent_context');

    var title = contextmenu.menu.selected.title.trim();
    var desc = contextmenu.menu.selected.description.trim();

    var filePath = desc + title;

    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];

    if(filePath.substr(0,locale['device'].length) == locale['device'])
    {
        //filePath = "/accounts/1000/shared" + filePath.substr(locale['device'].length);
        var path = '';
        var enterprisePath = '/accounts/1000-enterprise/shared';
        var temp = blackberry.io.sharedFolder;
        if(temp.slice(0,enterprisePath.length) == enterprisePath)
        {
            path = enterprisePath;
        }
        else
        {
            path = '/accounts/1000/shared';
        }

        filePath = path + filePath.substr(locale['device'].length);
    }

    if(filePath.substr(0,locale['sdcard'].length) == locale['sdcard'])
    {
        filePath = blackberry.io.SDCard + filePath.substr(locale['sdcard'].length);
    }

    if(filePath.substr(0,locale['invoke'].length) == locale['invoke'])
    {
        var path = '';
        var enterprisePath = '/accounts/1000-enterprise/shared';
        var temp = blackberry.io.sharedFolder;
        if(temp.slice(0,enterprisePath.length) == enterprisePath)
        {
            path = '/accounts/1000-enterprise/invoke';
        }
        else
        {
            path = '/accounts/1000/invoke';
        }

        filePath = path + filePath.substr(locale['invoke'].length);
    }

//    filePath = filePath.replace(locale['sdcard'],blackberry.io.SDCard);
   // filePath = filePath.replace(locale['invoke'],"/accounts/1000/invoke");

    deleteRowPath(filePath);
}

var ismoreshow = false;

function tab_selected(index)
{
    if (window.localStorage) {
        if(index!=4)
        {
          window.localStorage.removeItem('tab');
          window.localStorage.setItem('tab', index);
        }

        /*if(isauto == true)
        {
            isauto = false;
        }
        else
        {
          if(index == 4)
          {
              if(ismoreshow == false)
              {
                  document.getElementById('controlPanel').show();
                  ismoreshow = true;
              }
              else
              {
                  ismoreshow = false;
                  document.getElementById('controlPanel').hide();
              }
          }
          else
          {
              document.getElementById('controlPanel').hide();
          }
        }*/
    }
    else {
        //Local storage is not supported - save the key/value in a cookie instead?
        alert("window.localStorage API is not supported.");
        return false;
    }

    displayMessages();
}

function filter_click()
{
    if (window.localStorage) {
        window.localStorage.removeItem('tab');
        window.localStorage.setItem('tab', 4);
    }

    var exts=[];

    var ext = document.getElementById('cb1').getChecked()
    if(ext == true)
    {
        exts.push(1);
    }

    var ext = document.getElementById('cb2').getChecked()
    if(ext == true)
    {
        exts.push(2);
    }

    var ext = document.getElementById('cb3').getChecked()
    if(ext == true)
    {
        exts.push(3);
    }

    window.localStorage.removeItem('exts');
    window.localStorage.setItem('exts',exts);
  //  ismoreshow = false;
    //document.getElementById('controlPanel').hide();

    displayMessages();
}

function open_about_page()
{
    bb.pushScreen('about.html','about');
}

function backclick()
{
    bb.pushScreen('recent.html','recent');
}

function share_new(el)
{
    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];

    var filePath = FILE_PATH;

    filePath = encodeURI(filePath);
    // alert(filePath);
    filePath = 'file://' + filePath;

    var request = {
        action: 'bb.action.SHARE',
        uri: filePath,
        target_type: ["APPLICATION", "VIEWER", "CARD"]
    };

    blackberry.invoke.card.invokeTargetPicker(request, locale['app_name'],

        // success callback
        function() {
            console.log('success');
        },

        // error callback
        function(e) {
            console.log('error: ' + e);
        }
    );
}

function dialogCallBack(index){
   if(index == 1)
   {
       del(this);
   }
}

function customDeleteDialog() {
    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];

    try {
        var buttons = [locale["cancel"], locale["del"]];
        var ops = {title : locale["del"]};
        blackberry.ui.dialog.customAskAsync(locale["deletemessage"], buttons, dialogCallBack, ops);
    } catch(e) {
        alert("Exception in customDialog: " + e);
    }
}
