const mysql = require('mysql2')
const koneksi = require('../models/db')
const koneksiMysql = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: ''
})

const createUserTable = (koneksi) => {
    const q = `
    CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR (20) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL,
    avatar TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
    )
    `
    koneksi.query(q, log('users'))
}
const createPostTable = (koneksi) => {
    const q = `
    CREATE TABLE IF NOT EXISTS posts(
    id INT PRIMARY KEY AUTO_INCREMENT,
    media TEXT,
    texts TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
    )
    `
    koneksi.query(q, log('posts'))
}
const createCommentTable = (koneksi) => {
    const q = `
    CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        parent_id INT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    )
    `
    koneksi.query(q, log('comments'))
}
const createVotesTable = (koneksi) => {
    const q = `
    CREATE TABLE IF NOT EXISTS votes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      type ENUM('upvote', 'downvote') NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_vote (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
    koneksi.query(q, log("votes"));
};
const log = (name) => (err) => {
    if (err) {
        return console.error(`error saat membuat${name}`, err);
    } console.log(`${name} telah di buat`);
}
const migration = () => {
    koneksiMysql.connect((err) => {
        if (err) return console.error(`koneksi gagal`);
    })
    console.log('berhasil connect');

    koneksiMysql.query("CREATE DATABASE IF NOT EXISTS ukk_sm2_adit", (err) => {
        if (err) {
            return console.error('gagal membuat database')
        }
        console.log('berhasil membuat database');
        createUserTable(koneksi)
        createPostTable(koneksi)
        createCommentTable(koneksi)
        createVotesTable(koneksi)
        koneksiMysql.end()

    })
}
module.exports = migration