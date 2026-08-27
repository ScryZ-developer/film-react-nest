# FILM!

Онлайн-сервис бронирования билетов в кинотеатр.

- **Frontend** - React + Vite
- **Backend** - NestJS
- **База данных** - PostgreSQL (TypeORM)
- **Деплой** - Docker Compose + nginx + GitHub Container Registry

API описан в `film.yml`, коллекция Postman - в `film.postman.json`.

## Ссылки

- **Приложение:** http://scryz-film.nomorepartiessite.ru
- **Репозиторий (ветка review-2):** https://github.com/ScryZ-developer/film-react-nest/tree/review-2

## Быстрый старт (локально без Docker)

### 1. PostgreSQL

```bash
docker compose up -d postgres
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

| Переменная | Описание | Пример |
|---|---|---|
| `PORT` | Порт HTTP-сервера | `3000` |
| `DATABASE_DRIVER` | Драйвер хранилища | `postgres` |
| `DATABASE_URL` | Строка подключения к PostgreSQL | `postgres://localhost:5432/prac` |
| `DATABASE_USERNAME` | Логин пользователя БД | `prac` |
| `DATABASE_PASSWORD` | Пароль пользователя БД | `prac` |
| `LOGGER_TYPE` | Формат логов: `dev`, `json`, `tskv` | `dev` |

- API: `http://localhost:3000/api/afisha`
- Статика: `http://localhost:3000/content/afisha`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Приложение: `http://localhost:5173/`.

## Логирование

Бэкенд поддерживает три логгера (`LOGGER_TYPE`):

| Значение | Класс | Назначение |
|---|---|---|
| `dev` | `DevLogger` | Цветной вывод Nest `ConsoleLogger` для разработки |
| `json` | `JsonLogger` | JSON-логи для машинной обработки |
| `tskv` | `TskvLogger` | TSKV (tab-separated key=value) |

## Тесты

```bash
cd backend
npm test
npm run lint
```

Покрыты `JsonLogger`, `TskvLogger`, а также контроллеры `FilmsController` и `OrderController`.

## Docker Compose (полный стек)

Из корня репозитория:

```bash
cp .env.example .env
docker compose up -d --build
```

После запуска:

| Сервис | URL |
|---|---|
| Приложение (nginx) | http://localhost:80 |
| pgAdmin | http://localhost:8080 |

Образы публикуются в GHCR:

- `ghcr.io/scryz-developer/film-react-nest-backend`
- `ghcr.io/scryz-developer/film-react-nest-frontend`
- `ghcr.io/scryz-developer/film-react-nest-nginx`

### Наполнение БД через pgAdmin

1. Откройте http://localhost:8080 и войдите (`PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD` из `.env`).
2. Добавьте сервер: Host `postgres`, Port `5432`, Database/User/Password из `.env`.
3. Выполните SQL из `backend/test/`: `prac.init.sql`, затем `prac.films.sql` и `prac.shedules.sql`.

Или из хоста:

```bash
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.init.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.films.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.shedules.sql
```

## Деплой на Yandex Cloud

### 1. Аккаунт и ВМ

1. Зарегистрируйтесь в [Yandex Cloud](https://console.yandex.cloud/), создайте платёжный аккаунт (грант практикума).
2. Compute Cloud - создать ВМ:
   - образ: Ubuntu 22.04 LTS
   - публичный IP
   - SSH-ключ (добавьте свой)
   - группы безопасности: входящие TCP `22`, `80` (и временно `8080` для pgAdmin)
3. Дождитесь создания и скопируйте **публичный IP**.

### 2. Домен

1. Откройте сервис учебных доменов практикума.
2. Создайте поддомен (фронтенд) и привяжите его к публичному IP ВМ.
3. Подождите пару минут, пока DNS обновится.

Текущий домен проекта: **http://scryz-film.nomorepartiessite.ru** (IP `158.160.199.240`).

### 3. Образы в GHCR

Сначала опубликуйте образы (пуш в `review-2` / `main` запустит Actions, либо локально):

```bash
docker compose build
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u ScryZ-developer --password-stdin
docker compose push
```

В GitHub - Packages сделайте пакеты **Public**.

### 4. На сервере: Docker и запуск

```bash
ssh ubuntu@158.160.199.240

sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
# перелогиньтесь по SSH

mkdir -p ~/film && cd ~/film
```

Скопируйте на сервер файлы `docker-compose.prod.yml` (переименуйте в `docker-compose.yml`) и `.env` (из `.env.example`).

```bash
docker compose pull
docker compose up -d
docker compose ps
```

Проверьте в браузере: http://scryz-film.nomorepartiessite.ru

### 5. Наполнить БД

Временно откройте порт `8080` или используйте SSH-туннель:

```bash
ssh -L 8080:localhost:8080 ubuntu@158.160.199.240
```

Откройте http://localhost:8080 - pgAdmin - подключитесь к Host `postgres` и выполните SQL из `backend/test`.

Либо с локальной машины:

```bash
scp backend/test/prac.*.sql ubuntu@158.160.199.240:~/film/
ssh ubuntu@158.160.199.240
cd ~/film
docker exec -i postgres_container psql -U prac -d prac < prac.init.sql
docker exec -i postgres_container psql -U prac -d prac < prac.films.sql
docker exec -i postgres_container psql -U prac -d prac < prac.shedules.sql
```

После наполнения закройте `8080` в firewall.

GitHub Actions (`.github/workflows/docker-publish.yml`) собирает образы и публикует их в GitHub Container Registry.
