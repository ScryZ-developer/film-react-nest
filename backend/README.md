# Backend «Film!»

API афиши на NestJS. Фильмы, сеансы и занятые места хранятся в MongoDB.

## Настройка

1. Установите зависимости:

```bash
npm ci
```

2. Скопируйте `.env.example` в `.env` и задайте параметры:

- `PORT` — порт HTTP-сервера
- `DATABASE_DRIVER` — `mongodb` или `memory`
- `DATABASE_URL` — строка подключения к MongoDB, например `mongodb://localhost:27017/prac`

3. Запустите MongoDB и импортируйте `test/mongodb_initial_stub.json` в коллекцию `films` выбранной базы (Compass → Add Data → Import JSON).

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

После запуска API доступно по адресу `http://localhost:3000/api/afisha`, статика — `http://localhost:3000/content/afisha`.
