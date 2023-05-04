const express = require("express");
const pool = require("./db");
const app = express();

const PORT = 3000;

// JSONで返す場合はmiddlewareの設定が必要
app.use(express.json()); // => req.body

// ユーザー情報を全て取得
app.get("/users", (_, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    return res.status(200).json(results.rows);
  });
});

// 特定のユーザー情報を取得
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
    if (err) throw err;
    return res.status(200).json(results.rows);
  });
});

// ユーザー情報を追加
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;

  // ユーザーがすでに存在しているかの確認
  pool.query("SELECT s FROM users s WHERE s.email = $1", [email], (_, results) => {
    if (results.rows.length) return res.send("既にユーザーが存在しています");

    // 新規ユーザーの場合は追加
    pool.query("INSERT INTO users (name, email, age) VALUES ($1, $2, $3)", [name, email, age], (err) => {
      if (err) throw err;
      return res.status(201).send(`ユーザーを作成しました! `);
    });
  });
});

// ユーザー情報を削除
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
    if (err) throw err;

    const isUserExist = results.rows.length;
    if (!isUserExist) {
      return res.send("ユーザーが存在しません");
    }

    pool.query("DELETE FROM users WHERE id = $1", [id], (err) => {
      if (err) throw err;
      return res.status(200).send(`ユーザーを削除しました! `);
    });
  });
});

// ユーザー情報を更新
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
    if (err) throw err;

    const isUserExist = results.rows.length;
    if (!isUserExist) {
      return res.send("ユーザーが存在しません");
    }

    pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, id], (err) => {
      if (err) throw err;
      return res.status(200).send(`ユーザー情報を更新しました! `);
    });
  });
});

// ----------------------------------------
app.listen(PORT, () => {
  console.log("server started");
});
app.get("/", (_, res) => {
  res.send("Hello Express!");
});

// ユーザーが存在しているかの確認（ID参照）
// pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {});
