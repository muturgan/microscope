# Стек проекта Microscope

Документ фиксирует используемые технологии, библиотеки и их версии.

Версии соответствуют `package.json` и `package-lock.json`.

## Runtime-зависимости

| Технология | Версия | Роль |
| --- | --- | --- |
| Preact | `^11.0.1` | UI-фреймворк |
| `@xyflow/react` | `^12.12.0` | Визуализация графа |
| `nanostores` | `^1.5.5` | Глобальное состояние |
| `@nanostores/preact` | `^1.1.1` | Интеграция nanostores с Preact |
| `preact-router` | `^4.1.2` | Объявлен, но в текущей версии не используется |

## Инструменты разработки и сборки

| Технология | Версия | Роль |
| --- | --- | --- |
| Vite | `^8.3.4` | Dev-сервер и сборка |
| `@preact/preset-vite` | `^2.10.6` | Интеграция Preact с Vite |
| TypeScript | `^6` | Статическая типизация |
| `typescript-eslint` | `^8.71.2` | TypeScript-правила ESLint |
| esbuild | `^0.28.2` | Транспиляция и минификация CSS |
| terser | `^5.51.2` | Минификация JavaScript |
| ESLint | `^9.7` | Линтинг |
| `@eslint/js` | `^10.0.1` | Базовые правила ESLint |
| `eslint-config-prettier` | `^10.1.8` | Отключение конфликтующих правил ESLint |
| `eslint-plugin-node-import` | `^1.2.0` | Проверка Node-импортов |
| `eslint-plugin-prettier` | `^5.5.7` | Prettier как правило ESLint |
| `eslint-plugin-react` | `^7.37.5` | Правила JSX/React-совместимого кода |
| `eslint-plugin-simple-import-sort` | `^12.1.1` | Сортировка импортов |
| Prettier | `^3.9.10` | Форматирование кода |

## Документация

- [Навигация для AI-агентов](../AGENTS.md)
- [Архитектурные решения](./arch.md)
- [Доменные правила](./domain.md)
- [Хранение и формат состояния](./storage.md)
- [Соглашения о стилизации](./style.md)
- [Проверка проекта](./testing.md)
- [Структура проекта](./struct.md)
- [Запуск и сборка](../README.md)
