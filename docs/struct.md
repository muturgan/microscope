# Microscope — структура проекта

```text
microscope/
├── .editorconfig                           — Настройки отступов и форматирования для редакторов
├── .env                                    — Локальный порт Vite-сервера (VITE_PORT, gitignored)
├── .gitignore                              — Исключения Git: node_modules, dist, .env и служебные файлы
├── .pi-lsp.json                            — Конфигурация LSP для автоматического запуска TypeScript-сервера
├── .prettierrc                             — Правила форматирования Prettier: табы, одинарные кавычки, trailing comma
├── .vscode/
│   └── settings.json                       — Настройки VS Code: локальный TypeScript SDK, автоисправления ESLint, относительные импорты
├── AGENTS.md                               — Навигация для AI-агентов: какие документы и в каких случаях читать
├── eslint.config.mjs                       — ESLint-конфигурация: TypeScript, Preact/React, Prettier, сортировка импортов
├── docs/
│   ├── arch.md                             — Технические архитектурные решения: stores, React Flow, компоненты, API
│   ├── domain.md                           — Бизнес-правила: иерархия карточек, kind, чередование, удаление
│   ├── stack.md                            — Версии технологий, библиотек и инструментов разработки
│   ├── storage.md                          — localStorage, JSON-формат, импорт/экспорт и валидация
│   ├── struct.md                           — Структура проекта и описание файлов
│   ├── style.md                            — Соглашения о CSS, дизайн-токенах, единицах, тултипах и состояниях
│   └── testing.md                          — Автоматические проверки и ручные сценарии тестирования
├── index.html                              — HTML-точка входа Vite: body (корневой контейнер и блок оболочки) и загрузка src/main.tsx
├── package-lock.json                       — Зафиксированное дерево npm-зависимостей
├── package.json                            — Манифест проекта, npm-скрипты и зависимости Preact, React Flow, nanostores
├── README.md                               — Описание проекта, установка и запуск локальной разработки
├── tsconfig.json                           — TypeScript-конфигурация: strict mode, Preact JSX, алиасы react → preact/compat
├── vite.config.js                          — Конфигурация Vite: Preact, dev-сервер, HMR, aliases и production-сборка
└── src/
    ├── main.tsx                            — Точка входа приложения: подключение стилей и render(<App />, document.body)
    ├── app.tsx                             — Оркестратор приложения: stores, состояние модалок, обработчики CRUD/импорта/сохранения/сброса
    ├── style.css                            — Глобальные стили: дизайн-токены, карточки, React Flow, формы, тултипы, адаптивность
    ├── vite-env.d.ts                       — Ambient-типы Vite
    ├── config/
    │   └── cardUi.ts                       — UI-конфигурация карточек: подписи kind, примеры названий, placeholder’ы, настройки редактирования/удаления
    ├── components/
    │   ├── AppHeader.tsx                   — Шапка: название и inline-редактирование сеттинга, счётчик периодов, кнопки сброса и сохранения
    │   ├── CardFlow.tsx                    — Построение React Flow nodes/edges и отрисовка графа периодов
    │   ├── cards/
    │   │   ├── CardActionButtons.tsx       — Общие кнопки действий: добавление, редактирование и удаление
    │   │   ├── SceneCard.tsx               — Карточка сцены с вложенными действиями и кнопкой добавления следующей сцены
    │   │   ├── EventCard.tsx               — Карточка события, список вложенных сцен и кнопки добавления события/сцены
    │   │   └── PeriodNode.tsx              — React Flow-узел периода: карточка периода, события, сцены и nodeTypes
    │   └── forms/
    │       ├── CardFields.tsx              — Переиспользуемые поля названия и типа карточки с автофокусом
    │       ├── CardForm.tsx                — Универсальная модалка создания/редактирования карточки
    │       ├── ConfirmModal.tsx            — Универсальное модальное окно подтверждения действия
    │       ├── DeleteConfirmModal.tsx      — Подтверждение удаления периода/события/сцены с описанием каскадного удаления
    │       └── InitialPeriodsForm.tsx      — Стартовая модалка: название сеттинга, два периода и импорт JSON
    ├── stores/
    │   ├── cards.ts                        — Barrel-файл публичного API stores
    │   ├── cardsStore.ts                   — Atoms состояния, инициализация/замена/сброс, подписка на автосохранение в localStorage
    │   ├── cardFactories.ts                — Фабрики создания периодов, событий и сцен с уникальными id
    │   ├── periodActions.ts                — Операции с периодами: вставка, обновление, удаление, правило чередования kind
    │   ├── eventActions.ts                 — Операции с событиями: добавление, обновление, удаление
    │   └── sceneActions.ts                 — Операции со сценами: добавление, обновление, удаление
    ├── types/
    │   └── card.ts                         — Типы домена: CardKind/CardType, ICard, IPeriodCard, IEventCard, ISceneCard, React Flow node data
    └── utils/
        ├── localState.ts                   — Автосохранение состояния в localStorage, загрузка при старте и очистка
        └── stateFile.ts                    — JSON-экспорт/импорт состояния, валидация файла, File System Access API и fallback-скачивание
```

`node_modules/` и `dist/` не включены в структуру, так как являются генерируемыми каталогами.
