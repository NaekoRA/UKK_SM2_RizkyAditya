const db = require('../models/db');

const getPostsByUserId = (userId, callback) => {
    db.query(`
        SELECT 
            posts.*,
            users.username,
            users.avatar,
            users.bio,
            (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND type = 'upvote') AS upvotes,
            (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND type = 'downvote') AS downvotes
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
            users.bio,
            (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND type = 'upvote') AS upvotes,
            (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND type = 'downvote') AS downvotes
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
    `, callback);
};

const gettPostById = (id, callback) => {
    db.query(`
        SELECT
            posts.*,
            users.username,
            users.avatar,
            users.bio,
            (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND type = 'upvote') AS upvotes,
            (SELECT COUNT(*) FROM votes WHERE post_id = posts.id AND type = 'downvote') AS downvotes
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
    `, [id], callback);
};

const insertPost = (texts, media, idUser, callback) => {
    db.query(
        "INSERT INTO posts (texts, media, user_id) VALUES (?, ?, ?)",
        [texts, media, idUser],
        callback
    );
};

const updatePost = (id, texts, media, callback) => {
    db.query(
        "UPDATE posts SET texts = ?, media = ? WHERE id = ?",
        [texts, media, id],
        callback
    );
};

const deletePost = (id, callback) => {
    db.query(
        "DELETE FROM posts WHERE id = ?",
        [id],
        callback
    );
};

module.exports = {
    gettAllPost,
    gettPostById,
    insertPost,
    updatePost,
    deletePost,
    getPostsByUserId
};