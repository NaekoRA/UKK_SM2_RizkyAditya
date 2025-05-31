const post = require('../models/post')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/media')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

const gettAllPost = (req, res) => {
    post.gettAllPost((err, results) => {
        if (err) return res.status(500).json({ Error: err.message })
        
        const formoatedPost = results.map(post => ({
            ...post,
            media_url: post.media ? `/uploads/media/${post.media}` : null,
            avatar_url: post.avatar ? `/uploads/media/${post.avatar}` : null
        }))
        res.json(formoatedPost);
    })
}

const gettPostById = (req, res) => {
    const postId = req.params.id;
    post.gettPostById(postId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Post not found" });
        
        const post = results[0];
        res.json({
            ...post,
            media_url: post.media ? `/uploads/media/${post.media}` : null,
            avatar_url: post.avatar ? `/uploads/avatars/${post.avatar}` : null
        });
    });
};
const getPostByUserId = (req, res) => {
    const idUser = req.params.idUser
    post.getPostsByUserId(idUser, (err, results) => {
        if(err) return res.status(500).json({error:err.message})
        
          const formoatedPost = results.map(post => ({
            ...post,
            media_url: post.media ? `/uploads/media/${post.media}` : null,
            avatar_url: post.avatar ? `/uploads/media/${post.avatar}` : null
        }))
        res.json(formoatedPost);
    })
}

const createPost = (req, res) => {
    const { texts } = req.body
    const idUser = req.user.id
    
    if (!texts) {
        return res.status(400).json({error:'harap isi texts'})
    }
    const media = req.file ? req.file.filename : null;
    post.insertPost(texts, media,idUser, (err, results) => {
        if (err) return res.status(500).json({ error: err.message })
        res.status(201).json({
            message: 'post berhasil',
            postId: results.insertId,
            media
        })
    })
}
const updatePost = (req, res) => {
    const postId = req.params.id;
    const { texts } = req.body;
    const media = req.file ? req.file.filename : null;

    post.updatePost(postId, texts, media, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Post berhasil diupdate", media });
    });
};
const deletePost = (req, res) => {
    const postId = req.params.id

    post.deletePost(postId,(err, results)=> {
        if (err) return res.status(500).json({ error: err.message })
        res.json({message:'post berhasil dihapus'})
    })
}
module.exports = {
    upload,
    getPostByUserId,
    gettAllPost,
    gettPostById,
    createPost,
    updatePost,
    deletePost
}