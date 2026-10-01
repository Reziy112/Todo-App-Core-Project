// ********** Запуск приложения **********

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


// Синхронизирует элемент <select> языка с текущим значением
// state.settings.language.
// Функция получает язык из state и устанавливает соответствующее
// значение для <select>, чтобы DOM отражал текущее состояние приложения.
const renderSettings = () => {
   // Получаем текущий выбранный язык из state.
   // Это значение является источником истины для настроек приложения.
   const currentLang = state.settings.language;

   // Устанавливаем значение <select> равным языку из state.
   // Браузер автоматически выбирает <option>,
   // у которого значение value совпадает с currentLang.
   elements.selectLang.value = currentLang;
};


// Обрабатывает изменение выбранного языка в элементе <select>.
// Получает новое значение языка из DOM, записывает его в state,
// сохраняет изменённое состояние в localStorage
// и повторно отрисовывает интерфейс, чтобы применить новый язык.
const handleLanguageChange = (e) => {
   // Получаем значение выбранного пользователем <option>
   // из элемента <select>.
   const selectedLanguage = e.target.value;

   // Обновляем язык в state.
   // Теперь state.settings.language содержит язык,
   // который выбрал пользователь.
   state.settings.language = selectedLanguage;

   // Сохраняем изменённое состояние в localStorage,
   // чтобы выбранный язык сохранился после перезагрузки страницы.
   saveState();

   // Повторно отрисовываем интерфейс приложения.
   // Во время render() renderTranslations() обновит тексты,
   // а renderSettings() синхронизирует <select> со значением из state.
   render();
};

// Подписываем функцию handleLanguageChange на событие change.
// Когда пользователь выбирает другой язык в <select>,
// браузер вызывает handleLanguageChange.
elements.selectLang.addEventListener('change', handleLanguageChange);







// ********** Sidebar **********

// Обновляет состояние sidebar в DOM
// на основе текущего значения state.ui.sidebarOpen.
const renderSidebar = () => {

   // Получаем текущее состояние sidebar из state.

   // true  → sidebar должен быть открыт
   // false → sidebar должен быть закрыт
   const sidebarState = state.ui.sidebarOpen;

   // Синхронизируем состояние sidebar с DOM.
   // Устанавливаем атрибут data-open на sidebar.
   //
   // true  → data-open="true"  → sidebar открыт
   // false → data-open="false" → sidebar закрыт
   //
   // CSS использует этот атрибут для отображения
   // соответствующего состояния sidebar.
   elements.sidebar.setAttribute('data-open', sidebarState);

   // Синхронизируем состояние overlay с DOM.
   //
   // true  → data-open="true"  → overlay отображается
   // false → data-open="false" → overlay скрыт
   //
   // CSS использует этот атрибут для показа или скрытия overlay.
   elements.overlay.setAttribute('data-open', sidebarState);

   // Обновляем ARIA-атрибут кнопки меню.
   //
   // aria-expanded сообщает вспомогательным технологиям,
   // открыт ли сейчас sidebar.
   //
   // true  → sidebar открыт
   // false → sidebar закрыт.
   elements.menuBtn.setAttribute('aria-expanded', sidebarState);

};


// Меняет состояние sidebar и вызывает render.
const handleMenuToggle = () => {
   // инвертируем состояние:
   // если было true → станет false
   // если было false → станет true
   state.ui.sidebarOpen = !state.ui.sidebarOpen;

   // после изменения state — обновляем интерфейс
   // (показываем или скрываем sidebar)
   render();
};

// Закрывает sidebar по Escape, если он открыт.
const handleEscape = (e) => {

   // если нажата НЕ клавиша Escape — ничего не делаем
   if (e.key !== 'Escape') return;

   // если sidebar уже закрыт — ничего не делаем
   if (!state.ui.sidebarOpen) return;

   // закрываем sidebar (меняем состояние)
   state.ui.sidebarOpen = false;

   // после изменения state — обновляем интерфейс
   render();

   // Снимаем фокус с кнопки меню после закрытия sidebar по Escape.
   // После нажатия Escape браузер может оставить фокус
   // на кнопке меню. Убираем его, чтобы кнопка не оставалась
   // визуально сфокусированной после закрытия sidebar.
   elements.menuBtn.blur();
};

// Закрывает sidebar по клику на overlay.
const handleOverlayClick = () => {
   // если sidebar уже закрыт — ничего не делаем
   if (!state.ui.sidebarOpen) return;

   // закрываем sidebar (меняем состояние)
   state.ui.sidebarOpen = false;

   // после изменения state — обновляем интерфейс
   render();
};


// Клик по кнопке меню
elements.menuBtn.addEventListener('click', handleMenuToggle);

// Закрытие sidebar по overlay
elements.overlay.addEventListener('click', handleOverlayClick);

// Закрытие sidebar по Escape
document.addEventListener('keydown', handleEscape);



// ********** Переключение экранов **********

// Синхронизирует отображение экранов приложения с текущим состоянием state.
// Определяет, какой экран должен быть активным, и добавляет is-active только ему,
// одновременно удаляя этот класс у остальных экранов.
const renderScreen = () => {
   // Получаем все элементы экранов, чтобы проверить каждый из них
   // и привести его активное состояние в соответствие с state.
   const screens = document.querySelectorAll('.screen');

   // Получаем из state имя экрана, который в данный момент должен быть активным.
   const currentScreen = state.ui.currentScreen;

   // Проверяем каждый экран и определяем, должен ли он быть активным.
   screens.forEach(screen => {
      // Получаем имя экрана из data-screen, чтобы сравнить его
      // со значением текущего экрана из state.
      const screenName = screen.dataset.screen;

      // Если имя DOM-экрана совпадает с текущим экраном в state,
      // делаем этот экран активным.
      if (screenName === currentScreen) {
         screen.classList.add('is-active');
      } else {
         // Если экран не является текущим, убираем is-active,
         // чтобы одновременно активным оставался только нужный экран.
         screen.classList.remove('is-active');
      }
   });
};




// Общая функция рендера приложения.
//  Запускает отдельные render-функции,которые синхронизируют состояние приложения с DOM.
const render = () => {

   // Обновляем тему приложения
   // в соответствии с текущим themeMode в state.
   renderTheme();

   // Обновляем тексты интерфейса
   // в соответствии с выбранным языком в state.
   renderTranslations();

   // Обновляем элементы настроек
   // в соответствии с текущими настройками в state.
   renderSettings();

   // Обновляем экраны
   // в соответствии с выбранным экраном в state.
   renderScreen();

   // Обновляем состояние sidebar
   // в соответствии с sidebarOpen в state.
   renderSidebar();
};










init();


