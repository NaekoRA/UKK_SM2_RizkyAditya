const koneksi = require('./db')
const bcrypt = require('bcryptjs');
const allUser = (callback) => {
    koneksi.query('SELECT  * FROM users',callback)
}

const seleactUserById = (idUser, callback) => {
    const q = 'SELECT * FROM users WHERE id = ?'
    koneksi.query(q,[idUser],callback)
}
const seleactUserByEmail = (email, callback) => {
    const q = 'SELECT * FROM users WHERE email = ?'
    koneksi.query(q, [email], callback)
}

const insertUser = (username, email, password, role, callback) => {
    if (password) {
        const q = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        koneksi.query(q, [username, email, password, role], callback);
    } else {
        console.error('password harus di isi');
    }
}

const updateUser = (idUser, bio, avatar, callback) => {
    const q = 'UPDATE users SET bio = ?, avatar = ? WHERE id = ?'
    koneksi.query(q, [bio, avatar, idUser], callback)
}
const deleteUser = (idUser, callback) => {
    const q = 'DELETE FROM users WHERE id = ?'
    koneksi.query(q, [idUser], callback)
}
module.exports = {
    seleactUserById,
    seleactUserByEmail,
    insertUser,
    updateUser,
    deleteUser,
    allUser
}