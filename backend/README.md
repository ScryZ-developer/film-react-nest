# Backend «Film!»

NestJS API афиши и бронирования билетов. Данные фильмов, сеансов и занятых мест хранятся в MongoDB.

## Настройка

1. Установите зависимости:

```bash
npm ci
```

2. Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Параметры:

| Переменная | Описание | Пример |
|---|---|---|
| `PORT` | Порт HTTP-сервера | `3000` |
| `DATABASE_DRIVER` | Драйвер: `mongodb` или `memory` | `mongodb` |
| `DATABASE_URL` | Строка подключения к MongoDB | `mongodb://localhost:27017/prac` |

3. Запустите MongoDB и импортируйте `test/mongodb_initial_stub.json` в коллекцию `films` базы из `DATABASE_URL` (Compass → Add Data → Import JSON или `mongoimport`).

## Запуск

```bash
npm run start:dev
```

Другие команды:

```bash
npm run start
npm run start:debug
npm run lint
npm run lint:fix
```

- API: `http://localhost:3000/api/afisha`
- Статика: `http://localhost:3000/content/afisha`
