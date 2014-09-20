/**
 * Created by Aria on 26.02.14.
 */
/*
 * Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var db;

/*
 Note:On some BlackBerry Smartphones, a SDCard is required to run this sample.  This is due to the fact that SQLite databases depend on the file system structure provided by Flash memory.


 Rules of HTML5 Database:

 1. The transaction(), readTransaction(), and changeVersion() methods invoke callbacks with a SQLTransaction object as an argument.

 2. The executeSql() method invokes its callback with two arguments: SQLTransaction and SQLResultSet.

 3. When an error occurs within the executeSql() method, its error callback is invoked with a SQLError object as an argument.
 */

/**
 * Helper functions
 */
function error(msg) {
    var ele = document.getElementById("output");
    if (ele) {
        ele.innerHTML += "<div class='error'>" + msg + "</div>" ;
    }
}
function getSQLErrorName(err) {
    if (err === null)  {
        return "";
    }
    switch(err.code) {
        case err.DATABASE_ERR:
            //The statement failed for database reasons not covered by any other error code.
            return "DATABASE";
        case err.VERSION_ERR:
            //The operation failed because the actual database version was not what it should be.
            //	For example, a statement found that the actual database version no longer matched the
            //	expected version of the Database or DatabaseSync object, or the Database.changeVersion()
            //	or DatabaseSync.changeVersion() methods were passed a version that doesn't match the actual database version.
            return "DATABASE VERSION";
        case err.TOO_LARGE_ERR:
            //The statement failed because the data returned from the database was too large. The
            //	SQL "LIMIT" modifier might be useful to reduce the size of the result set.
            return "RESULT TOO LARGE";
        case err.QUOTA_ERR:
            //The statement failed because there was not enough remaining storage space, or the storage
            //	quota was reached and the user declined to give more space to the database.
            return "QUOTA EXCEEDED";
        case err.SYNTAX_ERR:
            //The statement failed because of a syntax error, or the number of arguments did not match
            //	the number of ? placeholders in the statement, or the statement tried to use a statement
            //	that is not allowed, such as BEGIN, COMMIT, or ROLLBACK, or the statement tried to use a
            //	verb that could modify the database but the transaction was read-only.
            return "SYNTAX";
        case err.CONSTRAINT_ERR:
            //An INSERT, UPDATE, or REPLACE statement failed due to a constraint failure. For example,
            //	because a row was being inserted and the value given for the primary key column duplicated
            //	the value of an existing row.
            return "CONSTRAINT";
        case err.TIMEOUT_ERR:
            //A lock for the transaction could not be obtained in a reasonable ti
            return "TIMEOUT";
        default:
            //The transaction failed for reasons unrelated to the database itself and not covered by any
            //	other error code.
            return "UNKNOWN";
    }
}

//Two types of error events can occur: transaction errors and SQL statement errors.

/**
 * SQLTransactionErrorCallback - method raised by the db.transaction() or db.readTransaction() or db.changeVersion() methods when an error occurs within a transaction event.
 *      http://www.w3.org/TR/webdatabase/#sqltransactionerrorcallback
 * @param err (SQLError) has two parameters: code (unsigned short), message (string) and constants
 *      http://www.w3.org/TR/webdatabase/#sqlerror
 */
function handleTransactionError(err) {
    error("SQLTransactionError " + err.code + " [" + getSQLErrorName(err.code) + "] " + err.message);
}
/**
 * SQLStatementErrorCallback - method raised by the tx.executeSql() method when an error occurs within an SQL statement.
 *      http://www.w3.org/TR/webdatabase/#sqlstatementerrorcallback
 * @param tx (SQLTransaction) has a single method: void executeSql(string sqlStatement, optional array args, optional SQLStatementCallBack callback, optional SQLStatementErrorCallback errorCallback)
 *      http://www.w3.org/TR/webdatabase/#sqltransaction
 * @param err (SQLError) has two parameters: code (unsigned short), message (string) and constants
 *      http://www.w3.org/TR/webdatabase/#sqlerror
 */
function handleSQLError(tx, err) {
    //The tx parameter can be used to run another SQL statement (e.g. log a message to an error table)
    error("SQLStatementError " + err.code + " [" + getSQLErrorName(err.code) + "] " + err.message);
}



/**
 * The following are SQLStatementCallback methods raised after a records are inserted, updated, deleted selected from the DB.
 * @param tx (SQLTransaction) has a single method: void executeSql(string sqlStatement, optional array args, optional SQLStatementCallBack callback, optional SQLStatementErrorCallback errorCallback)
 *      http://www.w3.org/TR/webdatabase/#sqltransaction
 * @param result (SQLResultSet) contains three attributes: insertId (readonly long), rowsAffected (readonly long), rows (readonly SQLREsultSetRowList)
 *      http://www.w3.org/TR/webdatabase/#sqlresultset
 */
