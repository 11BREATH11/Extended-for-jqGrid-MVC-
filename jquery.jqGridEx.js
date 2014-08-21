/// <summary>
/// Функция инициализации jqGrid c формами для редактирования, удаления и добавления записей
/// Пример использования смотрите внизу страницы, диалог для редактирования и добавления записей формируеться на стороне клиента как
/// частичные представления. Вся валидация данных(полей формы) привязуеться к модели на стороне сервера.
/// </summary>
//{
/// <param name="InitJqGrid">инициализация jqGrid, форма записи такая же как для плагина jquery.jqGrid.src.js</param>
///{
/// .....
///}
/// <param name="key">
///{
///  name: название составного ключа, принимаеться на сервере в контроллере, задавать как параметр в контроллере string (название ключа key). Структура составного ключа формируется по принципу 'значение части составного ключа 1'+разделитель+'значение части составного ключа 2'+...+'значение части составного ключа n'
///  delim:  символ разделителя для составного ключа
///}
///  
/// <param name="editDialogIn"> настройки в ввиде параметров в формате json диолога для редактирования записей 
///{
///  title: заголовок диалога
///  nameForm: id формы в частичном представление на стороне сервера, которое подгружаеться как контент диалога
///  modal: модальная форма true,false
///  url: url частичтого представления на стороне сервера, которое подгружаеться как контент диалога    
///  oneButText: текст на кнопке диалога для сохранения
///  twoButText: текст на кнопке диалога для отмены
///  effectShow: еффект при открытии диалога для редактирования, описываеться так же как параметр show для стандартного jQuery dialog. Перечень значений "drop","clip","slide","drop","drop","drop"
///  effectHide: еффект при закрытии диалога для редактирования, описываеться так же как параметр hide для стандартного jQuery dialog
///  width: ширина диалога
///  height: высота диалога
///}
/// </param>
/// <param name="addDialog"> настройки в ввиде параметров в формате json диолога для добавления записей, формат параметров такой же как описан выше </param>
/// <param name="delDialog"> настройки в ввиде параметров в формате json диолога для удаления записей, формат параметров такой же как описан выше </param>
/// <param name="viewDialog"> настройки в ввиде параметров в формате json диолога для просмотра записей, формат параметров такой же как описан выше </param>
/// <param name="editButton">настройки в ввиде параметров в формате json кнопки в jqGrid для редактирования записей, зарезервированное слово edit
///{
///  icoClass: иконка для кнопки
///  alt: сплывающая надпись над иконкой
///}    
/// </param>
/// <param name="delButton">  настройки в ввиде параметров в формате json кнопки в jqGrid для удаления записей, формат параметров такой же как описан выше, зарезервированное слово del </param>
/// <param name="viewButton">  настройки в ввиде параметров в формате json кнопки в jqGrid для просмотра записей, формат параметров такой же как описан выше, зарезервированное слово view </param>
/// <param name="userButton">  настройки в ввиде параметров в формате json пользовательской кнопки в jqGrid, зарезервированное слово user</param>
///{
///   alt: сплывающая надпись над иконкой,
///   icoClass: иконка для кнопки,
///   UserFunction: пользовательская ф-я, срабатывает при нажатии на кнопку
///}
/// <param name="setGroupHeaders"> обьединение колонок в jqGrid</param>
/// <param name="GridComplete"> ф-я выполняеться после инициализации jqGrid</param>
//}
/// <returns></returns>


