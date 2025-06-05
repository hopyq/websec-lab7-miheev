const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
const port = 3001

const db = new sqlite3.Database("database.db", (err) => {
    if (err) {
        console.error("Ошибка подключения к базе данных:", err)
    } else {
        console.log("Подключено к базе данных SQLite")
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`)
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            content TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`)
    }
})

app.use(cors())
app.use(bodyParser.json())

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`)

    db.run(
        `INSERT OR IGNORE INTO users (username, password) VALUES ('admin', 'password123')`
    )
})

app.post("/auth/register", (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" })
    }

    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, password],
        function (err) {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "User already exists or database error" })
            }
            res.json({ success: true, userId: this.lastID })
        }
    )
})

app.post("/auth/login", (req, res) => {
    const { username, password } = req.body
    const query = `SELECT * FROM users WHERE username = ?`;
        db.get(query, [username], (err, user) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: "Ошибка сервера" });
            }
            if (!user) {
                return res.status(401).json({ error: "Неверные данные" });
            }
            
            const isValidPassword = bcrypt.compareSync(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: "Неверные данные" });
            }
            
            res.json({ message: "Успешный вход", user });
        });

app.post("/messages", (req, res) => {
    const { user_id, content } = req.body
    db.run(
    `INSERT INTO messages (user_id, content) VALUES (?, ?)`,
    [user_id, content],
    function (err) {
        if (err) return res.status(500).json({ error: "Ошибка сервера" });
        res.json({ message: "Сообщение отправлено", id: this.lastID });
    }
);

app.get("/users", (req, res) => {
    const { search } = req.query
    const query = `SELECT * FROM users WHERE username LIKE ?`;
    const searchPattern = `%${search}%`;
    db.all(query, [searchPattern], (err, users) => { 
        if (err) return res.status(500).json({ error: "Ошибка сервера" })
        res.json(users) 
    });
})

db.run(
    `UPDATE users SET username = ? WHERE id = ?`,
    [username, id],
    function (err) {
        if (err) return res.status(500).json({ error: "Ошибка сервера" });
        res.json({ message: "Имя пользователя обновлено" });
    }
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