function insertComplete(tx, result) {
    //The insertId attribute contains the ID of the row that was inserted into the database.
    //If a single statement inserted multiple rows, the ID of the last row is returned.
    //debug.log("insertComplete", result.rowsAffected + " row(s) added (rowId =" + result.insertId + ")", debug.info);

    console.log('insert is completed rowId=' + result.insertId);
}
function updateComplete(tx, result) {
    //The rowsAffected attribute contains number of rows that were changed by the SQL statement.
    // SELECT statements do not modify rows, and therefore have a rowsAffected value of 0.
    //debug.log("updateComplete", result.rowsAffected + " row(s) updated", debug.info);
    console.log('update is completed rowId=');
}
function deleteComplete(tx, result) {
    //debug.log("deleteComplete", result.rowsAffected + " row(s) deleted", debug.info);
    console.log('delete is completed');
}

function deleteCompleteAfterDeleteContextMenu(tx, result) {
    displayMessages();
}

function selectComplete(tx, result) {
    //The rows attribute is a SQLResultSetRowList object containing one paramter length (int) and one method .item(index)
    //  The same object must be returned each time. If no rows were returned, then the object will be empty (its length will be zero).
    //	http://www.w3.org/TR/webdatabase/#sqlresultsetrowlist
    var size = result.rows.length;
    debug.log("selectComplete", size + " row(s) returned", debug.info);
}


function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

/**
 * SQLStatementCallback methods raised after a SELECT statement is called.  Display results to the page.
 * @param tx (SQLTransaction) has a single method: void executeSql(string sqlStatement, optional array args, optional SQLStatementCallBack callback, optional SQLStatementErrorCallback errorCallback)
 *			http://www.w3.org/TR/webdatabase/#sqltransaction
 * @param result (SQLResultSet) contains three attributes: insertId (readonly long), rowsAffected (readonly long), rows (readonly SQLREsultSetRowList)
 *			http://www.w3.org/TR/webdatabase/#sqlresultset
 */
