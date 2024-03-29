﻿## Веб-программирование: Лабораторная работа №3

### Что потребуется:

1. Выполненная первая и вторая лабораторная работа, не забудьте слить `lab3` с `dev`
2. [Схемы аутентификации](https://habr.com/ru/company/dataart/blog/262817/)
3. [Формат токена Json Web Tokens](https://ru.wikipedia.org/wiki/JSON_Web_Token)

### Ход выполнения:

### Client-side

1. Добавить роутер по умолчанию в `App.js`:

```jsx harmony
<Route exact path="/" render={() => <Redirect to="/me" />} />
```

2. На странице с профилем пользователя добавить вызов метода получения профиля при загрузке страницы:

```jsx harmony
    componentDidMount() {
        this.fetchUserProfile();
    }

    fetchUserProfile = async () => {
        const {setUser, history} = this.props;
        // вызова метода GET /users/me
        // в случае успешной обработки вызвать setUser
        // в случае получения Http status 401 перенаправить  пользователя на login
        // использовать await + try/catch или .then((response, err) => {})
    };
```

3. Для получения свойства `history` добавить в экспорт компонента `withRouter`:

```jsx harmony
import { withRouter } from "react-router-dom";
/*Класс компонента*/
export default withRouter(Me);
```

4. Добавить проброс кук в AJAX-запросы в файл `requester.js`:

```javascript
export default axios.create({
  baseURL: "http://localhost:1337/api",
  withCredentials: true
});
```

### Server-side

1. Объявить константу с именем куки для передачи токена в `utils/const.js`:

```javascript
const AUTH_COOKIE_NAME = "X-AUTH-COOKIE";

module.exports = {
  AUTH_COOKIE_NAME
};

// для импорта использовать const {AUTH_COOKIE_NAME} = require("../utils/const");
```

2. В `models/User.js` добавить и реализовать следующие функции:

```javascript
// https://www.npmjs.com/package/jsonwebtoken документация + примеры по библиотеке jwt

UserSchema.statics.checkAuth = () => (req, res, next) => {
  // получение токена из присланных кук, req.cookies[AUTH_COOKIE_NAME]
  // проверка токена jwt.verify (возвращает объект, который положили в getJwtToken)
  // если токен проешел проверку то
  // 1)в объект req положить объект с id пользователя req.user = {}
  // 2)вызываем функцию next()
  // иначе возвращаем 401 ошибку
};

UserSchema.methods.getJwtToken = function() {
  const { _id, login } = this;

  // сгененрировать токен, используя функцию jwt.sign,
  // секрет лежит здесь process.env.JWT_TOKEN_SECRET
};
```

3. В методы `POST /api/users` (регистрация) и `POST /api/users/login` добавить проставление куки с токеном,
   используя:

```javascript
res.cookie(AUTH_COOKIE_NAME, user.getJwtToken(), {  maxAge: /*время жизни куки в MS*/, httpOnly: true});
```

4. Добавить реализация метода `GET /api/users/me`:

```javascript
router.use("/me", User.checkAuth()); //добавление middleware, для проверки токена при каждом запросе
router.get("/me", async (req, res) => {
  //метод возвраащает профиль пользователя
  console.log("req.user me", req.user);

  const userId = req.user._id;
  if (!userId) {
    res.json({
      status: "error",
      error: "Индетификатор пользователя не найден"
    });
    return;
  }

  try {
    const user = await User.findOne({ _id: userId });
    res.json({ status: "ok", user });
  } catch (err) {
    console.error(err);
  }
});
```

5. Добавить обработку кук в CORS в `app.js`:

```javascript
app.all("/api/*", function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});
```

Для получения оценки за лабораторную работу необходимо последовательно выполнить следующие задачи:

- Реализовать перенаправление со страниц входа и/или регистрации в том случае, если пользователь залогинен - **_25-34 баллов_**
- Реализовать загрузку личных данных пользователя, реализовать перенаправление со страницы с личными данными на страницу входа, если пользователь не залогинен - **_35-44 баллов_**
- Реализовать выход из приложения - **_45-54 баллов_**

После выполнения лабораторной работы:

- Выполнить коммит
- Произвести слияние ветки `dev` с `lab3`
- Произвести слияние ветки `master` с `dev`
- Редактировать файл README.MD (описать функционал приложения)
- Выполнить коммит
- При желании залить на GitHub, последовательно выполняя команды:
  - `git remote add origin https://github.com/[your account]/[your repository]`
  - `git push -u origin [branch]` (в данном случае _branch_ - master)
