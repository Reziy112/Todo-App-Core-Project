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



const translations = {
   en: {
      sidebar: {
         myTasks: 'My Tasks',
         settings: 'Settings'
      },

      tasks: {
         title: 'My Tasks',
         subtitle: 'Organize your tasks efficiently',
         placeholder: 'Type your task here...',
         addButton: 'Add',

         emptyState: {
            text: 'Empty as my motivation on Monday 😅. Let’s start adding stuff!',
         },

         filters: {
            all: 'All',
            active: 'Active',
            completed: 'Completed'
         },

         itemsLeft: {
            one: 'item left',
            other: 'items left'
         },

         addLabel: 'Add new task'
      },

      settings: {
         title: 'Settings',

         general: {
            title: 'Generals',
            language: 'Language',
            autoClear: 'Auto Clear',
            confirmDelete: 'Confirm before delete'
         },

         data: {
            title: 'Data',
            clearAll: 'Clear All Tasks',
            cleanButton: 'Clean'
         },

         info: {
            title: 'Info',
            about: 'About Us'
         }
      },

      about: {
         title: 'About this app',

         sections: {
            what: {
               title: 'What is this app',
               text: 'A simple and fast todo app that helps you keep your tasks organized without distractions. Everything is focused on clarity and ease of use.'
            },

            features: {
               title: 'What you can do',
               text: 'Add tasks, mark them as completed, and manage your daily workflow in a clean and minimal interface.'
            },

            how: {
               title: 'How it works',
               text: 'Create a task, complete it when you are done, and keep your list up to date. No extra steps, no unnecessary features.'
            }
         },

         version: 'Version'
      },

      footer: {
         copyright: '© 2026 Todo App. All rights reserved.'
      },

      modal: {
         confirm: 'Delete',
         cancel: 'Cancel',
         deleteOne: 'Delete this task?',
         deleteAll: 'Delete all tasks?'
      },

      aria: {
         editTask: 'Edit task',
         deleteTask: 'Delete task'
      },

      languages: {
         en: 'English',
         ru: 'Russian'
      },

   },

   ru: {
      sidebar: {
         myTasks: 'Мои задачи',
         settings: 'Настройки'
      },

      tasks: {
         title: 'Мои задачи',
         subtitle: 'Организуй свои задачи эффективно.',
         placeholder: 'Введите задачу...',
         addButton: 'Добавить',

         emptyState: {
            text: 'Пусто, как моя мотивация в понедельник 😅. Давай начнем что-нибудь добавлять!',
         },

         filters: {
            all: 'Все',
            active: 'Активные',
            completed: 'Завершённые'
         },

         itemsLeft: {
            one: 'осталась',
            other: 'осталось'
         },

         addLabel: 'Добавить новую задачу',
      },

      settings: {
         title: 'Настройки',

         general: {
            title: 'Общие',
            language: 'Язык',
            autoClear: 'Автоочистка',
            confirmDelete: 'Подтверждать удаление'
         },

         data: {
            title: 'Данные',
            clearAll: 'Удалить все задачи',
            cleanButton: 'Очистить'
         },

         info: {
            title: 'Инфо',
            about: 'О нас'
         }
      },

      about: {
         title: 'О приложении',

         sections: {
            what: {
               title: 'Что это за приложение',
               text: 'Простое и быстрое приложение для задач, которое помогает держать всё под контролем без лишнего шума. Всё сделано для удобства и ясности.'
            },

            features: {
               title: 'Что можно делать',
               text: 'Добавлять задачи, отмечать выполненные и управлять своим списком в чистом и минималистичном интерфейсе.'
            },

            how: {
               title: 'Как это работает',
               text: 'Создай задачу, выполни её и поддерживай список в актуальном состоянии. Без лишних шагов и перегрузки.'
            }
         },

         version: 'Версия'
      },

      footer: {
         copyright: '© 2026 Todo App. Все права защищены.'
      },

      modal: {
         confirm: 'Удалить',
         cancel: 'Отменить',
         deleteOne: 'Удалить эту задачу?',
         deleteAll: 'Удалить все задачи?'
      },

      aria: {
         editTask: 'Редактировать задачу',
         deleteTask: 'Удалить задачу'
      },

      languages: {
         en: 'Английский',
         ru: 'Русский'
      },

   }
};



// Элементы DOM
const elements = {
   html: document.documentElement,
   themeBtn: document.querySelector('.theme-toggle'),
};
