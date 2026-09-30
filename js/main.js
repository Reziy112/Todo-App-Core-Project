const init = () => {
   restoreState();
   render();
}



// ********** Переключение темы **********

// Обновляет тему приложения в зависимости от текущего значения themeMode.
const renderTheme = () => {
   // Получаем текущий режим темы из state.
   const themeMode = state.settings.themeMode;

   // Получаем корневой HTML-элемент документа.
   const html = elements.html;

   // Если выбран светлый режим,
   // устанавливаем html элементу, атрибут data-theme со значением light.
   if (themeMode === 'light') {
      html.setAttribute('data-theme', 'light');
   }

   // Если выбран тёмный режим,
   // устанавливаем html элементу, атрибут data-theme со значением dark.
   else if (themeMode === 'dark') {
      html.setAttribute('data-theme', 'dark');
   }

   // Если выбран системный режим,
   // удаляем у html элемента, атрибут data-theme.
   // В этом случае тему определяют браузер и CSS
   // на основе системных настроек пользователя.
   else {
      html.removeAttribute('data-theme');
   }
};
/**
Можно мысленно читать сверху вниз:

themeMode
    ↓
какой режим выбран?
    ↓
light → data-theme="light"
dark  → data-theme="dark"
system → data-theme удаляется

После этого CSS самостоятельно применяет
соответствующую цветовую схему.
*/



// Общая функция рендера приложения.
//  Запускает отдельные render-функции,которые синхронизируют состояние приложения с DOM.
const render = () => {
   // Обновляет тему приложения в соответствии
   // с текущим значением themeMode в state.
   renderTheme();
   renderTranslations();
};


// Обрабатывает нажатие кнопки переключения темы.
const handleThemeToggle = () => {

   // Создаём объект MediaQueryList для проверки
   // текущей системной цветовой схемы браузера.
   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

   // Если приложение находится в системном режиме,
   // определяем тему, которую сейчас использует система.
   if (state.settings.themeMode === 'system') {

      // Если системная тема тёмная,
      // после нажатия переключаем приложение на светлую тему.
      if (prefersDark.matches) {
         state.settings.themeMode = 'light';

         // Если системная тема светлая,
         // после нажатия переключаем приложение на тёмную тему.
      } else {
         state.settings.themeMode = 'dark';
      };

      // Если сейчас выбрана светлая тема,
      // переключаем приложение на тёмную тему.
   } else if (state.settings.themeMode === 'light') {
      state.settings.themeMode = 'dark';

      // Если сейчас выбрана тёмная тема,
      // переключаем приложение на светлую тему.
   } else if (state.settings.themeMode === 'dark') {
      state.settings.themeMode = 'light';
   }

   // Сохраняем изменённое состояние приложения
   // в localStorage.
   saveState();

   // Повторно рендерим приложение,
   // чтобы изменения state отобразились в DOM.
   render();
};


// Добавляем обработчик клика на кнопку переключения темы.
// При нажатии браузер вызывает handleThemeToggle().
elements.themeBtn.addEventListener('click', handleThemeToggle);



// ********** Смена языков **********

// Обновляет текстовые значения всех элементов интерфейса,
// у которых в HTML указан атрибут data-i18n.

