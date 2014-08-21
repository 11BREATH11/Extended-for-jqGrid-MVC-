(function ($) {

    $.jgridEx = {};

    $.jgridEx.defaults = {             
        editDialog: { title: "Редактировать запись",oneButText: "Сохранить", twoButText: "Отмена"},
        addDialog: { title: "Добавить запись",oneButText: "Сохранить", twoButText: "Отмена"},
        delDialog: { title: "Удалить запись", oneButText: "Да, удалить", twoButText: "Нет", contentText: "Вы уверенны, что хотите удалить элемент?"},
        viewDialog: { title: "Просмотреть запись",oneButText: "Закрыть"},        
        downloadButton: { alt: "Скачать файл" },
        editButton: { alt: "Редактирование записи. Для редактирования также возможно двойное нажатие левой кнопки мыши на требуемой строке таблицы." },
        delButton: { alt: "Удалить запись." }, 
        viewButton: { alt: "Просмотреть запись. Просмотреть запись также можно двойным кликом мышки на требуемой колонке таблицы." }, 
        historyButton: { alt: "Просмотреть историю записи." }        
    };
})(jQuery);