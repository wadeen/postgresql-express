const express = require("express");
const pool = require("./db");
const app = express();

const PORT = 3000;

// JSONで返す場合はmiddlewareの設定が必要
app.use(express.json()); // => req.body

// ユーザー情報を全て取得する
app.get("/users", (_, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    return res.status(200).json(results.rows);
  });
});

// ----------------------------------------
app.listen(PORT, () => {
  console.log("server started");
});
app.get("/", (req, res) => {
  res.send("Hello Express!");
});
