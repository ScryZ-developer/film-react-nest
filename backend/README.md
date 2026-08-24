# Backend «Film!»

NestJS API афиши и бронирования билетов. Данные фильмов, сеансов и занятых мест хранятся в PostgreSQL через TypeORM.

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
| `DATABASE_DRIVER` | Драйвер: `postgres` | `postgres` |
| `DATABASE_URL` | Строка подключения к PostgreSQL | `postgres://localhost:5432/prac` |
| `DATABASE_USERNAME` | Логин пользователя БД | `prac` |
| `DATABASE_PASSWORD` | Пароль пользователя БД | `prac` |

3. Запустите PostgreSQL и выполните SQL из `test/`:

```bash
docker compose up -d
docker exec -i postgres_container psql -U prac -d prac < test/prac.init.sql
docker exec -i postgres_container psql -U prac -d prac < test/prac.films.sql
docker exec -i postgres_container psql -U prac -d prac < test/prac.shedules.sql
```

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

После запуска API доступно по адресу `http://localhost:3000/api/afisha`, статика - `http://localhost:3000/content/afisha`.
