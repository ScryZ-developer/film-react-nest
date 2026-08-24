# FILM!

Онлайн-сервис бронирования билетов в кинотеатр.

- **Frontend** - React + Vite
- **Backend** - NestJS
- **База данных** - PostgreSQL (TypeORM)

API описан в `film.yml`, коллекция Postman - в `film.postman.json`.

## Быстрый старт

### 1. PostgreSQL

Установите PostgreSQL локально или запустите в Docker из корня проекта:

```bash
docker compose up -d
```

Создайте таблицы и загрузите тестовые данные:

```bash
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.init.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.films.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.shedules.sql
```

### 2. Backend

```bash
cd backend
npm ci
cp .env.example .env
npm run start:dev
```

Параметры в `.env`:

| Переменная | Описание | Пример |
|---|---|---|
| `PORT` | Порт HTTP-сервера | `3000` |
| `DATABASE_DRIVER` | Драйвер хранилища | `postgres` |
| `DATABASE_URL` | Строка подключения к PostgreSQL | `postgres://localhost:5432/prac` |
| `DATABASE_USERNAME` | Логин пользователя БД | `prac` |
| `DATABASE_PASSWORD` | Пароль пользователя БД | `prac` |

После запуска:

- API: `http://localhost:3000/api/afisha`
- Статика: `http://localhost:3000/content/afisha`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Приложение откроется на `http://localhost:5173/`.