function displayMessagesResults(tx, result) {
    var ele, output, size, i, item, dt;
    var items = [],
        item1;
    ele = document.getElementById("myImageList");
    output = "";
    size = result.rows.length;

    if (size === 0) {
       // output += "";
        var lang = blackberry.system.language;
        lang = lang.substr(0,2);
        var locale = languages[lang] || languages['en'];

        var messagediv = document.getElementById("messageDiv");
        messagediv.style.display = "";
        if(window.localStorage)
        {
            var itemindex = window.localStorage.getItem('theme');

            filter =  window.localStorage.getItem('tab');
            if(filter == null)
            {
                filter = 0;
            }

            if(filter == 0)
            {
                messagediv.innerText = locale['emptymessage'];
            }

            if(filter == 1)
            {
                messagediv.innerText = locale['emptymessageodt'];
            }

            if(filter == 2)
            {
                messagediv.innerText = locale['emptymessageods'];
            }

            if(filter == 3)
            {
                messagediv.innerText = locale['emptymessageodp'];
            }
        }
        else
        {
            messagediv.innerText = locale['emptymessage'];
        }

        if (ele) {
            ele.clear();
        }
    }
    else {
        var messagediv = document.getElementById("messageDiv");
        messagediv.style.display = "none";
      //  output += "<table id='table-2' cellspacing='0' cellpadding='5' width='100%'>";
        for (i = 0; i < size; i = i + 1) {
            item = result.rows.item(i);
            dt = new Date(item.created);
            var r = "OpenDocument(" + item.id + ");"

            var ext = item.filepath.split('.').pop();

            var icon = "img/odt-file1.png";

            if(ext == 'odt')
            {
                icon = "img/odt-file1.png";
            }

            if(ext == 'ods')
            {
                icon = "img/ods-file1.png";
            }

            if(ext == 'odp')
            {
                icon = "img/odp-file1.png";
            }
            var filter = 0;

            if(window.localStorage)
            {
                filter =  window.localStorage.getItem('tab');
            }


            var szKB = bytesToSize(item.size);
          // var title = "<font color='"+mainColor+"'>" + item.filepath.split('/').pop() + "</font>";
            var title = item.filepath.split('/').pop();
            item1 = document.createElement('div');
            item1.setAttribute('data-bb-type','item');
            item1.setAttribute('data-bb-title',title);
            item1.setAttribute('filePath', item.filepath);
            item1.setAttribute('data-bb-accent-text',szKB);
         //   item1.setAttribute('class','bb-image-list-item bb-image-list-item-light');

            var desc =item.filepath;
            var res = desc.replace(item.filepath.split('/').pop()," ");

            var lang = blackberry.system.language;
            lang = lang.substr(0,2);
            var locale = languages[lang] || languages['en'];

            res = res.replace("/accounts/1000/shared",locale['device']);
            res = res.replace(blackberry.io.SDCard,locale['sdcard']);
            res = res.replace("/accounts/1000/invoke",locale['invoke']);

            item1.innerHTML = res;//"<font size='6'  color='" + addColor + "'>"+res+"</font>";
            item1.setAttribute('data-bb-img',icon);
            item1.setAttribute("onclick","OpenDocument('"+item.id+"');");

          //  item1.onclick = function() {
           //    alert('clicked');
            //   OpenDocument(item.id);
            //};

            var ext10 = item.filepath.split('/').pop().split('.').pop();
            var isadd = false;

            if(filter == 0)
            {
                isadd = true;
            }

            if(filter == 1)
            {
                if(ext10.toUpperCase() == 'ODT')
                {
                    isadd = true;
                }
            }

            if(filter == 2)
            {
                if(ext10.toUpperCase() == 'ODS')
                {
                    isadd = true;
                }
            }

            if(filter == 3)
            {
                if(ext10.toUpperCase() == 'ODP')
                {
                    isadd = true;
                }
            }

            if(filter == 4)
            {
                var exts1 = window.localStorage.getItem('exts').split(',');

                for (index1 = 0; index1 < exts1.length; ++index1) {
                    var temp = (exts1[index1]);

                    if(temp == 1)
                    {
                        if(ext10.toUpperCase() == 'ODT')
                        {
                            isadd = true;
                        }
                    }

                    if(temp == 2)
                    {
                        if(ext10.toUpperCase() == 'ODS')
                        {
                            isadd = true;
                        }
                    }

                    if(temp == 3)
                    {
                        if(ext10.toUpperCase() == 'ODP')
                        {
                            isadd = true;
                        }
                    }
                }
            }

            if(isadd == true)
            {
               items.push(item1);
            }
            //output += "<div  onclick='" + r + "' data-bb-type='item' data-bb-img='" + icon + "' data-bb-title='"+ title +"'>" + item.filepath + "</div>";

            //output += "<tr onclick='" + r + "'><td class='line'><table><tr><td rowspan='2' style='width: 81px;'><img src='"+ icon +"'/></td><td><font width='100%' color='" + mainColor + "'>" + title + "</font></td></tr><tr><td><font width='100%' size='5'  color='" + addColor + "'>" + item.filepath + "</font></td></tr><table></table></td></tr>";
        }
        if (ele) {

            if(items.length > 0)
            {
                ele.refresh(items);
            }
            else
            {
                ele.clear();
                if(filter == 0)
                {
                    messagediv.innerText = locale['emptymessage'];
                }

                if(filter == 1)
                {
                    messagediv.innerText = locale['emptymessageodt'];
                }

                if(filter == 2)
                {
                    messagediv.innerText = locale['emptymessageods'];
                }

                if(filter == 3)
                {
                    messagediv.innerText = locale['emptymessageodp'];
                }

                messagediv.style.display="";
            }
        }

      //  output += "</table>";
    }
   // <input type='button' onclick='OpenDocument('" + item.filepath + "')">

}

function OpenDocument(pathFile10)
{
    //pathFile10 = '';
    //alert(pathFile10);
    //addRecent(pathFile10);
    //bb.pushScreen('viewer.html','viewer', {filePath: pathFile10});
    OpenDocumentById(pathFile10);
}

/**
 * Make the following logic its own method, so it can be called from various sources.
 */
function displayMessages() {

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

   /* if (db) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id, filepath,title, created,size FROM Recent order by created desc', [], displayMessagesResults, handleSQLError);
        }, handleTransactionError);
    }*/

    sort(sortType,sortAsc);
}

function sort(tp,order)
{
    var tp1 = 'title';
    if(tp == 1)
    {
        tp1 = 'size';
    }

    if(tp == 2)
    {
        tp1 = 'created';
    }

    var ord = '';

    if(order == 1)
    {
        ord = ' desc';
    }

    var sqlQuery = 'SELECT id, filepath,title, created,size FROM Recent order by ' + tp1 + ord;

    if (db) {
        db.transaction(function(tx) {
            tx.executeSql(sqlQuery, [], displayMessagesResults, handleSQLError);
        }, handleTransactionError);
    }
}

function OpenDocumentById(id) {
    if (db) {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id, filepath,title, created,size FROM Recent where id=' + id, [], OpenDocumentByIdResults, handleSQLError);
        }, handleTransactionError);
    }
}

