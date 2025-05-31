const Comments = require("../models/comment");

const getComments = (req, res) => {
    const postId = req.params.postId;

    Comments.getCommentsByPostId(postId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const createComment = (req, res) => {
    const postId = req.params.postId;
    const idUser = req.user.id; 
    const { comment, parentCommentId } = req.body;

    if (!comment) {
        return res.status(400).json({ error: "Komentar tidak boleh kosong" });
    }

    Comments.insertComment(postId, idUser, comment, parentCommentId || null, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Komentar berhasil ditambahkan", commentId: results.insertId });
    });
};

const deleteComment = (req, res) => {
    const commentId = req.params.commentId;
    const idUser = req.user.id; 

    Comments.deleteCommentById(commentId, idUser, (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal menghapus komentar" });
        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "Kamu tidak punya izin untuk menghapus komentar ini" });
            
        }

        res.json({ message: "Komentar berhasil dihapus" });
    });
};

module.exports = {
    getComments,
    createComment,
    deleteComment,
};
