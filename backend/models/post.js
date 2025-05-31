const db = require('../models/db')

const getPostsByUserId = (userId, callback) => {
    db.query(`
        SELECT 
            posts.*,
            users.username,
            users.avatar,
            users.bio
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY posts.created_at DESC
    `, [userId], callback);
};
const gettAllPost = (callback) => {
    db.query(`
        SELECT 
            posts.*,
            users.username,
            users.avatar,
            users.bio
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
        `, callback)
}

const gettPostById = (id, callback) => {
    db.query(`
        SELECT
        posts.*,
        users.username,
        users.avatar,
        users.bio
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
        `, [id], callback)
}
const insertPost = (texts, media, idUser, callback) => {
    db.query("INSERT INTO posts (texts, media, user_id)values(?,?,?)",
        [texts, media, idUser],
        callback
    )

}
const updatePost = (idUser, texts, media, callback) => {
    db.query("UPDATE posts SET texts = ?, media = ? WHERE id = ?",
        [texts, media, idUser],
        callback
    )
}
const deletePost = (id, callback) => {
    db.query("DELETE FROM posts WHERE id = ?",
        [id],
        callback
    )
}
module.exports = {
    gettAllPost,
    gettPostById,
    insertPost,
    updatePost,
    deletePost,
    getPostsByUserId
}

