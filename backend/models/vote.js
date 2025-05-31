const koneksi = require("./db");

const upsertVote = (postId, idUser, type, callback) => {
  const q = `
    INSERT INTO votes (post_id, user_id, type)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE type = VALUES(type), created_at = NOW()
  `;
  koneksi.query(q, [postId, idUser, type], callback);
};

const deleteVote = (postId, idUser, callback) => {
  const q = `DELETE FROM votes WHERE post_id = ? AND user_id = ?`;
  koneksi.query(q, [postId, idUser], callback);
};

const countVotes = (postId, callback) => {
  const q = `
    SELECT
      SUM(type = 'upvote') AS upvotes,
      SUM(type = 'downvote') AS downvotes
    FROM votes
    WHERE post_id = ?
  `;
  koneksi.query(q, [postId], callback);
};

module.exports = {
  upsertVote,
  deleteVote,
  countVotes,
};