function OpenDocumentByIdResults(tx, result) {
    var row;

   var size = result.rows.length;

   for (i = 0; i < size; i = i + 1) {
     row = result.rows.item(i);
     break;
   }

    if(row!=null)
    {
        FILE_PATH = row.filepath;
    //    alert(FILE_PATH);
        addRecent(row.filepath);
        bb.pushScreen('viewer.html','viewer', {filePath: FILE_PATH});
    }

}


/**
 * Called when the user clicks on the 'Add Message' button.
 */
function addRecent(message) {
    var created = new Date().getTime();
    if (message === "") {
        error("Enter a message");
    }
    else {
        if (db) {
            db.transaction(function(tx) {
                  tx.executeSql("DELETE FROM Recent WHERE filepath=?",[message],deleteComplete, handleSQLError);
                }
            )
            var sTitle = FILE_PATH.split('/').pop();
            db.transaction(function(tx) {
                tx.executeSql("INSERT INTO Recent (filepath,title, created,size) VALUES (?, ?,?,?)", [message,sTitle, created,FILE_SIZE], insertComplete, handleSQLError);
                displayMessages();
            }, handleTransactionError);
        }
    }
}

/**
 * SQLStatementCallback methods raised after the first table was created.  Add test data.
 * @param tx (SQLTransaction) has a single method: void executeSql(string sqlStatement, optional array args, optional SQLStatementCallBack callback, optional SQLStatementErrorCallback errorCallback)
 *     http://www.w3.org/TR/webdatabase/#sqltransaction
 * @param result (SQLResultSet) contains three attributes: insertId (readonly long), rowsAffected (readonly long), rows (readonly SQLREsultSetRowList)
 *     http://www.w3.org/TR/webdatabase/#sqlresultset
 */
function firstCreateComplete(tx, result) {
 /*   try {
        //Do not need to begin another transaction.  Since the active transaction object was
        //	provided as a parameter, it can now be reused to insert some test data:
        var created = new Date().getTime();
        tx.executeSql("INSERT INTO Messages (message, created) VALUES (?, ?)", ["Hello World A", created], insertComplete, handleSQLError);
        tx.executeSql("INSERT INTO Messages (message, created) VALUES (?, ?)", ["Hello World B", created], insertComplete, handleSQLError);
        tx.executeSql("INSERT INTO Messages (message, created) VALUES (?, ?)", ["Hello World C", created], insertComplete, handleSQLError);

        //Finally, display all rows in the table.
        displayMessages();
    }
    catch(ex) {
        error("exception (firstCreateComplete): " + ex);
    }*/

    console.log('database is created');
}
/**
 * Called when the user clicks on the 'Delete' hyperlink.
 */
function deleteRow(id) {
    if (db) {
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM Recent WHERE id = ?', [id], deleteComplete, handleSQLError);
            displayMessages();
        }, handleTransactionError);
    }
}

function deleteRowPath(filepath) {
    if (db) {
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM Recent WHERE filepath = ?', [filepath], deleteCompleteAfterDeleteContextMenu, handleSQLError);
            displayMessages();
        }, handleTransactionError);
    }
}

/**
 * DatabaseCallback method invoked when the Database is first created. Designed to initialize the schema by creating necessary table(s).
 *     http://www.w3.org/TR/webdatabase/#databasecallback
 * @param database (Database) - reference to the DB object that was creatd
 *     http://www.w3.org/TR/webdatabase/#database
 */
function createTableOnNewDatabase(database) {
    try {
        if (database) {
            //This method allows the page to verify the version number and change it at the same time as doing a schema update.
            //Getting this error on DB create: "current version of the database and `oldVersion` argument do not match", despite the fact that both values are ""
            //database.changeVersion("", "1.0", createFirstTable, handleTransactionError);
            //database.transaction(createFirstTable, handleTransactionError);
            database.transaction(function(tx) {
                //The following method is asyncronous, perform record insert statements within the callback method after table has been created successful
                tx.executeSql("CREATE TABLE IF NOT EXISTS Recent (id INTEGER PRIMARY KEY, filepath TEXT, title TEXT, created TIMESTAMP,size INTEGER)", [], firstCreateComplete, handleSQLError);
            }, handleTransactionError);

        }
    }
    catch(ex) {
        error("exception (createTableOnNewDatabase): " + ex);
    }
}



/**
 * Called by page load event.  Opens DB reference and displays contents of Messages table
 */
function doPageLoad() {
    try {

        //Assign 2MB of space for the database
        console.log('doPageLoad');
        var dbSize = 2 * 1024 * 1024;
        db = window.openDatabase("RecentDb1", "1.0", "Recent file database", dbSize, createTableOnNewDatabase);

        console.log(db);
        //
        // What is the best practice for determining when you can begin reading/writing from the DB after it has first been created?
        //
  /*      if (db !== null) {
            displayMessages();
        }*/
    }
    catch(e) {
        error("exception (initPage): " + e);
    }
}