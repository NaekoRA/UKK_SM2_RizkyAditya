const express= require('express')
const route = express.Router()

const comment = require('../controllers/commentControl')
const post = require('../controllers/postControl')
const user = require('../controllers/userControl')
const votes= require('../controllers/votesControl')
const authJWT = require('../middleware/auth')

//user
route.get('/users',user.getAllUser)
route.get('/users/:id', user.getUserByid)
route.post('/users/regis',user.register)
route.post('/users/login', user.login)
route.put('/users/update', authJWT,user.upload.single('avatar'), user.updateUser)
route.delete('/users/:idUser',user.deleteUser)

//post
route.get('/posts', post.gettAllPost)
route.get('/post/:id', post.gettPostById)
route.get('/posts/:idUser', post.getPostByUserId)
route.post('/posts',authJWT,post.upload.single('media'), post.createPost)
route.put('/posts/:id',authJWT, post.upload.single('media'), post.updatePost)
route.delete('/posts/:id', post.deletePost)
//vote
route.get('/votes/:postId', votes.getVotes)
route.post('/votes/:postId',authJWT, votes.votePost)
route.delete('/votes/:postId',authJWT,votes.removeVote)
//comment
route.get('/comment/:postId', comment.getComments)
route.post('/comment/:postId',authJWT,comment.createComment)
route.delete('/comment/:commentId',authJWT,comment.deleteComment)
//impoet excel
const excel = require('../controllers/excelControl')
const uplaodExcel = require('../middleware/excel')
route.post('/excel',uplaodExcel.single('file'),excel.importExcel)

module.exports = route