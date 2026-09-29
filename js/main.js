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
// Запускает отдельные render-функции,
// которые синхронизируют состояние приложения с DOM.
const render = () => {
   // Обновляет тему приложения в соответствии
   // с текущим значением themeMode в state.
   renderTheme();
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











init();