// Общая задача функции:
// 1. Узнать выбранный язык.
// 2. Найти все элементы, которые нужно перевести.
// 3. Получить ключ перевода каждого элемента.
// 4. Найти по этому ключу нужный текст в объекте translations.
// 5. Записать найденный перевод обратно в DOM.
const renderTranslations = () => {

   // Находим все элементы DOM, у которых есть атрибут data-i18n.

   // Например:
   // <h1 data-i18n="tasks.title"></h1>
   // <button data-i18n="tasks.addButton"></button>

   // querySelectorAll() возвращает коллекцию всех найденных элементов.
   const translationElements = document.querySelectorAll('[data-i18n]');

   // Получаем текущий выбранный язык из state.

   // Например:
   // state.settings.language → "en"
   // или
   // state.settings.language → "ru"
   const lang = state.settings.language;

   // Получаем объект переводов именно выбранного языка.

   // Если:
   // lang = "en"

   // тогда:
   // translations[lang] → translations["en"]

   // Если:
   // lang = "ru"

   // тогда:
   // translations[lang] → translations["ru"]
   const langTranslations = translations[lang];

   // Проходим по каждому найденному DOM-элементу.

   // На каждой итерации переменная element
   // содержит один конкретный элемент.
   translationElements.forEach(element => {

      // Получаем значение атрибута data-i18n
      // у текущего элемента.

      // Например, если HTML содержит:

      // data-i18n="tasks.title"  тогда:
      // key → "tasks.title"
      const key = element.getAttribute('data-i18n');

      // Разделяем ключ на отдельные части по точке.

      // Например:

      // "tasks.title"
      //        ↓
      // ["tasks", "title"]

      // А:

      // "settings.general.language"
      //        ↓
      // ["settings", "general", "language"]

      // Эти части нужны, чтобы последовательно пройти
      // по вложенным объектам translations.
      const keyParts = key.split('.');

      // В качестве начального значения translation
      // берём весь объект переводов выбранного языка.

      // Например:

      // translation → translations["en"]

      // Пока мы ещё не знаем конкретный текст.
      // Поэтому начинаем с корня объекта переводов
      // и дальше будем постепенно двигаться внутрь него.

      // Здесь используется let, потому что значение translation
      // будет изменяться внутри следующего цикла.
      let translation = langTranslations;

      // Проходим по каждой части ключа.

      // Например, если:

      // keyParts = ["tasks", "title"]
      // цикл выполнится два раза:

      // 1-й проход → part = "tasks"
      // 2-й проход → part = "title"
      keyParts.forEach(part => {

         // Проверяем, существует ли текущее значение translation.        
         // Это защита от ошибки.

         // Если на каком-то этапе нужное свойство не существует,
         // translation может стать undefined.

         // В таком случае мы не пытаемся продолжать
         // обращаться к следующему уровню объекта.
         if (translation) {

            // Переходим на следующий уровень объекта.

            // part содержит имя свойства, поэтому используем
            // квадратные скобки.

            // Например:

            // translation
            //     ↓
            // translation["tasks"]

            // затем:

            // translation
            //     ↓
            // translation["title"]

            // В результате получаем конечный текст перевода.
            translation = translation[part];
         }
      });

      // Проверяем, удалось ли найти перевод.

      // Если перевод не найден, translation может быть undefined.      
      // В таком случае используем сам key.

      // Например:

      // key = "tasks.unknown"

      // Если такого перевода нет,
      // вместо пустого значения покажем:     
      // "tasks.unknown"

      // Это также помогает заметить ошибку в ключе перевода.
      if (!translation) {
         translation = key;
      }

      // Проверяем тип текущего HTML-элемента.

      // INPUT обрабатывается отдельно,
      // потому что текст подсказки у input находится
      // не в textContent, а в свойстве placeholder.
      if (element.tagName === 'INPUT') {

         // Записываем найденный перевод
         // в placeholder текущего input.
         // Например:
         // translation → "Type your task here..."
         // результат:
         // input.placeholder → "Type your task here..."
         element.placeholder = translation;

      } else {

         // Для всех остальных элементов записываем перевод
         // как обычное текстовое содержимое элемента.

         // Например:

         // <h1 data-i18n="tasks.title"></h1>         
         // превращается в:         
         // <h1 data-i18n="tasks.title">My Tasks</h1>
         element.textContent = translation;
      }
   });
};
/*
renderTranslations()
│
├── Найти элементы с data-i18n
│
├── Узнать текущий язык
│
├── Получить translations[язык]
│
└── Для каждого элемента
    │
    ├── Получить data-i18n
    │
    ├── Разделить ключ по "."
    │
    ├── Пройти по вложенному объекту
    │
    ├── Если перевода нет → использовать key
    │
    └── Записать перевод в DOM
        │
        ├── INPUT → placeholder
        └── остальные → textContent
*/










init();