(function ($) {

    var memory = new Array();

    var methods = {
        init: function (options) {

            /* настройки по умолчанию  */

            var settings = {

                InitJqGrid: {
                    datatype: 'json',
                    rowList: [10, 20, 30],
                    height: 'auto',
                    shrinkToFit: true,
                    viewrecords: true,
                    toppager: false,
                    ondblClickRow: function (rowid, iRow, iCell, e) {

                        if (settings.edit == false) {
                            $(this).jqGridEx("EditRow", rowid);
                        } else {
                            $(this).jqGridEx("ViewRow", rowid);
                        }
                    },
                    gridComplete: function () {
                        var id = $(this).jqGrid('getCol', settings.key.name);
                        settings.GridComplete();

                        if (settings.hidePager) {
                            var moreSmallValueArray = $(this).getGridParam("rowList");
                            var flagNoPaging = false;
                            var moreSmallValue;
                            if (moreSmallValueArray != undefined) {
                                moreSmallValue = moreSmallValueArray[0];
                                for (i = 1; i < moreSmallValueArray.length; i++) {
                                    if (moreSmallValueArray[i] < moreSmallValue) {
                                        moreSmallValue = moreSmallValueArray[i];
                                    }
                                }
                            }

                            var countRecords = $(this).getGridParam("records");
                            if (countRecords <= moreSmallValue) {
                                $($(this).getGridParam("pager")).hide();

                                if (countRecords != 0 && $(this).getGridParam("reccount") == 0) {
                                    $(this).jqGrid("GridUnload");
                                    $("#" + key).jqGrid(settings.InitJqGrid);
                                }
                            } else {
                                $($(this).getGridParam("pager")).show();
                            }
                        }

                        for (var i = 0; i < id.length; i++) {


                            //alert( ($("input[class='ui-pg-input']").val() - 1) * ($("select[class='ui-pg-selbox']").val()) + i + 1 );

                            //Рядки

                            // КОСТЫЛЬ х_х
                            if ($("#gbox_" + this.id + " input[class='ui-pg-input']").val() === undefined || $("#gbox_" + this.id + " select[class='ui-pg-selbox']").val() === undefined) {
                                $(this).jqGrid('setRowData', i + 1, { number: i + 1 });

                            }
                            else {
                                $(this).jqGrid('setRowData', i + 1, { number: ($("#gbox_" + this.id + " input[class='ui-pg-input']").val() - 1) * ($("#gbox_" + this.id + " select[class='ui-pg-selbox']").val()) + i + 1 });
                            }
                            if (settings.downloadButton.icoClass != null) {

                                //Скачать файл
                                be = "<input type='button' class = '" + settings.downloadButton.icoClass + "' onclick=\"$('#" + $(this)[0].id + "').jqGridEx('DownLoadFileIn'," + (i + 1) + ")\"  title=\"" + settings.downloadButton.alt + "\" />";
                                $(this).jqGrid('setRowData', i + 1, { download: be });
                            }

                            if (settings.editButton.icoClass != null) {

                                //Редактирование
                                be = "<input type='button' class = '" + settings.editButton.icoClass + "' onclick=\"$('#" + $(this)[0].id + "').jqGridEx('EditRow'," + (i + 1) + ")\"  title=\"" + settings.editButton.alt + "\" />";
                                $(this).jqGrid('setRowData', i + 1, { edit: be });
                            }

                            if (settings.delButton.icoClass != null) {

                                //Удаление                               
                                if (settings.delButton.func != null) {
                                    de = "<input class='" + settings.delButton.icoClass + "' type='button' onclick=\"" + settings.delButton.func + "(" + (i + 1) + ")\" title=\"" + settings.delButton.alt + "\" />";
                                    //de = "<input class='" + settings.delButton.icoClass + "' type='button' onclick=\"if(" + settings.delButton.func + "(" + (i + 1) + ")== true) $('#" + $(this)[0].id + "').jqGridEx('DeleteElem'," + (i + 1) + "); \" title=\"" + settings.delButton.alt + "\" />";
                                }
                                else
                                {
                                    de = "<input class='" + settings.delButton.icoClass + "' type='button' onclick=\"$('#" + $(this)[0].id + "').jqGridEx('DeleteElem'," + (i + 1) + ");\" title=\"" + settings.delButton.alt + "\" />";
                                }
                                $(this).jqGrid('setRowData', i + 1, { del: de });
                            }

                            if (settings.viewButton.icoClass != null) {
                                //Просмотр
                                ve = "<input class='" + settings.viewButton.icoClass + "' type='button' onclick=\"$('#" + $(this)[0].id + "').jqGridEx('ViewRow'," + (i + 1) + ");\" title=\"" + settings.viewButton.alt + "\" />";
                                $(this).jqGrid('setRowData', i + 1, { view: ve });
                            }

                            if (settings.historyButton.icoClass != null) {
                                //История
                                ve = "<input class='" + settings.historyButton.icoClass + "' type='button' onclick=\"$('#" + $(this)[0].id + "').jqGridEx('ShowHistory'," + (i + 1) + ");\" title=\"" + settings.historyButton.alt + "\" />";
                                $(this).jqGrid('setRowData', i + 1, { history: ve });
                            }

                            for (l = 0; l < settings.userButton.length; l++) {
                                if (settings.userButton[l].icoClass != null) {
                                    ve = "<input class='" + settings.userButton[l].icoClass + "' type='button' onclick=\"$('#" + $(this)[0].id + "').jqGridEx('UserButtonClick'," + (i + 1) + "," + l + ");\" title=\"" + settings.userButton[l].alt + "\" />";
                                    if (settings.userButton[l].Available != null) {

                                        params = id[i].split(",");
                                        if ((params[settings.userButton[l].Available] == null) || (params[settings.userButton[l].Available] == ""))//Рядки
                                            ve = "";
                                    }
                                    $(this).jqGrid('setCell', i + 1, settings.userButton[l].name, ve);
                                }
                            }

                            dataRow = $(this).jqGrid("getRowData", i + 1)

                            for (k in dataRow) {

                                if ((dataRow[k].indexOf("{") != -1) && (dataRow[k].indexOf("}") != -1)) {

                                    data = eval('(' + dataRow[k] + ')');

                                    if (data.ico != null) {

                                        ve = "<div class='" + data.ico + "'/>";
                                        $(this).jqGrid('setCell', i + 1, k, ve, "");
                                    }
                                }
                            }

                        }

                        if (memory[$(this)[0].id].create == false) {

                            if (settings.setGroupHeaders.groupHeaders != null) {
                                $(this).jqGrid('setGroupHeaders', {
                                    useColSpanStyle: settings.setGroupHeaders.useColSpanStyle,
                                    groupHeaders: settings.setGroupHeaders.groupHeaders
                                });
                            }

                            $(this).jqGrid('navGrid', settings.InitJqGrid.pager.selector, { add: false, del: false, edit: false, search: false, refresh: settings.refresh });

                            if (settings.print.hidden == false) {
                                $(this).jqGrid('navButtonAdd', settings.InitJqGrid.pager.selector, {
                                    caption: settings.print.caption,
                                    title: settings.print.title,
                                    buttonicon: settings.print.buttonicon,
                                    onClickButton: function () {
                                        $(this).jqprint();
                                    },
                                    position: settings.print.position
                                });
                            }

                            if (settings.excelButton.hidden == false) {
                                $(this).jqGrid('navButtonAdd', settings.InitJqGrid.pager.selector, {
                                    caption: settings.excelButton.caption,
                                    title: settings.excelButton.title,
                                    buttonicon: settings.excelButton.buttonicon,
                                    onClickButton: function () {

                                        settings.excelButton.HookFunction();

                                        var ExportData = { Headers: {} };

                                        $.extend(true, ExportData, settings.excelButton);

                                        ExportData.Headers.data = new Array();

                                        for (i = 0; i < settings.InitJqGrid.colNames.length; i++) {
                                            if (settings.InitJqGrid.colNames[i] != "" && settings.InitJqGrid.colNames[i] != settings.key.name) {
                                                ExportData.Headers.data[i] = {};
                                                ExportData.Headers.data[i].name = settings.InitJqGrid.colNames[i];
                                                ExportData.Headers.data[i].index = settings.InitJqGrid.colModel[i].index;
                                                for (j = 0; j < settings.setGroupHeaders.groupHeaders.length; j++) {
                                                    if (settings.setGroupHeaders.groupHeaders[j].startColumnName == settings.InitJqGrid.colModel[i].index) {
                                                        ExportData.Headers.data[i].group = {};
                                                        ExportData.Headers.data[i].group.count = settings.setGroupHeaders.groupHeaders[j].numberOfColumns;
                                                        ExportData.Headers.data[i].group.title = settings.setGroupHeaders.groupHeaders[j].titleText;
                                                    }
                                                }
                                            }
                                        }


                                        if (settings.excelButton.url != "") {
                                            $.ajax({
                                                cache: false,
                                                type: "GET",
                                                url: settings.exportGrid.button.url,
                                                data: ExportData,
                                                success: function (answer) {
                                                }

                                            });
                                        }

                                    },
                                    position: settings.excelButton.position
                                });
                            }
                        }

                        settings.LoadGrid();

                        memory[$(this)[0].id].create = true;

                    },

                    width: screen.width - 70,
                    rowNum: 10,
                    mtype: "GET",
                    pager: $("#pager"),
                    sortorder: "asc" //направление сортировки
                },
                hidePager: true,

                key: { name: "objKey", delim: ";" }, // название составного ключа, принимаеться на сервере в контролере, задавать как параметр в контролере (название ключа key)
                editDialog: { title: "Редагувати запис", nameForm: "form", modal: true,        //блок для задания параметров диалога редактирования записей
                    oneButText: "Зберегти", twoButText: "Скасувати", effectShow: "", effectHide: "", width: 750, height: 300, Open: function () { }
                },
                addDialog: { title: "Додати запис", nameForm: "form", modal: true,  //блок для задания параметров диалога добавления записей
                    oneButText: "Зберегти", twoButText: "Скасувати",
                    effectShow: "", effectHide: "", width: 750, height: 300, Open: function () { }
                },

                delDialog: { title: "Видалити запис", modal: true,  //блок для задания параметров диалога удаления записей
                    oneButText: "Так, видалити", twoButText: "Ні",
                    contentText: "Ви впевнені що хочете видалити елемент?",
                    effectShow: "", effectHide: "", width: 350, height: 180
                },

                viewDialog: { title: "Переглянути запис", modal: true,  //блок для задания параметров диалога удаления записей
                    oneButText: "Закрити",
                    effectShow: "", effectHide: "", width: 750, height: 300
                },
                downLoadDialog: { url: "" },
                downloadButton: { alt: "Завантажити файл" },

                editButton: { alt: "Редагувати" }, // настройки кнопки редактирования в jqGrid //. Для редагування також можливо здійснити подвійний клік лівою кнопкою мишки на необхідній строчці таблиці.
                delButton: { alt: "Видалити запис" }, // настройки кнопки удаления в jqGrid                
                viewButton: { alt: "Перегляд запису. Для перегляду запису також можливо здійснити подвійний клік лівою кнопкою мишки на необхідній строчці таблиці." }, // настройки кнопки удаления в jqGrid                
                historyButton: { alt: "Переглянути історію запису" },
                userButton: { alt: "Кнопка користувача", UserFunction: function () { } },            

                // настройки кнопки удаления в jqGrid                

                setGroupHeaders: { useColSpanStyle: true },

                postData: {},

                LoadGrid: function () { },

                GridComplete: function () { },

                edit: false,

                editOff: true,

                create: false, //служебная переменная

                print: { hidden: false, caption: 'Друк', title: 'Друкь лише даних(без заголовку таблиці)', buttonicon: 'ui-icon-print', position: 'last' }, //параметры печати
                excelButton: { caption: "Експорт даних в Excel.", hidden: true, position: 'last', buttonicon: 'ui-icon-disk', url: "", ExportCurrPageOnly: false, FileName: "", ExportType: "xlsx", Template: "", HookFunction: function () { } },

                refresh: true, // показывать кнопку обновления таблицы
                
                beforeSaveEdit : function() { } // функция выполняеться перед valid и submit диалога Создания/Редактирования записи

            };

            return this.each(function () {

                $.extend(true, settings, $.jgridEx.defaults);
                $.extend(true, settings, options);              

                memory[$(this)[0].id] = settings;

                key = $(this)[0].id;

                if (settings.edit && settings.editOff == false) {

                    for (i = 0; i < settings.InitJqGrid.colModel.length; i++) {

                        if (settings.InitJqGrid.colModel[i].name == "edit") {
                            settings.InitJqGrid.colModel[i].hidden = true;
                        }

                        if (settings.InitJqGrid.colModel[i].name == "del") {
                            settings.InitJqGrid.colModel[i].hidden = true;
                        }

                        if (settings.InitJqGrid.colModel[i].name == "view") {
                            settings.InitJqGrid.colModel[i].hidden = false;
                        }
                    }

                }

                if (settings.edit == false && settings.editOff == false) {

                    for (i = 0; i < settings.InitJqGrid.colModel.length; i++) {

                        if (settings.InitJqGrid.colModel[i].name == "edit") {
                            settings.InitJqGrid.colModel[i].hidden = false;
                        }

                        if (settings.InitJqGrid.colModel[i].name == "del") {
                            settings.InitJqGrid.colModel[i].hidden = false;
                        }

                        if (settings.InitJqGrid.colModel[i].name == "view") {
                            settings.InitJqGrid.colModel[i].hidden = true;
                        }
                    }
                }

                $("#" + key).jqGrid(settings.InitJqGrid);

                if ($("#dialogDel" + $(this)[0].id)[0] == null) {
                    $(document.body).append("<div id=\"dialogDel" + $(this)[0].id + "\"></div>");
                }

                if ($("#dialogEAD" + $(this)[0].id)[0] == null) {
                    $(document.body).append("<div style = 'z-index: 6000' id = \"dialogEAD" + $(this)[0].id + "\" > </div>");
                }


            });

        },
        Reset: function () {

            var memory = new Array();
        },

        DownLoadFileIn: function (indexRow) {

            var settings = memory[$(this)[0].id];

            var keyValue = $(this).jqGrid('getCol', settings.key.name)[indexRow - 1];

            str = eval("settings.key.name") + "=" + keyValue;

            window.location.href = settings.downLoadDialog.url + "?" + str;

        },

        EditMode: function (flag) {

            if (memory[$(this)[0].id] != null) {

                key = $(this)[0].id;

                var settings = memory[key];

                if (flag != settings.edit) {

                    if (flag) {

                        memory[key].edit = flag;

                        for (i = 0; i < settings.InitJqGrid.colModel.length; i++) {

                            if (settings.InitJqGrid.colModel[i].name == "edit") {
                                settings.InitJqGrid.colModel[i].hidden = true;
                            }

                            if (settings.InitJqGrid.colModel[i].name == "del") {
                                settings.InitJqGrid.colModel[i].hidden = true;
                            }

                            if (settings.InitJqGrid.colModel[i].name == "view") {
                                settings.InitJqGrid.colModel[i].hidden = false;
                            }
                        }

                        $("#" + key).GridUnload();

                        memory[$(this)[0].id].create = false;

                        $("#" + key).jqGrid(settings.InitJqGrid);

                    }
                    else {

                        memory[key].edit = flag;

                        $("#" + key).GridUnload();

                        memory[$(this)[0].id].create = false;

                        for (i = 0; i < settings.InitJqGrid.colModel.length; i++) {

                            if (settings.InitJqGrid.colModel[i].name == "edit") {
                                settings.InitJqGrid.colModel[i].hidden = false;
                            }

                            if (settings.InitJqGrid.colModel[i].name == "del") {
                                settings.InitJqGrid.colModel[i].hidden = false;
                            }

                            if (settings.InitJqGrid.colModel[i].name == "view") {
                                settings.InitJqGrid.colModel[i].hidden = true;
                            }
                        }

                        $("#" + key).jqGrid(settings.InitJqGrid);
                    }
                }
            }
        },

        UserButtonClick: function (indexRow, indexName) {

            var settings = memory[$(this)[0].id];

            var keyValue = $(this).jqGrid('getCol', settings.key.name)[indexRow - 1];

            settings.userButton[indexName].UserFunction(keyValue);

        },

        ShowHistory: function (indexRow) {

            var settings = memory[$(this)[0].id];

            var keyValue = $(this).jqGrid('getCol', settings.key.name)[indexRow - 1];

            str = eval("settings.key.name") + "=" + keyValue;

            if (settings.historyButton.url != null) {

                $.ajax({
                    cache: false,
                    type: "GET",
                    url: settings.historyButton.url,
                    dataType: "html",
                    data: str,
                    success: function (html) {

                        $.window({
                            showModal: true,
                            modalOpacity: 0.5,
                            title: "История изменений",
                            content: html,
                            width: 800,
                            height: 400,
                            minimizable: false
                        });


                    }

                });
            }

        },

        DeleteElem: function (indexRow) {

            var settings = memory[$(this)[0].id];

            var keyValue = $(this).jqGrid('getCol', settings.key.name)[indexRow - 1];

            str = eval("settings.key.name") + "=" + keyValue;

            oneText = settings.delDialog.oneButText;
            twoText = settings.delDialog.twoButText;

            var dialog_buttons = {};

            var that = $(this);

            dialog_buttons[oneText] = function () {
                $.blockUI({ message: '<h1><img src="/Content/themes/jQueryUI/images/busy.gif" /> Зачекайте, проводиться видалення даних…</h1>' });
                $.ajax({
                    cache: false,
                    type: "GET",
                    url: settings.delDialog.url,
                    data: encodeURI(str),
                    success: function (answer) {
                        $.unblockUI();
                        if (answer.indexOf("Виникла помилка") != -1 && answer.indexOf("идалення") == -1)
                            $(this).jqGridEx("DisplayResult", answer);


                        if (answer.indexOf("ex27") != -1) // Костыль
                        {
                            $("#error").dialog({
                                resizable: false,
                                width: 250,
                                height: 'auto',
                                modal: true,
                                close: function () {
                                },
                                buttons: { "Ок": function () { $("#error").dialog('close'); } }
                            });
                        }


                        if (answer.indexOf("Виникла помилка: коректне видалення потребує") != -1) // и ещё Костыль
                        {
                            $("#error").dialog({
                                resizable: false,
                                width: 250,
                                height: 'auto',
                                modal: true,
                                close: function () {
                                },
                                buttons: { "Ок": function () { $("#error").dialog('close'); } }
                            });
                        }


                        if (answer.indexOf("Виникла помилка: Видалення запису не можливе") != -1) // и ещё Костыль
                        {
                            $("#error").dialog({
                                resizable: false,
                                width: 250,
                                height: 'auto',
                                modal: true,
                                close: function () {
                                },
                                buttons: { "Ок": function () { $("#error").dialog('close'); } }
                            });
                        }


                        for (key in memory) $("#" + key).trigger("reloadGrid");
                        $(dialog).dialog("close");
                    }

                });

            }

            dialog_buttons[twoText] = function () {
                $(dialog).dialog("close");
            }

            $("#dialogDel" + $(this)[0].id).html(settings.delDialog.contentText);
            // $(document.body).attr("style", "overflow: hidden;");
            var dialog = $("#dialogDel" + $(this)[0].id).dialog({
                title: settings.delDialog.title,
                resizable: false,
                width: settings.delDialog.width,
                height: settings.delDialog.height,
                modal: settings.delDialog.modal,
                closeOnEscape: true,
                buttons: dialog_buttons,
                show: settings.delDialog.effectShow,
                hide: settings.delDialog.effectHide,
                onsuccess: function () { alert("del"); },
                close: function () {
                    $(this).dialog('destroy').html("");
                },
                zIndex: 5000
            });

        },
        EditRow: function (indexRow) {

            var settings = memory[$(this)[0].id];

            if (settings.editDialog.url != null) {

                var keyValue = $(this).jqGrid('getCol', settings.key.name)[indexRow - 1];

                str = eval("settings.key.name") + "=" + keyValue;

                if (settings.editDialog.myFunction == null) {

                    saveText = settings.editDialog.oneButText;
                    cancelText = settings.editDialog.twoButText;

                    var dialog_buttons = {};

                    dialog_buttons[saveText] = function () {
                        if ($("#" + that[0].id).jqGridEx("SaveRecordEdit")) {

                        }
                    }

                    dialog_buttons[cancelText] = function () {
                        $("#dialogEAD" + that[0].id).dialog("close");
                    }

                    var that = $(this);

                    $.ajax({
                        cache: false,
                        type: "GET",
                        url: settings.editDialog.url,
                        dataType: "html",
                        data: str,
                        success: function (html) {

                            $("#dialogEAD" + that[0].id).html(html);

                            $("#dialogEAD" + that[0].id).keyup(function (e) {
                                if (e.keyCode == 13 && $("#" + settings.editDialog.nameForm).valid()) {

                                }
                            });

                            $("#dialogEAD" + that[0].id).dialog({ width: settings.editDialog.width, height: settings.editDialog.height, title: settings.editDialog.title, modal: settings.editDialog.modal,
                                closeOnEscape: true,
                                buttons: dialog_buttons,
                                show: settings.editDialog.effectShow,
                                hide: settings.editDialog.effectHide,
                                close: function () {
                                    $(this).dialog('destroy').html("");

                                },
                                zIndex: 5000,

                                open: function (event, ui) {

                                    settings.editDialog.Open();
                                }
                            });


                        }

                    });
                }
                else {

                    settings.editDialog.myFunction(str);
                }
            }
        },
        ViewRow: function (indexRow) {

            var settings = memory[$(this)[0].id];

            if (settings.viewDialog.url != null) {

                var keyValue = $(this).jqGrid('getCol', settings.key.name)[indexRow - 1];

                str = eval("settings.key.name") + "=" + keyValue;

                if (settings.viewDialog.myFunction == null) {

                    oneButText = settings.viewDialog.oneButText;

                    var dialog_buttons = {};

                    dialog_buttons[oneButText] = function () {
                        $("#dialogEAD" + that[0].id).dialog("close");
                    }

                    var that = $(this);

                    $.ajax({
                        cache: false,
                        type: "GET",
                        url: settings.viewDialog.url,
                        dataType: "html",
                        data: str,
                        success: function (html) {

                            $("#dialogEAD" + that[0].id).html(html);

                            $("#dialogEAD" + that[0].id).keyup(function (e) {
                                if (e.keyCode == 13) {
                                    $("#dialogEAD" + that[0].id).dialog("close");
                                }
                            });

                            $("#dialogEAD" + that[0].id).dialog({ width: settings.viewDialog.width, height: settings.viewDialog.height, title: settings.viewDialog.title, modal: settings.viewDialog.modal,
                                closeOnEscape: true,
                                buttons: dialog_buttons,
                                show: settings.viewDialog.effectShow,
                                hide: settings.viewDialog.effectHide,
                                close: function () {
                                    $(this).dialog('destroy').html("");

                                },
                                zIndex: 5000
                            });
                        }
                    });
                } else {

                    settings.viewDialog.myFunction(str);
                }
            }
        },
        SaveRecordEdit: function () {

            var settings = memory[$(this)[0].id];
            settings.beforeSaveEdit();
            if ($("#" + settings.editDialog.nameForm).valid != null) {
                if ($("#" + settings.editDialog.nameForm).valid()) {
                    $(".validation-summary-errors").html("");
                    $("#" + settings.editDialog.nameForm).submit();
                    return true;
                }
            }

            return false;

        },
        SaveRecordView: function () {

            var settings = memory[$(this)[0].id];

            if ($("#" + settings.viewDialog.nameForm).valid != null) {
                if ($("#" + settings.viewDialog.nameForm).valid()) {
                    $(".validation-summary-errors").html("");
                    $("#" + settings.viewDialog.nameForm).submit();
                    return true;
                }
            }

            return false;

        },
        SaveRecordAdd: function () {

            var settings = memory[$(this)[0].id];
            settings.beforeSaveEdit();
            if ($("#" + settings.addDialog.nameForm).valid != null) {
                if ($("#" + settings.addDialog.nameForm).valid()) {
                    $(".validation-summary-errors").html("");
                    $("#" + settings.addDialog.nameForm).submit();
                    return true;
                }
            }

            return false;

        },
        BeginResult: function () {
            $.blockUI({ message: '<h1><img src="/Content/themes/Default/images/wait18trans.gif" />Зачекайте, проводиться збереження даних…</h1>' });
        },
        DisplayResult: function (content) {

            for (key in memory) $("#" + key).trigger("reloadGrid");

            if (content.message != null) {

                if (content.staticMessage) {
                    $.unblockUI();
                    Validate(content);
                } else {

                    for (key in memory) $("#dialogEAD" + key).dialog("close");

                    $.growlUI(null, content.message);
                }
            } else {
                for (key in memory) $("#dialogEAD" + key).dialog("close");
                $.growlUI(null, content);
            }
        },
        DisplayResultNoReload: function (content) {

            for (key in memory)

                if (content.message != null) {

                    if (content.staticMessage) {
                        $.unblockUI();
                        Validate(content);
                    } else {

                        for (key in memory) $("#dialogEAD" + key).dialog("close");

                        $.growlUI(null, content.message);
                    }
                } else {
                    for (key in memory) $("#dialogEAD" + key).dialog("close");
                    $.growlUI(null, content);
                }
        },

        AddModel: function (model) {
            var settings = memory[$(this)[0].id];

            that = $(this);

            str = eval("settings.key.name") + "= 0" + settings.key.delim + '1';

            $.ajax({
                cache: false,
                type: "GET",
                url: settings.addDialog.url,
                data: str,
                success: function (html) {
                    var dialog = $('#dialogEAD' + that[0].id);

                    dialog.html(html);

                    dialog.keyup(function (e) {
                        if (e.keyCode == 13 && $("#" + settings.editDialog.nameForm).valid()) {
                        }
                    });

                    saveText = settings.addDialog.oneButText;
                    cancelText = settings.addDialog.twoButText;

                    var dialog_buttons = {};

                    dialog_buttons[saveText] = function () {
                        if (that.jqGridEx("SaveRecordAdd")) {

                        }
                    };

                    dialog_buttons[cancelText] = function () {
                        dialog.dialog("close");
                    };

                    dialog.dialog({
                        width: settings.addDialog.width,
                        height: settings.addDialog.height,
                        title: settings.addDialog.title,
                        modal: settings.addDialog.modal,
                        closeOnEscape: true,
                        buttons: dialog_buttons,
                        show: settings.addDialog.effectShow,
                        hide: settings.addDialog.effectHide,
                        zIndex: 5000,

                        close: function () {
                            $(this).dialog('destroy').html("");
                        },

                        open: function (event, ui) {
                            $.each(model, function (name, value) {
                                dialog.find('#' + name).val(value);
                            });
                            settings.addDialog.Open();
                        }
                    });
                }
            });
        },

        AddRecord: function (keyValue, keyValue2, keyValue3) {

            var settings = memory[$(this)[0].id];

            if (keyValue == null) {
                str = eval("settings.key.name") + "=0";
            } else {

                if (keyValue2 == null && keyValue3 == null) {
                    str = eval("settings.key.name") + "= 0" + settings.key.delim + keyValue;
                }

                if (keyValue2 != null && keyValue3 == null) {

                    str = eval("settings.key.name") + "= 0" + settings.key.delim + keyValue + settings.key.delim + keyValue2;
                }

                if (keyValue2 != null && keyValue3 != null) {

                    str = eval("settings.key.name") + "= 0" + settings.key.delim + keyValue + settings.key.delim + keyValue2 + settings.key.delim + keyValue3;
                }
            }

            that = $(this);

            $.ajax({
                cache: false,
                type: "GET",
                url: settings.addDialog.url,
                data: str,
                success: function (html) {

                    $("#dialogEAD" + that[0].id).html(html);                    

                    saveText = settings.addDialog.oneButText;
                    cancelText = settings.addDialog.twoButText;

                    var dialog_buttons = {};

                    dialog_buttons[saveText] = function () {
                        if (that.jqGridEx("SaveRecordAdd")) {
                        }
                    }
                    dialog_buttons[cancelText] = function () {
                        $("#dialogEAD" + that[0].id).dialog("close");
                    }

                    $("#dialogEAD" + that[0].id).dialog({ width: settings.addDialog.width, height: settings.addDialog.height,
                        title: settings.addDialog.title, modal: settings.addDialog.modal,
                        closeOnEscape: true, buttons: dialog_buttons,
                        show: settings.addDialog.effectShow,
                        hide: settings.addDialog.effectHide,
                        close: function () {
                            $(this).dialog('destroy').html("");
                        },
                        zIndex: 5000,

                        open: function (event, ui) {

                            settings.addDialog.Open();
                        }
                    });


                }
            });
        },

        Add: function (str) {

            var settings = memory[$(this)[0].id];

            that = $(this);

            $.ajax({
                cache: false,
                type: "GET",
                url: settings.addDialog.url,
                data: str,
                success: function (html) {

                    $("#dialogEAD" + that[0].id).html(html);

                    $("#dialogEAD" + that[0].id).keyup(function (e) {
                        if (e.keyCode == 13 && $("#" + settings.editDialog.nameForm).valid()) {

                        }
                    });

                    saveText = settings.addDialog.oneButText;
                    cancelText = settings.addDialog.twoButText;

                    var dialog_buttons = {};

                    dialog_buttons[saveText] = function () {

                        if (that.jqGridEx("SaveRecordAdd")) {

                        }
                    }

                    dialog_buttons[cancelText] = function () {
                        $("#dialogEAD" + that[0].id).dialog("close");
                    }

                    $("#dialogEAD" + that[0].id).dialog({ width: settings.addDialog.width, height: settings.addDialog.height,
                        title: settings.addDialog.title, modal: settings.addDialog.modal,
                        closeOnEscape: true, buttons: dialog_buttons,
                        show: settings.addDialog.effectShow,
                        hide: settings.addDialog.effectHide,
                        close: function () {
                            $(this).dialog('destroy').html("");

                        },
                        zIndex: 5000,

                        open: function (event, ui) {

                            settings.addDialog.Open();
                        }
                    });


                }
            });
        }
    };

    $.fn.jqGridEx = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jquery.jqGridEx');
        }
    };

})(jQuery);


