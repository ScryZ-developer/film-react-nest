# FILM!

Онлайн-сервис бронирования билетов в кинотеатр.

- **Frontend** — React + Vite
- **Backend** — NestJS
- **База данных** — MongoDB (mongoose)

API описан в `film.yml`, коллекция Postman — в `film.postman.json`.

## Быстрый старт

### 1. MongoDB

Установите MongoDB локально или запустите в Docker:

```bash
docker run -d --name film-mongo -p 27017:27017 mongo:latest
```

Импортируйте тестовые данные из `backend/test/mongodb_initial_stub.json` в коллекцию `films` базы `prac`:

- через MongoDB Compass: Add Data → Import JSON;
- или через `mongoimport`:

```bash
docker cp backend/test/mongodb_initial_stub.json film-mongo:/tmp/films.json
docker exec film-mongo mongoimport --db prac --collection films --file /tmp/films.json --jsonArray --drop
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
| `DATABASE_DRIVER` | Драйвер хранилища | `mongodb` |
| `DATABASE_URL` | Строка подключения к MongoDB | `mongodb://localhost:27017/prac` |

После запуска:

- API: `http://localhost:3000/api/afisha`
- Статика: `http://localhost:3000/content/afisha`

Полезные команды:

```bash
npm run start
npm run start:dev
npm run start:debug
npm run lint
npm run lint:fix
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Параметры в `.env`:

| Переменная | Описание | Пример |
|---|---|---|
| `VITE_API_URL` | URL API бэкенда | `http://localhost:3000/api/afisha` |
| `VITE_CDN_URL` | URL статики (постеры) | `http://localhost:3000/content/afisha` |

Приложение откроется на `http://localhost:5173/`. Vite проксирует `/api` и `/content` на бэкенд.

## API

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/afisha/films/` | Список фильмов |
| `GET` | `/api/afisha/films/:id/schedule/` | Расписание сеансов фильма |
| `POST` | `/api/afisha/order/` | Бронирование билетов |
| `GET` | `/content/afisha/*` | Статические файлы (афиши) |

## Структура

```text
film-react-nest/
├── backend/          # NestJS API
│   ├── public/       # Статика (постеры)
│   ├── src/
│   │   ├── films/    # Контроллер, сервис, DTO
│   │   ├── order/    # Контроллер, сервис, DTO
│   │   └── repository/
│   └── test/         # Stub-данные и e2e
└── frontend/         # React-клиент
```
