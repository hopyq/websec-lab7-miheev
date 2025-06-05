# Задание: Поиск и устранение уязвимостей в веб-приложении

## Выполнение задания

1. Уязвимость: SQL-инъекция в аутентификации
Угроза: Ввод ' UNION SELECT username, password FROM users -- раскрывает все учетные данные
Причина: Конкатенация строк в SQL-запросе
Исправление: Переход на параметризованные запросы в index.js:
```bash
query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
```
На этот:
```bash
const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Ошибка сервера" });
      }
      if (!user) {
        return res.status(401).json({ error: "Неверные данные" });
      }
      res.json({ message: "Успешный вход", user });
    });
```

2. Уязвимость: SQL-инъекция при обновлении профиля
Эксплуатация: Ввод ' UNION SELECT username, password FROM users -- в поле имени приводит к выполнению произвольного SQL-кода
Причина: Прямая вставка пользовательских данных в UPDATE-запрос
Исправление: В файле index.js заменяем уязвимый код на параметризованный запрос
```bash
app.post("/users/update", (req, res) => {
    const { id, username } = req.body
    db.run(
        `UPDATE users SET username = '${username}' WHERE id = ${id}`,
        function (err) {
            if (err) return res.status(500).json({ error: "Ошибка сервера" })
            res.json({ message: "Имя пользователя обновлено" })
        }
    )
})
```
На этот:
```bash
db.run(
    `UPDATE users SET username = ? WHERE id = ?`,
    [username, id],
    function (err) {
        if (err) return res.status(500).json({ error: "Ошибка сервера" });
        res.json({ message: "Имя пользователя обновлено" });
    }
);
```

3. Уязвимость: SQL-инъекция при регистрации пользователей
Эксплуатация: Ввод ' UNION SELECT username, password FROM users -- в поле логина приводит к выполнению произвольного SQL-запроса
Причина: Прямая подстановка пользовательского ввода в SQL-запрос
Исправление: В файле index.js заменяем уязвимый код на параметризованный запрос
```bash
app.post("/messages", (req, res) => {
    const { user_id, content } = req.body
    db.run(
        `INSERT INTO messages (user_id, content) VALUES (${user_id}, '${content}')`,
        function (err) {
            if (err) return res.status(500).json({ error: "Ошибка сервера" })
            res.json({ message: "Сообщение отправлено", id: this.lastID })
        }
    )
})
```
На этот:
```bash
db.run(
    `INSERT INTO messages (user_id, content) VALUES (?, ?)`,
    [user_id, content],
    function (err) {
        if (err) return res.status(500).json({ error: "Ошибка сервера" });
        res.json({ message: "Сообщение отправлено", id: this.lastID });
    }
);

```

4. Уязвимость: SQL-инъекция в поиске пользователей
Эксплуатация: При наличии пользователя с логином ' UNION SELECT username, password FROM users -- раскрываются все учётные данные
Причина: Нефильтрованный параметр search в LIKE-запросе
Исправление: В файле index.js заменяем:
```bash
app.get("/users", (req, res) => {
    const { search } = req.query
    const query = `SELECT * FROM users WHERE username LIKE '%${search}%'`
    db.all(query, (err, users) => {
        if (err) return res.status(500).json({ error: "Ошибка сервера" })
        res.json(users)
    })
})
```
На этот:
```bash
app.get("/users", (req, res) => {
    const { search } = req.query
    const query = `SELECT * FROM users WHERE username LIKE ?`;
    const searchPattern = `%${search}%`;
    db.all(query, [searchPattern], (err, users) => { 
        if (err) return res.status(500).json({ error: "Ошибка сервера" })
        res.json(users) 
    });
})
```
Результат: Защита от инъекций при сохранении функциональности поиска.

5. Уязвимость: XSS-атака в отображении сообщений
Эксплуатация: Возможность выполнения произвольного JavaScript-кода через содержимое сообщений
Причина: Использование опасного метода dangerouslySetInnerHTML
Исправление: В файле messages.tsx заменяем уязвимый код на безопасный вывод текста
```bash
dangerouslySetInnerHTML={{ __html: msg.content }}
```
На этот:
```bash
<div
    key={index}
    className="p-1 border-b last:border-none"
>
    {msg.content}
</div>
```

6. Добавил хэширование паролей с bycrypt
