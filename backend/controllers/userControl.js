const user = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const authJWT = require('../middleware/auth')
const { MessagePort } = require('worker_threads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage })
const getAllUser = (req, res) => {
  user.allUser((err, results) => {
    if (err) res.status(402).json({ message: 'error mengambil user' })
    if (results.length === 0) res.status(404).json({ message: "user Tidak di temukan" })
    res.json(results)
  })
}
const getUserByid = (req, res) => {
  const id = req.params.id
  user.seleactUserById(id, (err, results) => {
    if (err) res.status(402).json({ message: 'error mengambil user' })
    if (results.length === 0) res.status(404).json({ message: "user Tidak di temukan" })
    res.json(results[0])
  })
}

const register = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "Data tidak lengkap" });
  const hashedPassword = bcrypt.hashSync(password, 10);
  user.insertUser(username, email, hashedPassword, (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "email sudah digunakan" });
      }
      return res.status(500).json({ message: "Gagal mendaftarkan user", error: err });
    }
    res.status(201).json({ message: "User berhasil didaftarkan", userId: results.insertId });
  });
};
const updateUser = (req, res) => {
  const idUser = req.user.id;
  const { bio } = req.body;
  const avatar = req.file ? req.file.filename : null;
  user.updateUser(idUser, bio, avatar, (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal update profile", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ message: "Profile berhasil diupdate", avatar });
  });
};

const login = (req, res) => {
  const { email, password } = req.body
  user.seleactUserByEmail(email, (err, results) => {
    if (err) return res.status(407).json({ message: 'error login' })
    if (results.length === 0) return res.status(404).json({ message: 'user tidak ada' })
    const user = results[0]
    const validpassword = bcrypt.compareSync(password, user.password)
    if (!validpassword) return res.status(400).json({ message: 'password salah' })
    const token = jwt.sign({ id: user.id }, 'admin#123', { expiresIn: 86400 })
    res.status(202).json({ auth: true, token, id: user.id })

  })
}

const deleteUser = (req, res) => {
  const idUser = req.params.idUser;
  user.deleteUser(idUser, (err, results) => {
    if (err) return res.status(500).json({ message: 'error delete' ,err}); 
    if (results.affectedRows === 0)
      return res.status(404).json({ message: 'user tidak ditemukan' }); 

    res.json({ message: 'berhasil di hapus' }); 
  });
};

module.exports = {
  upload,
  register,
  updateUser,
  login,
  deleteUser,
  getUserByid,
  getAllUser

}