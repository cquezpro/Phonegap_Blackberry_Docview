/**
 * Created by Aria on 09.04.14.
 */

function localizationRecent(element)
{
    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];
    var opn = locale['open'];
    element.getElementById('opendiv').innerText = opn;
    element.getElementById('opendivmenu').innerText = opn;
/*    element.getElementById('selectDiv').innerText =  locale['select'];*/
    element.getElementById('sortByName').innerText =  locale['sortbyname'];
  //  element.getElementById('sortBySize').innerText =  locale['sortbysize'];
   // element.getElementById('sortByDate').innerText =  locale['sortbydate'];

  //  element.getElementById('titleDiv').innerText = locale['recent'];

    element.getElementById('shareAction').innerText = locale['share'];
    element.getElementById('deleteAction').innerText = locale['del'];

    element.getElementById('dvTitle').setAttribute("data-bb-caption", locale['recent']);
    element.getElementById('actionBarDv').setAttribute("data-bb-more-caption", locale['moreButton']);

    element.getElementById('aboutitem').innerText = locale['about'];

    var selectTheme =  element.getElementById('sortType');
    selectTheme.options[0].innerText =  locale['name'];
    selectTheme.options[1].innerText =  locale['size'];
    selectTheme.options[2].innerText =  locale['date'];

    var selectTheme =  element.getElementById('sortAsc');
    selectTheme.options[0].innerText =  locale['asc'];
    selectTheme.options[1].innerText =  locale['desc'];

    element.getElementById('tab0').innerText =  locale['all'];


  //  element.getElementById('tab4').innerText =  locale['select'];
    //element.getElementById('bntOk').innerText =  locale['select'];

   // document.getElementById('tabOverflowAction').setCaption(caption);
    //document.getElementById('findAction').setCaption(caption);
    //document.getElementById('actionOverflowAction').setCaption(caption);

}

function localizationSettings(element)
{
    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];
    var opn = locale['save'];
   // element.getElementById('opendiv').innerText = opn;

  //  element.getElementById('dvTitle').setAttribute("data-bb-back-caption", locale['back']);
    element.getElementById('dvTitle').setAttribute("data-bb-caption", locale['app_name']);
    element.getElementById('themeDiv').innerText = locale['theme'];
    element.getElementById('actionBar1').setAttribute("data-bb-back-caption", locale['back']);

    var selectTheme =  element.getElementById('themeSelect');
    selectTheme.options[0].innerText =  locale['white'];
    selectTheme.options[1].innerText =  locale['black'];

    // document.getElementById('tabOverflowAction').setCaption(caption);
    //document.getElementById('findAction').setCaption(caption);
    //document.getElementById('actionOverflowAction').setCaption(caption);

}


function localizationAbout(element)
{
    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];
    var opn = locale['save'];
    // element.getElementById('opendiv').innerText = opn;

    //  element.getElementById('dvTitle').setAttribute("data-bb-back-caption", locale['back']);
    element.getElementById('dvTitle').setAttribute("data-bb-caption", locale['about']);
    element.getElementById('actionBar1').setAttribute("data-bb-back-caption", locale['back']);

}


function localizationViewer(element)
{
    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];
    //element.getElementById('opendivViewer').innerText =  locale['open'];;

  //  element.getElementById('editdivViewer').innerText = locale['edit'];
    element.getElementById('settingdivViewer').innerText = locale['share'];
    element.getElementById('actionBar1').setAttribute("data-bb-back-caption", locale['back']);
}

function localizationEditor(element)
{
    var lang = blackberry.system.language;
    lang = lang.substr(0,2);
    var locale = languages[lang] || languages['en'];
    element.getElementById('opendiv').innerText =  locale['open'];
    element.getElementById('editdiv').innerText = locale['save'];
    element.getElementById('settingdiv').innerText = locale['close'];


    element.getElementById('font').innerText =  locale['font'];
    element.getElementById('boldFont').innerText = locale['boldFont'];
    element.getElementById('italicFont').innerText = locale['italicFont'];

    element.getElementById('underlineFont').innerText =  locale['underlineFont'];
    element.getElementById('strikeFont').innerText = locale['strikeFont'];
    element.getElementById('left').innerText = locale['left'];

    element.getElementById('center').innerText =  locale['center'];
    element.getElementById('right').innerText = locale['right'];
    element.getElementById('justify').innerText = locale['justify'];

}