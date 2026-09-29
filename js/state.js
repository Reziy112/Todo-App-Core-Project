// Начальное состояние приложения.
// Используется как основа для создания рабочего state.
const initialState = {
   // Состояние задач и списка задач.
   tasks: {
      items: [], // Массив задач
      filter: 'all', // Текущий фильтр задач
   },

   // Временное состояние интерфейса.
   // Эти данные не сохраняются в localStorage.
   ui: {
      currentScreen: 'tasks', // Экран, открываемый при запуске
      sidebarOpen: false, // Sidebar закрыт при запуске
      modal: null, // Открытое модальное окно отсутствует
      modalData: null, // Данные для модального окна отсутствуют
   },

   // Пользовательские настройки.
   // Эти данные будут сохраняться в localStorage.
   settings: {
      language: 'en', // Язык приложения по умолчанию
      themeMode: 'system', // Режим темы по умолчанию
      autoClean: false, // Автоматическая очистка выключена
      confirmDelete: false, // Подтверждение удаления выключено
   },
};

// Рабочее состояние приложения.
// Создаём независимую копию initialState,
// чтобы изменения state не изменяли initialState.
// Теперь state содержит те же начальные значения, но является независимой копией.
const state = structuredClone(initialState);
/*
structuredClone() — это встроенная функция JavaScript, которая создаёт глубокую независимую копию значения.Она копирует объект вместе с его вложенными объектами.
*/



// Элементы DOM
const elements = {
   html: document.documentElement,
   themeBtn: document.querySelector('.theme-toggle'),
};
