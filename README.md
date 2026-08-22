# FILM!

## Установка

### MongoDB

Установите MongoDB, скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker.

Импортируйте файл `backend/test/mongodb_initial_stub.json` в коллекцию `films` (MongoDB Compass → Add Data → Import JSON).

### Бэкенд

Перейдите в папку с исходным кодом бэкенда:

```bash
cd backend
```

Установите зависимости:

```bash
npm ci
```

Создайте `.env` файл из примера `.env.example` и укажите:

- `PORT` — порт HTTP-сервера, например `3000`
- `DATABASE_DRIVER` — тип хранилища, в нашем случае `mongodb`
- `DATABASE_URL` — адрес MongoDB, например `mongodb://127.0.0.1:27017/prac`

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

```bash
npm run start:debug
```

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.
