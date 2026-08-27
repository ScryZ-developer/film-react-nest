# FILM!

Онлайн-сервис бронирования билетов в кинотеатр.

- **Frontend** - React + Vite
- **Backend** - NestJS
- **База данных** - PostgreSQL (TypeORM)
- **Деплой** - Docker Compose + nginx + GitHub Container Registry

API описан в `film.yml`, коллекция Postman - в `film.postman.json`.

## Ссылки

- **Приложение:** http://scryz-film.nomorepartiessite.ru

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
| `tskv` | `TskvLogger` | TSKV (tab-separated key=value), префикс `tskv` |

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
| pgAdmin (опционально) | http://localhost:8080 |

pgAdmin не стартует по умолчанию. Для локальной настройки БД:

```bash
docker compose --profile tools up -d pgadmin
```

Образы публикуются в GHCR:

- `ghcr.io/scryz-developer/film-react-nest-backend`
- `ghcr.io/scryz-developer/film-react-nest-frontend`
- `ghcr.io/scryz-developer/film-react-nest-nginx`

### Наполнение БД

```bash
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.init.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.films.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.shedules.sql
```

Через pgAdmin (локально, профиль `tools`): Host `postgres`, Port `5432`, учётные данные из `.env`.

## Деплой на сервер (любой VPS)

Учебный домен `*.nomorepartiessite.ru` указывает **A-запись на публичный IP сервера**. Облако может быть любым: Yandex Cloud, Selectel, Timeweb, Hetzner, DigitalOcean, Oracle Cloud Free Tier и т.д.

### 1. Сервер

- Ubuntu 22.04/24.04, публичный IPv4
- Открыты входящие TCP **22** (SSH) и **80** (сайт)
- pgAdmin **не** публикуйте в интернет (в prod compose порт закрыт)

### 2. Домен практикума

1. Создайте поддомен (фронтенд), например `scryz-film`
2. A-запись = **текущий** публичный IP сервера
3. После перезапуска ВМ с динамическим IP обновите A-запись

### 3. GHCR

Сделайте пакеты **Public** в GitHub Packages или соберите на сервере (`docker compose up --build`).

### 4. Запуск на сервере

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER
# перелогиньтесь по SSH

bash -c "$(curl -fsSL https://raw.githubusercontent.com/ScryZ-developer/film-react-nest/review-2/scripts/deploy-server.sh)"
```

Или вручную:

```bash
git clone -b review-2 https://github.com/ScryZ-developer/film-react-nest.git film
cd film
cp .env.example .env
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### 5. База и проверка

```bash
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.init.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.films.sql
docker exec -i postgres_container psql -U prac -d prac < backend/test/prac.shedules.sql
curl -s http://localhost/api/afisha/films | head
```

Сайт: http://scryz-film.nomorepartiessite.ru

### pgAdmin на сервере (только SSH-туннель)

```bash
ssh -L 8080:localhost:8080 ubuntu@ВАШ_IP
```

В `docker-compose.prod.yml` pgAdmin без публичного порта. Для разовой настройки временно поднимите туннель к контейнеру или используйте `docker exec` + SQL-файлы.

## Альтернативы без Yandex Cloud

| Вариант | Плюсы | Минусы |
|---|---|---|
| **Любой VPS + Docker** (рекомендуется) | Тот же `docker-compose.prod.yml`, домен практикума работает | Нужен сервер с белым IP |
| **Сборка на сервере из git** | Не нужен Public GHCR | Дольше, нужны ресурсы на build |
| **GitHub Actions + SSH deploy** | Автообновление после push | Настройка секретов SSH на сервере |

Не подходят для учебного домена: GitHub Pages, локальный ПК без VPS (домен не укажет на localhost), чистый serverless без постоянного IP.

GitHub Actions (`.github/workflows/docker-publish.yml`) собирает образы и публикует их в GitHub Container Registry.
