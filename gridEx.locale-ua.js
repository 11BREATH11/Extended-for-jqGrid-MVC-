(function ($) {

    $.jgridEx = {};

    $.jgridEx.defaults = {        
                editDialog: { title: "Редагувати запис" , oneButText: "Зберегти", twoButText: "Скасувати"},
                addDialog: { title: "Додати запис", oneButText: "Зберегти", twoButText: "Скасувати"},
                delDialog: { title: "Видалити запис", oneButText: "Так, видалити", twoButText: "Ні", contentText: "Ви впевнені що хочете видалити елемент?" },
                viewDialog: { title: "Переглянути запис", oneButText: "Закрити"},                
                downloadButton: { alt: "Завантажити файл" },
                editButton: { alt: "Редагувати" }, 
                delButton: { alt: "Видалити запис" }, 
                viewButton: { alt: "Перегляд запису. Для перегляду запису також можливо здійснити подвійний клік лівою кнопкою мишки на необхідній строчці таблиці." },
                historyButton: { alt: "Переглянути історію запису" },                
                print: { caption: 'Друк', title: 'Друкь лише даних(без заголовку таблиці)'},
                excelButton: { caption: "Експорт даних в Excel."}
            };
       
})(jQuery);