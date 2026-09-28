// Ключ, под которым данные приложения хранятся в localStorage.
const STORAGE_KEY = 'todo-app-data';



// Сохраняет persistent-данные текущего состояния приложения.
const saveState = () => {
   // Собираем только те данные, которые должны переживать перезагрузку страницы.
   const persistentData = {
      tasks: state.tasks.items, // Список задач
      settings: state.settings, // Пользовательские настройки
   };

   // Преобразуем объект в JSON-строку и сохраняем его в localStorage.
   localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentData));
};
/*
Можно мысленно читать справа налево:

persistentData — объект с тем, что хотим сохранить.
JSON.stringify(persistentData) — превращаем объект в строку.
STORAGE_KEY — имя, под которым храним данные.
setItem() — записываем строку в localStorage.
*/



// Проверяет, соответствует ли восстановленный объект базовой структуре сохранённых данных приложения.
const validateSavedData = (parsedData) => {
   // Проверяем, что полученные данные существуют,
   // являются объектом, содержат объект settings
   // и массив tasks.
   if (
      parsedData !== null &&
      typeof parsedData === 'object' &&
      typeof parsedData.settings === 'object' &&
      Array.isArray(parsedData.tasks)
   ) {
      // Если структура данных соответствует ожидаемой,
      // возвращаем true.
      return true;
   }

   // Если структура данных не соответствует ожидаемой,
   // возвращаем false.
   return false;
};
/*
Можно мысленно читать справа налево:
parsedData !== null 
           ↓
"parsedData не равен null?"
   
typeof parsedData === 'object'
            ↓
"parsedData — это объект?"

typeof parsedData.settings === 'object'
            ↓
"parsedData.settings — это объект?"

Array.isArray(parsedData.tasks)
            ↓
"parsedData.tasks — это массив?"
*/



// Восстанавливает persistent-данные из localStorage.
const restoreState = () => {
   // Получаем сохранённые данные по ключу.
   // Если данных нет, getItem() возвращает null.
   const savedData = localStorage.getItem(STORAGE_KEY);

   // Продолжаем восстановление только если сохранённые данные существуют.
   if (savedData) {
      try {
         // Преобразуем JSON-строку обратно в JavaScript-объект.
         const parsedData = JSON.parse(savedData);

         // Проверяем, соответствует ли объект базовой структуре
         // сохранённых данных приложения.
         const isValid = validateSavedData(parsedData);

         // Если сохранённые данные соответствуют ожидаемой структуре,
         // восстанавливаем их в state.
         if (isValid) {
            // Восстанавливаем сохранённый список задач.
            state.tasks.items = parsedData.tasks;

            // Восстанавливаем сохранённые настройки пользователя.
            state.settings = parsedData.settings;
         } else {
            // Если сохранённые данные не соответствуют ожидаемой структуре,
            // удаляем их из localStorage.
            // state при этом остаётся с начальными данными.
            localStorage.removeItem(STORAGE_KEY);
         }
      } catch {
         // Если JSON повреждён и не может быть распарсен,
         // удаляем некорректные данные из localStorage.
         localStorage.removeItem(STORAGE_KEY);
      }
   }
};










/*
// Проверяет одну задачу на соответствие базовой структуре.
// Функция ничего не изменяет и только возвращает true или false.
const validateTask = (task) => {

   // Проверяем тип каждого обязательного свойства задачи.
   // Все условия должны быть true одновременно.
   if (
      // Проверяем, что task является объектом и не равен null
      task !== null && typeof task === 'object' &&

      // Проверяем, что id является строкой.
      typeof task.id === 'string' &&

      // Проверяем, что text является строкой.
      typeof task.text === 'string' &&

      // Проверяем, что completed является логическим значением: true или false.
      typeof task.completed === 'boolean'
   ) {
      // Если все проверки пройдены, задача считается валидной.
      return true;
   }

   // Если хотя бы одна проверка не пройдена,
   // задача считается невалидной.
   return false;
};



const validateSettings = (settings) => {
   if (
      typeof settings.language === 'string' &&
      typeof settings.themeMode === 'string' &&
      typeof settings.autoClean === 'boolean' &&
      typeof settings.confirmDelete === 'boolean'
   ) {
      return true;
   }
   return false;
};



// Проверяет, соответствуют ли сохранённые данные
// ожидаемой структуре приложения.
const validateSavedData = (parsedData) => {
   // Проверяем, что полученные данные являются объектом
   // и не равны null.
   if (parsedData !== null && typeof parsedData === 'object') {

      // Проверяем основные части сохранённых данных:
      // их наличие, ожидаемые типы и корректность задач.
      if (
         // Проверяем, что в сохранённых данных существует свойство "tasks".
         // Object.hasOwn() проверяет наличие собственного свойства объекта.
         Object.hasOwn(parsedData, 'tasks') &&

         // Проверяем, что в сохранённых данных существует свойство "settings".
         Object.hasOwn(parsedData, 'settings') &&

         // Проверяем, что значение "tasks" действительно является массивом.
         // Array.isArray() возвращает true, если переданное значение — массив.
         Array.isArray(parsedData.tasks) &&

         // Проверяем, что значение "settings" имеет тип "object".
         // typeof возвращает тип переданного значения.
         typeof parsedData.settings === 'object' &&

         // Дополнительно проверяем, что settings не является null.
         // typeof null === 'object', поэтому одной проверки typeof недостаточно.
         parsedData.settings !== null &&

         // Проверяем каждую задачу в массиве через validateTask().
         // every() возвращает true только если все задачи прошли проверку.
         // Если хотя бы одна задача невалидна, возвращается false.
         parsedData.tasks.every(validateTask) &&

         // Проверяем объект настроек через validateSettings().
         validateSettings(parsedData.settings)
      ) {
         // Если сохранённые данные соответствуют ожидаемой структуре,
         // они проходят базовую проверку.
         return true;
      }

   }

   // Если данные не соответствуют базовой структуре,
   // считаем их невалидными.
   return false;
};



// Сохраняет persistent-данные текущего состояния приложения.
const saveState = () => {
   // Собираем только те данные, которые должны переживать перезагрузку страницы.
   const persistentData = {
      tasks: state.tasks.items, // Список задач
      settings: state.settings, // Пользовательские настройки
   };

   // Преобразуем объект в JSON-строку и сохраняем его в localStorage.
   localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentData));
};



// Восстанавливает persistent-данные из localStorage.
const restoreState = () => {
   // Получаем сохранённые данные по ключу.
   // Если данных нет, getItem() возвращает null.
   const savedData = localStorage.getItem(STORAGE_KEY);

   // Продолжаем восстановление только если сохранённые данные существуют.
   if (savedData) {
      try {
         // Преобразуем JSON-строку обратно в JavaScript-объект.
         const parsedData = JSON.parse(savedData);

         // Проверяем, соответствует ли объект базовой структуре
         // сохранённых данных приложения.
         const isValid = validateSavedData(parsedData);

         if (isValid) {
            // Если сохранённые данные соответствуют ожидаемой структуре,
            // восстанавливаем их в state.
            state.tasks.items = parsedData.tasks;

            // Восстанавливаем сохранённые настройки пользователя.
            state.settings = parsedData.settings;
         } else {
            // Если сохранённые данные не соответствуют ожидаемой структуре,
            // удаляем их из localStorage.
            // state при этом остаётся с начальными данными.
            localStorage.removeItem(STORAGE_KEY);
         }

      } catch (error) {
         // Если JSON повреждён и не может быть распарсен,
         // удаляем некорректные данные из localStorage.
         localStorage.removeItem(STORAGE_KEY);
      }
   }
};
*/