/* **************************************Пример использования jqGridEx клиентский код *****************************************************
<link href="@Url.Content("~/Content/themes/base/jquery-ui.css")" rel="stylesheet"	type="text/css" />
<link href="@Url.Content("~/Content/themes/base/ui.jqgrid.css")" rel="stylesheet"	type="text/css" />
<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/i18n/grid.locale-ru.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery-ui.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.jqGrid.min.js")" type="text/javascript"></script>

<script src="@Url.Content("~/Scripts/jquery.blockUI.js")" type="text/javascript"></script>  

<script src="@Url.Content("~/Scripts/jquery.jqprint.0.3.js")" type = "text/javascript"></script>

<script src="@Url.Content("~/Scripts/Validation.js")" type="text/javascript"></script>

<script src="@Url.Content("~/Scripts/jquery.jqGridEx.js")" type="text/javascript"></script>

$(document).ready(function () {

        $("#list").jqGridEx("init", { InitJqGrid: { url: "/LegalPerson/FoundersData", //url для получения данных с сервера в jqGrid
            colNames: ['№ п/п', 'Орган государственной власти', 'Код ЕГРПОУ', 'Код органа управления', // заголовки столбцов jqGrid
                'Полное наименование органа управления / другого юридического лица', 'Доля в УК, %', '', '', '', '', 'objKey'],
            colModel: [
                    { name: 'number', index: 'number', width: 50, align: 'left', sortable: false }, // инициализация столбцов jqGrid
                    {name: 'isderzh', index: 'isderzh', width: 100, align: 'center' },
                    { name: 'uzkpo', index: 'uzkpo', width: 100, align: 'left', search: true },
                    { name: 'ukodu', index: 'ukodu', width: 100, align: 'left' },
                    { name: 'unam', index: 'unam', width: 100, align: 'left' },
                    { name: 'perc', index: 'perc', width: 100, align: 'left' },
                    { name: 'edit', index: 'edit', width: 50, align: 'center', sortable: false },
                    { name: 'view', index: 'view', width: 50, align: 'center', sortable: false, hidden: true },
                    { name: 'del', index: 'del', width: 50, align: 'center', sortable: false },
                    { name: 'history', index: 'history', width: 50, align: 'center', sortable: false },
                    { name: 'objKey', index: 'objKey', hidden: true }

                ],
            sortname: "unpp"

            }, // поле в таблице базы по которому нужно сортировать                
            editDialog: { url: "/LegalPerson/FoundersDialog", effectShow: "drop", effectHide: { effect: "drop", direction: "right" }, //блок для задания параметров диалога редактирования записей
                height: 260, width: 810, Open: function () { ChangeChkBox(); }, title: "Редактирование информации о учредителе"
            },

            addDialog: { url: "/LegalPerson/FoundersDialog", effectShow: "drop", effectHide: { effect: "drop", direction: "right" },   //блок для задания параметров диалога добавления записей
                height: 260, width: 810, title: "Добавить информацию о учредителе"
            },

            delDialog: { url: "/LegalPerson/DelFounder",    //блок для задания параметров диалога удаления записей
                contentText: "<span class=\"ui-icon ui-icon-alert\" style=\"float: left; margin: 0 7px 20px 0;\"></span>Вы уверенны, что хотите удалить элемент?"
            },

            viewDialog: { url: "/LegalPerson/FoundersDialog", effectShow: "drop", effectHide: { effect: "drop", direction: "right" },   //блок для задания параметров диалога добавления записей
                height: 260, width: 810, title: "Просмотр информации о учредителе"
            },

            editButton: { icoClass: "ico_more" }, // настройки кнопки редактирования в jqGrid
            delButton: { icoClass: "ico_delete" }, // настройки кнопки удаления в jqGrid}        
            viewButton: { icoClass: "butt_Search" },
            historyButton: { icoClass: "butt_Time", url: "/LegalPerson/FounderHistoryList" },
            setGroupHeaders: {
            useColSpanStyle: true,
            groupHeaders: [
	                { startColumnName: 'isderzh', numberOfColumns: 2, titleText: 'Экспертная оценка' },
                    { startColumnName: 'unam', numberOfColumns: 2, titleText: 'Дополнительное соглашение' }
                    
                ]
            }
        }
    );       

    });
    
    function SaveEnd(content) {

        $(this).jqGridEx("DisplayResult", content);
    }

    function BeginResult() {
        $(this).jqGridEx("BeginResult");
    }


 **************************************Пример использования jquery.jqGridEx серверный код *****************************************************

  #region Founders tab

        #region Founders
        /// <summary>
        /// Учредители
        /// </summary>
        /// <param name="id">идентификатор юр.лица</param>
        /// <returns></returns>
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        [AuthorizeByRoles(Roles = new[] { UserRole.Admin, UserRole.LegalSpec, UserRole.LegalExpert })]
        public ViewResult Founders(int id)
        {
            ViewData["cp_id"] = id;

            if (userInfo.IsInRole(new UserRole[] { UserRole.Admin }))
            {
                Session["IsConfirmDisplay"] = true;
                return View();
            }

            if (userInfo.IsInRole(new UserRole[] { UserRole.LegalExpert }))
            {
                Session["IsConfirmDisplay"] = true;
                return View();
            }

            if (userInfo.IsInRole(new UserRole[] { UserRole.LegalSpec }))
            {
                Session["IsConfirmDisplay"] = false;
                return View();
            }

            return View();
        }
        #endregion

        #region FoundersDialog
        /// <summary>
        /// Учредители
        /// </summary>        
        /// <param name="objKey">Составной ключ</param>        
        /// <returns></returns>
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        [AuthorizeByRoles(Roles = new[] { UserRole.Admin, UserRole.LegalSpec, UserRole.LegalExpert })]
        public ViewResult FoundersDialog(string objKey)
        {
            string separator = ";";
            string[] keys = objKey.Split(separator.ToCharArray());

            int unpp = Convert.ToInt32(keys[0]);
            int cp_id = Convert.ToInt32(keys[1]);

            if (unpp != 0)
            {
                return View(_lgpService.GetUchredById(cp_id, unpp));
            }
            else
            {
                uchred data = new uchred();

                data.cp_id = cp_id;

                return View(data);
            }
        }
        #endregion

        #region FoundersDialogHistory
        /// <summary>
        /// Показать историю учредителей
        /// </summary>        
        /// <param name="objKey">Составной ключ</param>        
        /// <returns></returns>
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        [AuthorizeByRoles(Roles = new[] { UserRole.Admin, UserRole.LegalSpec, UserRole.LegalExpert })]
        public ActionResult FoundersDialogHistory(string id, int? ver)
        {
            //Переход по объектам истории 
            // --->
            if (ver.HasValue) 
            {
                string separator = ";";
                string[] keys = id.Split(separator.ToCharArray());

                int unpp = Convert.ToInt32(keys[0]);
                int cp_id = Convert.ToInt32(keys[1]);

                ViewData["history"] = ver;

                int count = _lgpService.GetHistoryOfUchreds(Convert.ToInt32(cp_id), Convert.ToInt32(unpp)).OrderByDescending(e => e.Num).Count();
                ViewData["CountHist"] = count;
                int version = Convert.ToInt32(ver) - 1;
                if (version > 0)
                    ViewData["historyPrev"] = version;
                else
                    ViewData["historyPrev"] = ver;
                version = Convert.ToInt32(ver) + 1;
                if (version <= count)
                    ViewData["historyNext"] = version;
                else
                    ViewData["historyNext"] = ver;
            }
            //<---

           return DialogHistory(id,ver,";","FoundersDialog",_lgpService.UchredBindModel);        
        }
        #endregion

        #region FoundersData
        /// <summary>
        /// Получение найденных параметров
        /// </summary>        
        /// <param name="sidx">Параметр сортировки</param>
        /// <param name="sord">Направление сортировки</param>
        /// <param name="page">Страница</param>
        /// <param name="rows">Ряд</param>
        /// <returns></returns>        
        [AuthorizeByRoles(Roles = new[] { UserRole.Admin, UserRole.LegalSpec, UserRole.LegalExpert })]
        public JsonResult FoundersData(JQGridPostData jsonHeader, string WithoutSession)
        {
            PageManager pager = Session[lgpJSon] as PageManager;
            if (pager == null)
                pager = new PageManager(_lgpService);

            string[] url = HttpContext.Request.UrlReferrer.AbsolutePath.Split(new Char[] { '/' });

            int cp_id = Convert.ToInt32(url[url.Count() - 1]);

            IQueryable<uchred> lgpSearch = _lgpService.Repository.uchreds.Where(m => m.cp_id == cp_id).Where(m => m.ACTIV == "Y");

            object jsondata = pager.Filter(srv => lgpSearch).GetJSon(jsonHeader.Page, jsonHeader.Rows, jsonHeader.Sidx + " " + jsonHeader.Sord, data =>
                           (from item in data as IEnumerable<object>
                            where (item as uchred).cp_id == cp_id
                            select new
                            {
                                i = (item as uchred).unpp.ToString(),
                                cell = new[]
                                        {   
                                            "",
                                           (item as uchred).map_isderzh?  "{ico: 'ico_CheckBox_on'}": "{ico: 'ico_CheckBox'}",
                                           ((item as uchred).uzkpo != null)? (item as  uchred).uzkpo.ToString().Trim(): "",
                                           ((item as uchred).ukodu != null)? (item as  uchred).ukodu.ToString().Trim(): "",
                                           ((item as uchred).unam != null)? (item as  uchred).unam.ToString().Trim(): "",                                   
                                           ((item as uchred).perc != null)? (item as  uchred).perc.ToString().Trim(): "",                                            
                                           "",
                                           "",
                                           "",
                                           "",
                                           (item as uchred).unpp.ToString() + ";" + (item as uchred).cp_id.ToString()                                           
                                        }
                            }).ToArray());



            if (jsondata != null)
                Session[lgpJSon] = pager;

            return Json(jsondata, JsonRequestBehavior.AllowGet);

        }
        #endregion

        #region DelFounder
        /// <summary>
        /// Удаление элемента
        /// </summary>
        /// <param name="objKey">Составной ключ</param>        
        /// <returns></returns>
        [AuthorizeByRoles(Roles = new[] { UserRole.Admin, UserRole.LegalExpert })]
        public ContentResult DelFounder(string objKey)
        {
            string[] keys = objKey.Split(new char[] { ';' });

            int unpp = Convert.ToInt32(keys[0]);
            int cp_id = Convert.ToInt32(keys[1]);

            uchred data = _lgpService.UchredBindModel(unpp, cp_id);
            _lgpService.UchredDelete(data);
            return Content("");
        }
        #endregion

        #region ResultFounders
        /// <summary>
        /// Сохранениe uchred
        /// </summary>        
        /// <returns></returns>
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        [AuthorizeByRoles(Roles = new[] { UserRole.Admin, UserRole.LegalExpert })]
        public ActionResult ResultFounders(uchred data)
        {

            data.AVTOR = userInfo.UserName;
            if (ModelState.IsValid)
            {

                if (data.unpp != 0) { _lgpService.UchredUpdate(data); return GetJsonForValidation("Данные успешно сохранены!", false, "form"); }
                else
                {

                    _lgpService.UchredInsert(data);
                    return GetJsonForValidation("Данные успешно сохранены!", false, "form");

                }

            }
            else
            {
                return GetJsonForValidation("Произошла ошибка при сохранении!", true, "form");
            }
        }
        #endregion

        #region FounderHistoryList
        /// <summary>
        /// Просмотр информации о истории изменений основателей
        /// </summary>
        /// <param name="id">идентификатор юр.лица</param>
        /// <returns>Перечень изменений</returns>
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
        [AuthorizeByRoles(Roles = new[] { UserRole.Admin, UserRole.LegalSpec, UserRole.LegalExpert })]
        public ViewResult FounderHistoryList(string objKey)
        {
            string separator = ";";
            string[] keys = objKey.Split(separator.ToCharArray());

            int unpp = Convert.ToInt32(keys[0]);
            int cp_id = Convert.ToInt32(keys[1]);

            IQueryable<HistoryView> model = _lgpService.GetHistoryOfUchreds(cp_id, unpp).OrderByDescending(e => e.Num);//определяем модель под свой конкретный случай
            return View(Configurator.HistoryViewName, model);//вызываем общее представление для просмотра версий
        }
        #endregion

        #endregion

**************************************************Пример использования jqGridEx серверный код представления диалога FoundersDialog.cshtml добавить/редактировать********************************************

<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.propertydictMany.js")" type="text/javascript"></script> 

@model Model.Entities.Dbml.uchred

@{
    Layout = null;
}

@using (Ajax.BeginForm("ResultFounders", Model , new AjaxOptions { OnSuccess = "SaveEnd",  OnBegin = "BeginResult" }, new { id = "form" }))
{   
    
  @Html.HiddenFor(model => model.unpp);
  @Html.HiddenFor(model => model.cp_id);    
           
 <table cellpadding="0" cellspacing="0" >
        <tr>
            <td>
                 Орган государственной власти:
            </td>

            <td>                  
                 @Html.CheckBoxFor(model => model.map_isderzh)                  
            </td>
        </tr>        
        <tr>
            <td>
                Код ЕГРПОУ:
            </td>

            <td class="tb width497px">
                 @Html.TextBoxFor(model => model.uzkpo)
            </td>
        </tr>        

        <tr>
            <td>
                Код органа управления:
            </td>

            <td>
                 <table>
                    <tr valign="top">
                        <td class="tb width100px">
                            @Html.TextBoxFor(model => model.ukodu)
                        </td>
                        <td class="tb_top">
                            @Html.TextArea("kodutext", new { style = "width:320px; height:40px;" })
                        </td>
                        <td>
                            <input type="button" class="butt_ThreePoint" id="showkodu" onclick= "ShowOU();" />
                        </td>
                    
                    </tr>
                </table>                 
            </td>
        
        </tr>

        
        <tr>
            <td>
               Полное наименования органа управления / другого юридического лица:
            </td>

            <td class="tb width497px">
                 @Html.TextBoxFor(model => model.unam)
            </td>
        </tr>        
        <tr>
            <td>
               Доля в СФ, % :
            </td>

            <td class="tb width497px">
                 @Html.TextBoxFor(model => model.perc)
            </td>
        </tr>       
        
</table>    
    
    @Html.ValidationSummary()
}


**************************************************************************************************************************************************/

